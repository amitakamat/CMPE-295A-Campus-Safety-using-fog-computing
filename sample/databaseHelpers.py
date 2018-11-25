import os
from definitions import *

import json
import pymongo

connection = pymongo.MongoClient('mongodb+srv://new_admin:admin@cluster0-h7uii.mongodb.net/CriminalDB')
db = connection.CriminalDB

# This is the original collection. Do not modify it
originalCollection = 'criminalRecords'

#function to create new collection from existing collection
def createNewCollection(personGroupId):
    """
        Creates a new collection with given name and adds fullname attribute to the collection
    """
    oldCollection = db[originalCollection]
    cursor = oldCollection.find({})

    newCollection = db[personGroupId]

    # For each old document, create a new document in other collection
    for document in cursor:
        document['fullname'] = document['firstname'] + " " + document['lastname']
        newCollection.insert(document)
    print("New collection: " + personGroupId + " created!")

#createNewCollection('criminals_backup')
#function to return list of persons from mongoDB
def getPersonsFromDB(personGroupId):
    collection = db[personGroupId]
    cursor = collection.find({})

    listOfNames = []
    for document in cursor:
        listOfNames.append(document['fullname'])
    return listOfNames
    
#print(getPersonsFromDB('criminals'))

# function to return list of pictures of a person from database collection 
def getPersonPicturesFromDB(personName, personGroupId):
    collection = db[personGroupId]
    document = collection.find_one({"fullname": personName})
    personPictures = [document['imageData']]
    return personPictures

#print(getPersonPicturesFromDB('paul alvarez', 'criminals'))

# function to get name of person using personId
def getPersonNameFromDB(personId, personGroupId):
    collection = db[personGroupId]
    document = collection.find_one({"personId": personId})
    personName = [document['fullname']]
    return personName