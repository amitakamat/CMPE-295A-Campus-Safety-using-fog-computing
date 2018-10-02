from faceHelpers import *
from fileHelpers import *
import json
from PersonRepository import PersonRepository

personGroupId = 'criminals'

def deleteEmptyPersonGroups():
    for personGroup in listPersonGroups(1000):
        listOfPersons = listPersons(personGroup['personGroupId'], 1000)
        if len(listOfPersons) == 0:
            deletePersonGroup(personGroup['personGroupId'])
        
def deleteAllPersonGroups():
    for personGroup in listPersonGroups(1000):
        print('deleting person_group {}'.format(personGroup['personGroupId']))
        deletePersonGroup(personGroup['personGroupId'])

def deletePersonGroups(PersonGroupIdList):
    for personGroup in PersonGroupIdList:
        deletePersonGroup(personGroup)

#deleteAllPersonGroups()

deletePersonGroups(['criminalsa'])