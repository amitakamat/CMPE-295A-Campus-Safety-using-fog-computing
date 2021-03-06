import os
from definitions import *

#function to return list of persons from a directory
def getPersons(dirName):
    fullDirName = IMAGE_FOLDER_PATH + '/' + dirName
    print(fullDirName)
    persons = [name for name in os.listdir(fullDirName)
            if os.path.isdir(os.path.join(fullDirName, name))]
    return persons
    
#print(getPersons('Students'))

# function to return list of pictures of a person from a directory 
def getPersonPictures(friendName, folderName):
    fullDirName = IMAGE_FOLDER_PATH + '/' + folderName + '/' + friendName
    #personPictures = [file for file in os.listdir(fullDirName) if file.endswith(".jpg") or file.endswith(".jpeg")]
    personPictures = [fullDirName + '/' + file 
        for file in os.listdir(fullDirName) if file.endswith(".jpg") or file.endswith(".jpeg")]
    #print(personPictures)
    return personPictures

#print(getPersonPictures('Nethra', 'Students'))

# function to read image
def readImage(filePath):
    with open( filePath, 'rb' ) as f:
        data = f.read()
    return data

#readImage(os.path.dirname(os.path.realpath(__file__)) + '/' + 'Students' + '/Nethra/'+'Nethra4.jpeg')