import os
from definitions import *

import json
import pymongo

connection = pymongo.MongoClient()
db = connection.people


#function to return list of persons from mongoDB
def getPersonsFromDB(personGroupId):
    collection = db[personGroupId]
    cursor = collection.find({})

    listOfNames = []
    for document in cursor:
        listOfNames.append(document['First Name'])
    print(len(listOfNames))
    return listOfNames
    
#print(getPersons('criminals'))

# function to return list of pictures of a person from database collection 
def getPersonPicturesFromDB(personName, personGroupId):
    collection = db[personGroupId]
    document = collection.find_one({"First Name": personName})
    print(document)
    personPictures = document['image']
    #print(personPictures)
    return personPictures

#print(getPersonPictures('RONALD JOHN', 'criminals'))