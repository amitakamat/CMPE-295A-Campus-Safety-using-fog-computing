import * as fileHelpers from './fileHelpers';
import * as faceHelpers from './FaceHelpers';

/* const personGroupId1 = 'criminals';
 faceHelpers.deletePersonGroup(personGroupId1).then(result => {
    if(result) 
    {
        console.log('deleted person group');
        console.log(result);
    }
    else console.log('error deleting the person group')
});  */

//Step 1a: create personGroup for Criminals
const personGroupId1 = 'criminals';

let personsFaceMap: Map<string, string> = new Map<string, string>();

faceHelpers.createPersonGroup(personGroupId1).then(result => {
    if (result === personGroupId1) {
        console.log('person group created for: ${personGroupId1} ');
        const criminals = fileHelpers.getFriends('Criminals');
        console.log(criminals);
        criminals.forEach(criminal => {
            faceHelpers.createPerson(personGroupId1, criminal).then(result => {
                const personId = result;
                console.log(`Created personId: ${result} for person: ${criminal}`)
                personsFaceMap.set(criminal, (<any>JSON.parse(personId)).personId);
                const criminalPictures = fileHelpers.getFriendPictures(criminal,'Criminals');
                console.log(criminalPictures);
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
    console.log(personsFaceMap);
});

//console.log(personsFaceMap);
/*
//Step 1b: create personGroup for Students
const personGroupId2 = 'students';

faceHelpers.createPersonGroup(personGroupId2).then(result => {
    if (result === personGroupId2) {
        console.log('person group created for: ${personGroupId2}');
        const students = fileHelpers.getFriends('Students');
        students.forEach(student => {
            faceHelpers.createPerson(personGroupId2, student).then(result => {
                const personId = result;
                console.log(`Created personId: ${result} for person: ${student}`)
                const studentPictures = fileHelpers.getFriendPictures(student,'Students');
                studentPictures.forEach(studentPicture => {
                    const studentFaceFileName = __dirname + '/Students/' + student + '/' + studentPictures;
                    faceHelpers.addPersonFace(
                        studentFaceFileName,
                        personId,
                        personGroupId2
                    ).then(result => {
                        console.log(`For personId: ${result} person: ${student} added face: ${studentPictures} got persistedFaceId: ${result}`);
                    });
                });
            });
        });
    }
}); */

/* Step 2: Train person group
faceHelpers.trainPersonGroup(personGroupId).then(result => {
    if (result) console.log('personGroup trained');
});

Step 3: Detecting and identifying a person
faceHelpers.detectFace('./input.jpg').then(faceId => {
    faceHelpers.identifyPerson(personGroupId, faceId).then(result => {
        console.log('Input recognized as: ' + result);
    });
}); */