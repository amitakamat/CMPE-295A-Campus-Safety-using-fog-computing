from faceHelpers import *
from fileHelpers import *
import json
from PersonRepository import PersonRepository
import time

personGroupId = 'sjsustudents'
folderName = 'Students'
personRepo = PersonRepository()

# Dict to store person id's of the persons created
personNameToPersonIdDict = {}

# Step 1 : create person group

# Step 2 : Add persons to person_group
def addPersonsToPersonGroup(personGroupId):
    persons = getPersons(folderName)
    print(persons)
    # a. Add Persons to person_group
    if type(persons) is list and len(persons) > 0:
        print('Adding persons to person_group {}'.format(personGroupId))
        for person in persons:
            print('Adding {} to person_group {}'.format(person, personGroupId))
            personIdDict = createPerson(personGroupId, person)
            personNameToPersonIdDict[person] = { 'personId' : personIdDict.get('personId'),
                'persisted-face-id-list' : [] }
            print('Successfully added {} to person_group {}\n'.format(person, personGroupId))
        personRepo.writeToRepository(personNameToPersonIdDict, personGroupId)
    else:
        print('No persons found in location: {}'.format(folderName))
        exit(0)

# b. Add faces for persons in person_group

def addFacesForPersons(personGroupId, folderName):
    """ Add faces for each person available in database """
    for person, personDict in personNameToPersonIdDict.items():
        print(person, personDict)
        for picture in getPersonPictures(person, folderName):
            print('Adding face {} of {} in {}'.format(picture, person, personGroupId))
            persFaceIdDict = addPersonFace(picture, personGroupId, personDict['personId'])
            print(persFaceIdDict)
            if persFaceIdDict:
                personNameToPersonIdDict[person]['persisted-face-id-list'].append(persFaceIdDict['persistedFaceId'])



personGroupCreationStatus = createPersonGroup(personGroupId)
if personGroupCreationStatus == -1:
    personNameToPersonIdDict = personRepo.readFromRepository(personGroupId)
    print(personNameToPersonIdDict)    
else:
    # Add persons to person group
    addPersonsToPersonGroup(personGroupId)            

    # Add faces for persons
    addFacesForPersons(personGroupId, folderName)

    # Write to database
    personRepo.writeToRepository(personNameToPersonIdDict, personGroupId)
    print(personNameToPersonIdDict)

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









