#!/usr/bin/env python

from faceHelpers import *
from fileHelpers import *
import json
from PersonRepository import PersonRepository
from sys import argv

ENDC = '\033[0m'

personRepo = PersonRepository()

def deleteEmptyPersonGroups():
    for personGroup in listPersonGroups(1000):
        listOfPersons = listPersons(personGroup['personGroupId'], 1000)
        if len(listOfPersons) == 0:
            deletePersonGroup(personGroup['personGroupId'])
            personRepo.deleteRepository(personGroup['personGroupId'])
        
def deleteAllPersonGroups():
    for personGroup in listPersonGroups(1000):
        print('deleting person_group {}'.format(personGroup['personGroupId']))
        deletePersonGroup(personGroup['personGroupId'])
        personRepo.deleteRepository(personGroup['personGroupId'])

def deletePersonGroups(PersonGroupIdList):
    for personGroup in PersonGroupIdList:
        deletePersonGroup(personGroup)
        personRepo.deleteRepository(personGroup)


if __name__ == '__main__':
    print('Which person group(s) you want to delete?' + ENDC)
    print('Press 0 for All')
    print('Press 1 for Empty')
    print('Press 2 for custom')

    try:
        choice = int(input('\nEnter a number, 0-2: '))
    except ValueError:
        print('Enter a valid number, 0-2!')
        exit()

    if choice == 0:
        deleteAllPersonGroups()
    elif choice == 1:
        deleteEmptyPersonGroups()
    elif choice == 2:
        personGroups = input('\nEnter comma separated list of person group: ')
        personGroupList = personGroups.split(',')
        personGroupList = [personGroup.strip() for personGroup in personGroupList]
        print(personGroupList)
        deletePersonGroups(personGroupList)
