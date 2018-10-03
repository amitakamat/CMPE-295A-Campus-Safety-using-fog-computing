import cognitive_face as CF

KEY = '848d161e12f64453a984ac20ea119834'  # Replace with a valid Subscription Key here.
CF.Key.set(KEY)

BASE_URL = 'https://westus.api.cognitive.microsoft.com/face/v1.0/'  # Replace with your regional Base URL
CF.BaseUrl.set(BASE_URL)

# Creates a person group with the specified personGroupId
# personGroupId should not contain capital letters
def createPersonGroup(personGroupId):
    try:
        returnObj= CF.person_group.create(personGroupId)
        print('person group created with person_group_id: {}'.format(personGroupId))
        return returnObj
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))
        return -1

def deletePersonGroup(personGroupId):
    try:
        CF.person_group.delete(personGroupId)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))
        return 0

#deletePersonGroup('friends')

def getPersonGroupInfo(personGroupId):
    try:
        return CF.person_group.get(personGroupId)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))
        return 0

#print(getPersonGroupInfo(personGroupId2))

def getPersonGroupTrainingStatus(personGroupId):
    try:
        return CF.person_group.get_status(personGroupId)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

#print(getPersonGroupTrainingStatus(personGroupId1))

def listPersonGroups(topGroups):
    try:
        return CF.person_group.lists(top=topGroups)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

#print(listPersonGroups(10))
"""
[{'personGroupId': 'criminals', 'name': 'criminals', 'userData': None}, {'personGroupId': 'friends', 'name': 'friends', 'userData': None}]
"""

def trainPersonGroup(personGroupId):
    try:
        return CF.person_group.train(personGroupId)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))
"""
trainPersonGroup(personGroupId1)
print(getPersonGroupTrainingStatus(personGroupId1))
{'status': 'failed', 'createdDateTime': '9/30/2018 12:21:21 AM', 'lastActionDateTime': '09/30/2018 00:21:22', 'message': 'There is no person in group criminals'}
"""

def updatePersonGroup(personGroupId, user_data):
    try:
        return CF.person_group.update(personGroupId, user_data=user_data)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))



###################################### Person ##############################################################

# returns a new person_id created as a dictionary
def createPerson(personGroupId, name, user_data = None):
    try:
        returnObj = CF.person.create(personGroupId, name, user_data)
        return returnObj
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

#print(createPerson(personGroupId2, 'nethra', None))
"""
{'personId': '2c288691-013f-45d9-ab29-7e26ebaf017b'}
{'personId': '01150435-8549-41c6-887d-73596d9b414a'}
{'personId': 'cee3de3f-20bb-4c41-96bf-9f6ddd9abd3d'}

"""

# Deletes a person from a person group with a specified person_id
def deletePerson(personGroupId, person_id):
    try:
        return CF.person.delete(personGroupId, person_id)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

#print(deletePerson(personGroupId2, '2c288691-013f-45d9-ab29-7e26ebaf017b'))

# Update `name` or `user_data` of a person
def updatePerson(personGroupId, person_id, name=None, user_data=None):
    try:
        return CF.person.update(personGroupId, person_id, name, user_data)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

# Retrieve a person's information, including registered persisted faces
def getPersonDetails(personGroupId, person_id):
    try:
        return CF.person.get(personGroupId, person_id)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

########################### Person Face details ############################################

# adds a face to a person in the specified person group
def addPersonFace(image, personGroupId, person_id, user_data=None, target_face=None):
    try:
        # returns A new `persisted_face_id`.
        return CF.person.add_face(image, personGroupId, person_id, user_data, target_face)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

person_id = '01150435-8549-41c6-887d-73596d9b414a'
#print(addPersonFace(image, personGroupId2, person_id))
#{'persistedFaceId': '077e4d52-c203-494d-855b-3535eb971c70'}

# deletes a face from a person in the specified person group
def deletePersonFace(personGroupId, person_id, persisted_face_id):
    try:
        return CF.person.delete_face(personGroupId, person_id, persisted_face_id)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

# Retrieve information about a persisted face of a person in the specified person group
def getPersonFace(personGroupId, person_id, persisted_face_id):
    try:
        return CF.person.get_face(personGroupId, person_id, persisted_face_id)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

# Update a person persisted face's `user_data` field
def updatePersonFace(personGroupId, person_id, persisted_face_id, user_data=None):
    try:
        return CF.person.update_face(personGroupId, person_id, persisted_face_id, user_data)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

def listPersons(personGroupId, topGroups):
    try:
        return CF.person.lists(personGroupId, top=topGroups)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

##################################### Face #########################################################
def detectPersonFace(image, face_id=True, landmarks=False, attributes=''):
    """
    Detect human faces in an image and returns face locations, and
    optionally with `face_id`s, landmarks, and attributes.

    Returns: An array of face entries ranked by face rectangle size in descending
    order. An empty response indicates no faces detected. A face entry may
    contain the corresponding values depending on input parameters.

    [{'faceId': '8a1b5824-c0ca-4e02-bcfe-95d89ad69ff4',
     'faceRectangle': {'top': 2269, 'left': 634, 'width': 931, 'height': 931},
     'faceAttributes': {'smile': 1.0, 'age': 37.0,
     'emotion': {'anger': 0.0, 'contempt': 0.0, 'disgust': 0.0, 'fear': 0.0,
     'happiness': 1.0, 'neutral': 0.0, 'sadness': 0.0, 'surprise': 0.0}}
    }]

    """
    try:
        return CF.face.detect(image, face_id, landmarks, attributes)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))

def identifyPersonFace(face_ids,
             person_group_id=None,
             large_person_group_id=None,
             max_candidates_return=1,
             threshold=None):
    """
    Identify unknown faces from a person group or a large person group

    [{'faceId': 'd08f491c-cf5c-40f9-acc1-4924e0988d64',
     'candidates': [{'personId': '444ad076-fcd7-48b2-905e-b1c86f8435b7', 'confidence': 0.9471}]}]
    """

    try:
        return CF.face.identify(face_ids,
             person_group_id=person_group_id,
             large_person_group_id=large_person_group_id,
             max_candidates_return=max_candidates_return,
             threshold=threshold)
    except CF.util.CognitiveFaceException as cfe:
        print('{}: {}'.format(cfe.code, cfe.msg))


##################################### Face #########################################################
"""
img_url = 'https://raw.githubusercontent.com/Microsoft/Cognitive-Face-Windows/master/Data/detection1.jpg'
img = '/Users/haroon/sjsu/CMPE-295A-Campus-Safety-using-fog-computing/src/Students/Nethra/Nethra1.jpeg'
result = CF.face.detect(img_url)


/*
 //Step 2: Train person group
 faceHelpers.trainPersonGroup(personGroupId2).then(result => {
    if (result) console.log('personGroup2 trained');
});
*/

//Step 3: Detecting and identifying a person
faceHelpers.detectFace('Testing/Friends.jpg').then(faceId => {
    faceHelpers.identifyPerson(personGroupId2, faceId).then(result => {
        console.log('Input recognized as: ' + result);
    });
});
"""