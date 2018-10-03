#!/usr/env/bin python

import json
import os

class PersonRepository:
    """A class to store and retrieve person information"""
    
    def writeToRepository(self, data, fileName):
        print('Begin: write personIds to file')
        with open(fileName + '.json', 'w') as jsonFp:
            json.dump(data, jsonFp)
        print('End: write personIds to file')

    def readFromRepository(self, fileName):
        print('Begin: Read personIds to file')
        with open(fileName + '.json', 'r') as jsonFp:
            data = json.load(jsonFp)
        print('End: Read personIds to file')
        return data

    def deleteRepository(self, fileName):
        print('Begin: delete file')
        if os.path.exists(fileName + '.json'):
            os.remove(fileName + '.json')
        else:
            print("File doesn't exists")
        print('End: delete file')