import cognitive_face as CF

KEY = '848d161e12f64453a984ac20ea119834'  # Replace with a valid Subscription Key here.
CF.Key.set(KEY)

BASE_URL = 'https://westus.api.cognitive.microsoft.com/face/v1.0/'  # Replace with your regional Base URL
CF.BaseUrl.set(BASE_URL)

personGroupId1 = 'criminals'
personGroupId2 = 'friends'

def createPersonGroup(personGroupId):
    try:
        return CF.person_group.create(personGroupId)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)
        print(cfe.msg)
        print(cfe.code)
        return 0


#createPersonGroup(personGroupId1)
#createPersonGroup(personGroupId2)

def deletePersonGroup(personGroupId):
    try:
        CF.person_group.delete(personGroupId)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)
        return 0

#deletePersonGroup('friends')

def getPersonGroupInfo(personGroupId):
    try:
        return CF.person_group.get(personGroupId)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)
        return 0

#print(getPersonGroupInfo(personGroupId2))

def getPersonGroupTrainingStatus(personGroupId):
    try:
        return CF.person_group.get_status(personGroupId)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)

#print(getPersonGroupTrainingStatus(personGroupId1))

def listPersonGroups(topGroups):
    try:
        return CF.person_group.lists(top=topGroups)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)

#print(listPersonGroups(10))
"""
[{'personGroupId': 'criminals', 'name': 'criminals', 'userData': None}, {'personGroupId': 'friends', 'name': 'friends', 'userData': None}]
"""

def trainPersonGroup(personGroupId):
    try:
        return CF.person_group.train(personGroupId)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)
"""
trainPersonGroup(personGroupId1)
print(getPersonGroupTrainingStatus(personGroupId1))
{'status': 'failed', 'createdDateTime': '9/30/2018 12:21:21 AM', 'lastActionDateTime': '09/30/2018 00:21:22', 'message': 'There is no person in group criminals'}
"""

def updatePersonGroup(personGroupId, user_data):
    try:
        return CF.person_group.update(personGroupId, user_data=user_data)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)    



###################################### Person ##############################################################

# returns a new person_id created
def createPerson(personGroupId, name, user_data):
    try:
        return CF.person.create(personGroupId, name = name, user_data=user_data)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)

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
        print(cfe)

#print(deletePerson(personGroupId2, '2c288691-013f-45d9-ab29-7e26ebaf017b'))

# Update `name` or `user_data` of a person
def updatePerson(personGroupId, person_id, name=None, user_data=None):
    try:
        return CF.person.update(personGroupId, person_id, name, user_data)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)

# Retrieve a person's information, including registered persisted faces
def getPersonDetails(personGroupId, person_id):
    try:
        return CF.person.get(personGroupId, person_id)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)

########################### Person Face details ############################################

# adds a face to a person in the specified person group
def addPersonFace(image, personGroupId, person_id, user_data=None, target_face=None):
    try:
        # returns A new `persisted_face_id`.
        return CF.person.add_face(image, personGroupId, person_id, user_data, target_face)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)

person_id = '01150435-8549-41c6-887d-73596d9b414a'
#print(addPersonFace(image, personGroupId2, person_id))

# deletes a face from a person in the specified person group
def deletePersonFace(personGroupId, person_id, persisted_face_id):
    try:
        return CF.person.delete_face(personGroupId, person_id, persisted_face_id)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)

# Retrieve information about a persisted face of a person in the specified person group
def getPersonFace(personGroupId, person_id, persisted_face_id):
    try:
        return CF.person.get_face(personGroupId, person_id, persisted_face_id)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)

# Update a person persisted face's `user_data` field
def updatePersonFace(personGroupId, person_id, persisted_face_id, user_data=None):
    try:
        return CF.person.update_face(personGroupId, person_id, persisted_face_id, user_data)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)

def listPersons(personGroupId, topGroups):
    try:
        return CF.person.lists(personGroupId, top=topGroups)
    except CF.util.CognitiveFaceException as cfe:
        print(cfe)

#######################################################################################################


"""
img_url = 'https://raw.githubusercontent.com/Microsoft/Cognitive-Face-Windows/master/Data/detection1.jpg'
img = '/Users/haroon/sjsu/CMPE-295A-Campus-Safety-using-fog-computing/src/Students/Nethra/Nethra1.jpeg'
result = CF.face.detect(img_url)



//Step 1a: create personGroup for Criminals
const personGroupId1 = 'criminals';
/*
var personsFaceMap: Map<string, string> = new Map<string, string>();

faceHelpers.createPersonGroup(personGroupId1).then(result => {
    if (result === personGroupId1) {
        console.log('person group created for: ${personGroupId1} ');
        const criminals = fileHelpers.getPersons('Criminals');
        console.log(criminals);
        criminals.forEach(criminal => {
            faceHelpers.createPerson(personGroupId1, criminal).then(result => {
                const personId = result;
                console.log(`Created personId: ${result} for person: ${criminal}`)
                
                personsFaceMap.set(criminal, (<any>JSON.parse(personId)).personId);           
                
                const criminalPictures = fileHelpers.getPersonPictures(criminal,'Criminals');
                
                criminalPictures.forEach(criminalPicture => {
                    const criminalFaceFileName = __dirname + '/Criminals/' + criminal + '/' + criminalPicture;
                    faceHelpers.addPersonFace(
                        criminalFaceFileName,
                        personId,
                        personGroupId1
                    ).then(result => {
                        console.log(`For personId: ${result} person: ${criminal} added face: ${criminalPicture} got persistedFaceId: ${result}`);
                    });
                });
            });
        });
    }
});

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