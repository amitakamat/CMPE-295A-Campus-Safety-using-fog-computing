#!/usr/env/bin python

import json
import os
import abc
import pymongo

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

# create connection to mongoDB
connection = pymongo.MongoClient('mongodb+srv://new_admin:admin@cluster0-h7uii.mongodb.net/CriminalDB')

# select the people database
db = connection.CriminalDB

class MongoRepository:
    """A class to store and retrieve person information from mongoDB"""
    def getData(self, personGroupId):
        print('Begin: Find all from Database')

        # The list of documents to return    
        docList = []

        collection = db[personGroupId]
        cursor = collection.find({})
        for document in cursor:
            docList.append(document)

        print('End: Find all from Database')
        return docList

    def findOneDocument(self, personGroupId, firstName):
        print('Begin: Find document from Database')
        
        collection = db[personGroupId]
        
        document = collection.find_one({"First Name":firstName})

        print('End: Find document from Database')
        return document

    def deleteDocument(self, personGroupId, firstName):
        print('Begin: delete document')
        collection = db[personGroupId]
        result = collection.delete_one({"First Name":firstName})
        if result == 0:
            print("No document found with the given First Name")
        print('End: delete document')

    def updateDocument(self, personGroupId, fullName, personId, persisted_face_id_list):
        print('Begin: Update document')
        
        collection = db[personGroupId]
        result = collection.update_one( {'fullname': fullName},
        {"$set": {'personId' : personId, 'persisted-face-id-list' : persisted_face_id_list} })
        if result == 0:
            print("No document found with the given First Name")

        print('End: Update document')

    def addAlert(self, document):
        print('Begin: Add alert')
        collection = db['alerts']
        result = collection.insert_one(document)
        print('End: Add alert')
        return result.inserted_id
        