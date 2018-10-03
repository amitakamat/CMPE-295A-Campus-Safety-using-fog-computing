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
    image = IMAGE_FOLDER_PATH + '/Testing/Friends.jpg'

    # Detect faces in the image
    detectedFacesList = detectPersonFace(image, attributes='age,emotion,smile')
    
    # Get list of detected faceId's
    detectedFaceIds = getListOfFaces(detectedFacesList) 

    identificationDetails = identifyPersonFace(detectedFaceIds, personGroupId)
    print(identificationDetails)


# Write a method to match the candidates of a face-match with name of person in the person_group
#[{'faceId': 'f386a877-9826-4bbc-b205-70280a04787e', 'candidates': []}, {'faceId': 'bb29b634-4389-4e64-bdb4-68f5fd2d7ea8', 'candidates': [{'personId': 'aaaafc9e-764c-4311-a5b2-dc9685d00872', 'confidence': 0.64918}]}, {'faceId': 'f7ea64c8-2ebd-45b2-9b05-f8b773ea17f0', 'candidates': []}, {'faceId': 'b85d01e3-e9c9-4fb2-86f1-8d7a4676aacb', 'candidates': []}, {'faceId': '64be6a92-a198-4f24-af9c-2428ab4be89e', 'candidates': []}]

if __name__ == '__main__':
    personGroupId = 'sjsustudents'
    detectAndIdentifyPerson(personGroupId)