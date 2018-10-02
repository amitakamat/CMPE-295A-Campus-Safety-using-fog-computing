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
        console.log("printing personsFaceMap");
personsFaceMap.forEach((value: string, key: string) => {
    console.log(key, value);
    });
    }
});
*/
//Step 1b: create personGroup for Students
const personGroupId2 = 'students';
/*
faceHelpers.createPersonGroup(personGroupId2).then(result => {
    if (result === personGroupId2) {
        console.log('person group created for: ${personGroupId2}');
        const students = fileHelpers.getPersons('Students');
        console.log(students);
        students.forEach(student => {
            faceHelpers.createPerson(personGroupId2, student).then(result => {
                const personId = result;
                console.log(`Created personId: ${result} for person: ${student}`)
                const studentPictures = fileHelpers.getPersonPictures(student,'Students');
                studentPictures.forEach(studentPicture => {
                    const studentFaceFileName = __dirname + '/Students/' + student + '/' + studentPicture;
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
});
*/
/*
 //Step 2: Train person group
faceHelpers.trainPersonGroup(personGroupId2).then(result => {
    if (result) console.log('personGroup2 trained');
});
*/
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

