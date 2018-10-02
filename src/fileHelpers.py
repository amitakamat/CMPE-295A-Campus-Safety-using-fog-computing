import os

#function to return list of persons from a directory
def getPersons(dirName):
    fullDirName = os.path.dirname(os.path.realpath(__file__)) + '/' + dirName
    persons = [name for name in os.listdir(fullDirName)
            if os.path.isdir(os.path.join(fullDirName, name))]
    return persons
    
#getPersons('Students')

# function to return list of pictures of a person from a directory 
def getPersonPictures(friendName, folderName):
    fullDirName = os.path.dirname(os.path.realpath(__file__)) + '/' + folderName + '/' + friendName
    personPictures = [file for file in os.listdir(fullDirName) if file.endswith(".jpg") or file.endswith(".jpeg")]
    return personPictures

#print(getPersonPictures('Nethra', 'Students'))

# function to read image
def readImage(filePath):
    with open( filePath, 'rb' ) as f:
        data = f.read()
    return data

#readImage(os.path.dirname(os.path.realpath(__file__)) + '/' + 'Students' + '/Nethra/'+'Nethra4.jpeg')