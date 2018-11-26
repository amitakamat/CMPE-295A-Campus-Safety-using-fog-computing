#!/usr/bin/env python3
import base64
import pymongo

connection = pymongo.MongoClient('mongodb+srv://new_admin:admin@cluster0-h7uii.mongodb.net/CriminalDB')
db = connection.CriminalDB

def createCollectionForStudents(collectionName):
    newCollection = db[collectionName]

    # Nethra
    image1 = open('../resources/Students/Nethra/Nethra1.jpeg', 'rb')
    encodedImageString1 = base64.b64encode(image1.read()).decode("utf-8")

    nethraDict = {}
    nethraDict['firstname'] = 'nethra'
    nethraDict['lastname'] = 'reddy'
    nethraDict['imageData'] = encodedImageString1
    newCollection.insert_one(nethraDict)

    # Haroon
    image2 = open('../resources/Students/Haroon/1.jpeg', 'rb')
    encodedImageString2 = base64.b64encode(image2.read()).decode("utf-8")

    #encodedImageString = encodedImage.decode("utf-8")
    haroonDict = {}
    haroonDict['firstname'] = 'Mohammed Haroon'
    haroonDict['lastname'] = 'Shareef'
    haroonDict['imageData'] = encodedImageString2
    newCollection.insert_one(haroonDict)


createCollectionForStudents('studentRecords')
"""
document = newCollection.find_one({})
b64Img = base64.b64decode(document['encodedString'])
image_result = open('testingimage' + '.jpg', 'wb')
image_result.write(b64Img)

decodedImage = base64.decodebytes(encodedImage)
print(type(decodedImage))
image_result = open('deer_decode.gif', 'wb')
image_result.write(decodedImage)


newCollection = db['criminals_backup']
document = newCollection.find_one({})
b64Img = base64.b64decode(document['imageData'])
imageName = document['fullname']
#decodedImageFromDB = base64.decodebytes(b64Img)
image_result = open('./testingFolder/' + imageName + '.jpg', 'wb')
#image_result.write(decodedImageFromDB)
image_result.write(b64Img)
"""