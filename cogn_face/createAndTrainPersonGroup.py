from faceHelpers import *
from fileHelpers import *
import json

personGroupId = 'sjsucriminals1'
folderName = 'Criminals'

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
        writeToFile(personNameToPersonIdDict)
    else:
        print('No persons found in location: {}'.format(folderName))
        exit(0)

def writeToFile(data):
    print('Begin: write personIds to file')
    with open('personIds.json', 'w') as jsonFp:
        json.dump(data, jsonFp)
    print('End: write personIds to file')

def readFromFile():
    print('Begin: Read personIds to file')
    with open('personIds.json', 'r') as jsonFp:
        data = json.load(jsonFp)
    print('End: Read personIds to file')
    return data
#addPersonsToPersonGroup(personGroupId)





# b. Add faces for persons in person_group

#for person, personId in personNameToPersonIdDict.items():
#    for picture in getPersonPictures(person, folderName):


