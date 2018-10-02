from faceHelpers import *
from fileHelpers import *
import json
from PersonRepository import PersonRepository

personGroupId = 'sjsucriminals'
folderName = 'Criminals'
personRepo = PersonRepository()

# Dict to store person id's of the persons created
personNameToPersonIdDict = {}

# try to read data from database if it exists
personNameToPersonIdDict = personRepo.readFromFile(personGroupId)

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
            personNameToPersonIdDict[person] = { 'personId' : personIdDict.get('personId'),
                'persisted-face-id-list' : [] }
            print('Successfully added {} to person_group {}\n'.format(person, personGroupId))
        personRepo.writeToFile(personNameToPersonIdDict, personGroupId)
    else:
        print('No persons found in location: {}'.format(folderName))
        exit(0)

# b. Add faces for persons in person_group

def addFacesForPersons(personGroupId, folderName):
    for person, personDict in personNameToPersonIdDict.items():
        print(person, personDict)
        for picture in getPersonPictures(person, folderName):
            print('Adding face {} of {} in {}'.format(picture, person, personGroupId))
            persFaceIdDict = addPersonFace(picture, personGroupId, personDict['personId'])
            print(persFaceIdDict)
            personNameToPersonIdDict[person]['persisted-face-id-list'].append(persFaceIdDict['persistedFaceId'])
    personRepo.writeToFile(personNameToPersonIdDict, personGroupId)
    print(personNameToPersonIdDict)

if not personNameToPersonIdDict:
    addPersonsToPersonGroup(personGroupId)            
    addFacesForPersons(personGroupId, folderName)
else:
    print('read data from database')

print(personNameToPersonIdDict)




