#!/usr/env/bin python

import json

class PersonRepository:
    """A class to store and retrieve person information"""
    
    def writeToFile(self, data, fileName):
        print('Begin: write personIds to file')
        with open(fileName + '.json', 'w') as jsonFp:
            json.dump(data, jsonFp)
        print('End: write personIds to file')

    def readFromFile(self, fileName):
        print('Begin: Read personIds to file')
        with open(fileName + '.json', 'r') as jsonFp:
            data = json.load(jsonFp)
        print('End: Read personIds to file')
        return data    