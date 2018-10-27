#!/usr/bin/env python

from PersonRepository import PersonRepository
from faceHelpers import *
from definitions import IMAGE_FOLDER_PATH

PERSON_GROUP_ID = 'sjsustudents'

def predictCrime(image, attributes):
    """
    Predicts if crime will occur or not based on image provided
    """
    # step 1: Detect faces from image
    detectedFacesList = detectPersonFace(image, attributes='emotion')
    print(detectedFacesList)
    
    if not detectedFacesList:
        print('no faces detected!')
    # for each detected face perform face recognition and check the emotions
    for detectedPerson in detectedFacesList:
        personEmotions = detectedPerson['faceAttributes']['emotion']
        personFaceId   = detectedPerson['faceId']

        identificationDetails = identifyPersonFace([personFaceId], PERSON_GROUP_ID)
        print(identificationDetails)
        if identificationDetails[0]['candidates']:
            print('face identified!')
            personId   = identificationDetails[0]['candidates'][0]['personId']
            confidence = identificationDetails[0]['candidates'][0]['confidence']
            
            # write code to get name from database of the person identified by personId
            print('person name {} identified with confidence: {} and emotions as {}'.format(personId, confidence, personEmotions))
            # send notification
    
    # step 2: Detect emotions of all faces identified
    angryPersonsDict = detectEmotions(detectedFacesList)
    
    # step 3: Detect weapons
    # if weapons are detected send image of the angry persons
    if not angryPersonsDict adn ifDetectedWeapons:
        #Send notification
        pass
    # step 4: Send notification

def detectEmotions(detectedFacesList):
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

if __name__ == '__main__':
    image = IMAGE_FOLDER_PATH + '/Testing/Friends.jpg'
    attributes='emotion'
    predictCrime(image, attributes=attributes)