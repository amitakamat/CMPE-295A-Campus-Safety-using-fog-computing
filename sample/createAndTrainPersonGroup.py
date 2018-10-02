from faceHelpers import *
from fileHelpers import *
import json
from PersonRepository import PersonRepository

personGroupId = 'sjsucriminals1'
folderName = 'Criminals'
personRepo = PersonRepository()

# Dict to store person id's of the persons created
personNameToPersonIdDict = {}

# Step 1 : create person group
#createPersonGroup(personGroupId)

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
            personNameToPersonIdDict.setdefault(person, personIdDict.get('personId'))
            print('Successfully added {} to person_group {}\n'.format(person, personGroupId))
        personRepo.writeToFile(personNameToPersonIdDict, personGroupId)
    else:
        print('No persons found in location: {}'.format(folderName))
        exit(0)

#addPersonsToPersonGroup(personGroupId)
personNameToPersonIdDict = personRepo.readFromFile(personGroupId)





# b. Add faces for persons in person_group

def addFacesForPersons(personGroupId, folderName):
    for person, personId in personNameToPersonIdDict.items():
        print(person, personId)
        for picture in getPersonPictures(person, folderName):
            print('{} of {} in {}'.format(picture, person, personGroupId))

addFacesForPersons(personGroupId, folderName)


