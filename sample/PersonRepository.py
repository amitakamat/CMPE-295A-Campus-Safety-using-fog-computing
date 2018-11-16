#!/usr/env/bin python

import json
import os
import abc

class PersonRepository1:
    """
    Define the interface of interest to clients.
    """

    def __init__(self, strategy):
        self._strategy = strategy

    def writeToRepository(self, data, fileName):
        self._strategy.writeToRepository(data, fileName)

    def readFromRepository(self, fileName):
        self._strategy.readFromRepository(fileName)

    def deleteRepository(self, fileName):
        self._strategy.deleteRepository(fileName)

class Strategy(metaclass=abc.ABCMeta):
    """
    Declare an interface common to all supported algorithms. Context
    uses this interface to call the algorithm defined by a
    ConcreteStrategy.
    """

    @abc.abstractmethod
    def writeToRepository(self, data, fileName):
        pass

    @abc.abstractmethod
    def readFromRepository(self, fileName):
        pass

    @abc.abstractmethod
    def adeleteRepository(self, fileName):
        pass

class PersonRepository:
    """A class to store and retrieve person information from files"""
    
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

    # get person name from given personId
    def getPersonNameFromRepository(self, fileName, personId):
        print('\nBegin: get name from repository:\n')
        with open(fileName + '.json', 'r') as jsonFp:
            data = json.load(jsonFp)
            for person in data:
                if personId == data[person]["personId"]:
                    return data[person]['person']
        print("Person with personId:{} not found in database".format(personId))
        return ""

class MongoRepository:
    """A class to store and retrieve person information from mongoDB"""
    
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

    # get person name from given personId
    def getPersonNameFromRepository(self, fileName, personId):
        print('\nBegin: get name MongoDB:\n')
        with open(fileName + '.json', 'r') as jsonFp:
            data = json.load(jsonFp)
            for person in data:
                if personId == data[person]["personId"]:
                    return data[person]['person']
        print("Person with personId:{} not found in database".format(personId))
        return ""