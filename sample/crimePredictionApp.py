#!/usr/bin/env python

from PersonRepository import PersonRepository
from faceHelpers import *
from definitions import IMAGE_FOLDER_PATH
from weaponsDetection import *
from helpers import *

from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import Flask,render_template,jsonify,json,request
from pprint import pprint
from bson.json_util import dumps

app = Flask(__name__)

personRepo = PersonRepository()

def detectEmotionsFromFace(detectedFacesList):
    """
    Checks if any face detected has anger, disgust, fear as 0.4
    if yes returns a list of angryPersonsDict
    """
    angryPersonsDict = []
    for detectedFace in detectedFacesList:
        
        personEmotions = detectedFace['faceAttributes']['emotion']
        anger = personEmotions['anger'] 
        fear = personEmotions['fear'] 
        disgust = personEmotions['disgust']

        # if yes get their faceRectangle position
        if anger >= 0.4 or fear >= 0.4 or disgust >= 0.4:
            angryPersonDict = {}
            angryPersonDict['faceRectangle']           = detectedFace['faceRectangle']
            angryPersonDict['emotion']                 = 'angry'
            angryPersonDict['confidence']       = max(anger, fear, disgust)
            angryPersonsDict.append(angryPersonDict)
    return angryPersonsDict


"""
    1. Identifies a person from an image
    2. Identifies angry emotions
    3. Identifies weapons if any
"""
def predictCrime(image, attributes, personGroupId):
    """
    Predicts if crime will occur or not based on image provided
    Will Return a list of thing identifed or an empty list
    e.g. : ['person name haroon identified with confidence: 0.9 and emotions as angry', '']
    """
    # Comma separated List to store details of things detected from images
    # Persons detected, Angry persons emotions, Weapons detected
    listOfDetectedEntities = []
    # step 1: Detect faces from image
    detectedFacesList = detectPersonFace(image, attributes='emotion')

    if not detectedFacesList:
        print('Facial Recognition: No faces detected!\n')
    else:
        print("\nFacial Recognition:\ndetected faces list:")
        print(detectedFacesList)
        listOfIdentifiedFaces = []
        # for each detected face perform face recognition and check the emotions
        for detectedPerson in detectedFacesList:
            # person emotions
            personEmotions = detectedPerson['faceAttributes']['emotion']
            # person face-id
            personFaceId   = detectedPerson['faceId']
            
            # makes a call to face API and tries to identify the person using the faceId provided
            identificationDetails = identifyPersonFace([personFaceId], personGroupId)
            print(identificationDetails)
            if identificationDetails[0]['candidates']:
                print('face identified!')
                personId   = identificationDetails[0]['candidates'][0]['personId']
                confidence = identificationDetails[0]['candidates'][0]['confidence']
                person = personRepo.getPersonNameFromRepository(personGroupId, personId)
                # write code to get name from database of the person identified by personId
                printAlert('person name {} identified with confidence: {} and emotions as {}'.format(person, confidence, personEmotions))
                listOfIdentifiedFaces.append('person name {} identified with confidence: {} and emotions as {}'.format(person, confidence, personEmotions))
                # send notification
            pass
        pass

        # if any faces were identified
        if listOfIdentifiedFaces:
            listOfDetectedEntities.append(listOfIdentifiedFaces)
    
        # step 2: Detect emotions of all faces identified
        angryPersonsDict = detectEmotionsFromFace(detectedFacesList)
        
        listOfDetectedEntities.append(angryPersonsDict)
    
    # step 3: Detect weapons
    # if weapons are detected send image of the angry persons
    detectedWeapons = detectWeaponsInImage(image)
    
    listOfDetectedEntities.append(detectedWeapons)

    # step 4: Send notification or Return the list of detected entities
    return listOfDetectedEntities

################################## API's #######################################
"""
    Simple get request to test the app
"""
@app.route("/v1/show", methods=["GET"])
def getMethod():
    return jsonify({"Status" : "OK", "data" : "Success"})

"""
    Post request to detect and identify a person
"""
@app.route("/v1/detect",methods=['POST'])
def detectAndIdentifyCrime():
    """
    Displays the complete shopping cart for the user
    """
    try:
        result = json.loads(request.get_data(as_text=True))
        print(result)
        imageUrl = result['imageUrl']
        personGroupId = result['personGroupId']
        print("In POST of detect, imageUrl : "+ imageUrl + 
        ", personGroupId: " + personGroupId)

        attributes='emotion'
        listOfDetectedEntities = predictCrime(imageUrl, attributes, personGroupId)
        
        return jsonify({"Status" : "OK", "data" : listOfDetectedEntities})
    except Exception as e:
        return jsonify(status='ERROR',message=str(e))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9999)

"""
if __name__ == '__main__':
    personGroupId = 'criminals'
    detectAndIdentifyPerson(personGroupId)
"""