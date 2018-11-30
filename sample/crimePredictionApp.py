#!/usr/bin/env python

from PersonRepository import MongoRepository
from faceHelpers import *
from definitions import *
from weaponsDetection import *
from helpers import *
from databaseHelpers import *
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import Flask,render_template,jsonify,json,request
from pprint import pprint
from bson.json_util import dumps
import base64
import time
import datetime
import requests
from bson import json_util, ObjectId
import os
from io import BytesIO
from PIL import Image

app = Flask(__name__)

# Custom JSON encoder to encode MongoDB ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


# object to get data from database
personRepo = MongoRepository()

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
def detectEntitiesFromImage(image, attributes, personGroupId):
    """
    Will Return a list of thing identifed or an empty list
    e.g. : ['person name haroon identified with confidence: 0.9 and emotions as angry', '']
    """
    # Comma separated List to store details of things detected from images
    # Persons detected, Angry persons emotions, Weapons detected
    listOfDetectedEntities = {}

    listOfDetectedEntities['detectedEmotions'] = []
    listOfDetectedEntities['detectedFaces']    = []
    # step 1: Detect faces from image by making a call to Face API
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
            
            # makes a call to Face API and tries to identify the person using the faceId provided
            identificationDetails = identifyPersonFace([personFaceId], personGroupId)
            print(identificationDetails)
            if identificationDetails[0]['candidates']:
                print('face identified!')
                personId   = identificationDetails[0]['candidates'][0]['personId']
                confidence = identificationDetails[0]['candidates'][0]['confidence']
                person = getPersonNameFromDB(personId, personGroupId)
                # write code to get name from database of the person identified by personId
                printAlert('person name {} identified with confidence: {} and emotions as {}'.format(person, confidence, personEmotions))
                listOfIdentifiedFaces.append('person name {} identified with confidence: {} and emotions as {}'.format(person, confidence, personEmotions))
                # send notification
            pass
        pass

        # if any faces were identified
        listOfDetectedEntities['detectedFaces'] = listOfIdentifiedFaces
    
        # step 2: Detect emotions of all faces identified
        angryPersonsDict = detectEmotionsFromFace(detectedFacesList)
        
        listOfDetectedEntities['detectedEmotions'] = angryPersonsDict
    
    # step 3: Detect weapons
    # if weapons are detected send image of the angry persons
    detectedWeapons = detectWeaponsInImage(image)
    
    listOfDetectedEntities['detectedWeapons'] = detectedWeapons

    # Annotate image with faceRectangle
    # Read the image, b64encode it and convert it to string to store in DB
    """
    Original code:
    imageObj = open(image, 'rb')
    encodedImageString = base64.b64encode(imageObj.read()).decode("utf-8")
    """

    buffered = BytesIO()
    image = Image.open(image)
    size = (400, 400)
    image.thumbnail(size)

    image.save(buffered, format="JPEG")
    encodedImageString = base64.b64encode(buffered.getvalue()).decode("utf-8")
    listOfDetectedEntities['imageData'] = encodedImageString

    # Add timestamp
    listOfDetectedEntities['timestamp'] = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
    
    """
    To Decode:
    image_result = open('testingimage1.jpg', 'wb')
    b64Img = base64.b64decode(encodedImageString)
    image_result.write(b64Img)
    """
    # step 4: Send notification or Return the list of detected entities
    return listOfDetectedEntities
##########################################################################################

def sendNotification(entities):
    """
        If there is anything suspicious, add it to alerts and send notification
    """
    alert = False

    # Iterate through the dictionary and see if faces, emotions or weapons are detected
    for key, value in entities.items():
        if (key == 'detectedFaces' or key == 'detectedWeapons' or key == 'detectedEmotions') and value:
            # Set alert to true
            alert = True
            print(key)
            pass
    
    # If True then write to alert database
    if alert:
        id = personRepo.addAlert(entities)
        message = ''
        for key, value in entities.items():
            if (key == 'detectedFaces' or key == 'detectedEmotions')  and value:
                message += "Detected Faces: "
                for val in value:
                    message += val+ "."
            if key == 'detectedWeapons' and value:
                message += " Detected Weapons: "
                for val in value:
                    message += val+ "/"

        data = {}
        data["_id"]       = id
        data["message"]   = message
        data["timestamp"] = entities["timestamp"]
        #data["imageData"] = entities["imageData"]
        
        url="http://35.185.202.31:5000/send"
        headers = {'Content-Type': 'application/json'}
        payload = {"data" : data, "topic" : "crime"}

        jsonifiedPayload = json.loads(json_util.dumps(payload))
        jsonifiedPayload["data"]["id"] = jsonifiedPayload["data"]["_id"]["$oid"]
        del jsonifiedPayload["data"]["_id"]
        
        jsonifiedPayload = json.dumps(jsonifiedPayload)
        print(jsonifiedPayload)
        response = requests.request("POST", url, data=jsonifiedPayload, headers=headers)
        print(response.text)


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
def predictCrime():
    """
    Predicts if crime will occur or not based on image provided
    """
    try:
        result = json.loads(request.get_data(as_text=True))
        print(result)

        imageUrl = result['imageUrl']
        personGroupId = result['personGroupId']
        attributes='emotion'

        dictOfDetectedEntities = detectEntitiesFromImage(imageUrl, attributes, personGroupId)
        
        # We can send notifications either here or in the detectEntitiesFromImage method
        # if dictOfDetectedEntities is empty no need to send any notifications
        sendNotification(dict(dictOfDetectedEntities))
        #return jsonify({"Status" : "OK", "data" : dictOfDetectedEntities})
        return jsonify({"Status" : "OK", "message" : "done"})
    except Exception as e:
        return jsonify(status='ERROR',message=str(e))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9999)