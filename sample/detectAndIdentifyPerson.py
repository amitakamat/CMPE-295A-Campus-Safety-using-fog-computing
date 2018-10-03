#!/usr/bin/env python

from PersonRepository import PersonRepository
from faceHelpers import *
from definitions import IMAGE_FOLDER_PATH

############################# Util ############################################
def getListOfFaces(faceList):
    """
    Utility function to get list of faceIds from detected faces list
    """
    faceIdList = [faceDict['faceId'] for faceDict in faceList]
    print(faceIdList)
    return faceIdList

def detectAndIdentifyPerson(personGroupId):
    print('executing main func')
    image = IMAGE_FOLDER_PATH + '/Testing/Friends.jpg'

    # Detect faces in the image
    detectedFacesList = detectPersonFace(image, attributes='age,emotion,smile')
    
    # Get list of detected faceId's
    detectedFaceIds = getListOfFaces(detectedFacesList) 

    identificationDetails = identifyPersonFace(detectedFaceIds, personGroupId)
    print(identificationDetails)


        

if __name__ == '__main__':
    personGroupId = 'sjsucriminals'
    detectAndIdentifyPerson(personGroupId)