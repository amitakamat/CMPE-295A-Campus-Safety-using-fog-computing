from faceHelpers import *
from databaseHelpers import *
from databaseHelpers import *
import json
from PersonRepository import MongoRepository
import time
import base64
import definitions

personGroupId = 'criminals'
folderName = 'Criminals'

#personRepo = PersonRepository()
personRepo = MongoRepository()

# Dict to store person id's of the persons created
personNameToPersonIdDict = {}

# Step 1 : create person group

# Step 2 : Add persons to person_group
def addPersonsToPersonGroup(personGroupId):
    # Step 1: Create a new collection from existing collection and name it as personGroupId
    try:
        createNewCollection(personGroupId)
    except Exception as e:
        print(e)
        print('collection already created!')

    # Step 2: Get persons from collection
    persons = getPersonsFromDB(personGroupId)

    # Step 3: Add Persons to person_group
    if type(persons) is list and len(persons) > 0:
        print('Adding persons to person_group {}'.format(personGroupId))
        for person in persons:
            print('Adding {} to person_group {}'.format(person, personGroupId))
            personIdDict = createPerson(personGroupId, person)

            # Add personId and persistedFaceId's to the database
            personRepo.updateDocument(personGroupId,
                 fullName = person,
                 personId = personIdDict.get('personId'),
                 persisted_face_id_list = [])

            print('Successfully added {} to person_group {}\n'.format(person, personGroupId))
    else:
        print('No persons found in database: {}'.format(personGroupId))
        exit(0)
####################################################################################################

# b. Add faces for persons in person_group

def addFacesForPersons(personGroupId):
    """
     Add faces for each person available in database and update the database
     with
     """
    # Step 1: Get collection from db
    documents =  personRepo.getData(personGroupId)
    for document in documents:
        person = document['fullname']
        personPictures = [document['imageData']]
        personId = document['personId']

        persisted_face_id_list = []
        for pictureObj in personPictures:
            print('Adding face of {} in {}'.format(person, personGroupId))

            picture = base64.b64decode(pictureObj)

            # FaceAPI doesn't work with image obj, So convert the obj to image
            imagePath = os.path.dirname(os.path.abspath(__file__)) + '/testingFolder/' + person + '.jpg'

            # Store the image object as a file
            imageObj = open( imagePath, 'wb')
            imageObj.write(picture)

            # Add faces for person to FaceAPI
            persFaceIdDict = addPersonFace(imagePath, personGroupId, personId)
            print(persFaceIdDict)
            if persFaceIdDict:
                persisted_face_id_list.append(persFaceIdDict['persistedFaceId'])
        # Update list of persisted_face_id's to the db
        personRepo.updateDocument(personGroupId, person, personId, persisted_face_id_list)

####################################################################################################

# Actual work goes here
personGroupCreationStatus = createPersonGroup(personGroupId)
if personGroupCreationStatus == -1:
    # If person group already exists, no need to do any thing
    # just train it
    print("Person group already exists.")
else:
    # Add persons to person group
    addPersonsToPersonGroup(personGroupId)            

    # Add faces for persons
    addFacesForPersons(personGroupId)

# Train the person group
trainPersonGroup(personGroupId)

# Get training status of the person group

retries = 5
while retries > 0:
    trainingStatus = getPersonGroupTrainingStatus(personGroupId)
    if trainingStatus['status'] == 'succeeded':
        print('Training completed!')
        break
    else:
        retries -= 1
        time.sleep(15)
        print('retrying {} more time(s)'.format(retries))
###################################################################################






