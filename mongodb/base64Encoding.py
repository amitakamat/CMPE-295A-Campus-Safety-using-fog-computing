import base64
import pymongo

connection = pymongo.MongoClient('mongodb+srv://new_admin:admin@cluster0-h7uii.mongodb.net/CriminalDB')
db = connection.CriminalDB

"""
image = open('Goa3.jpg', 'rb')
image_read = image.read()
encodedImage = base64.encodestring(image_read)

newCollection = db['dummyForTesting']
newCollection.insert({'encodedString' : encodedImage})

decodedImage = base64.decodebytes(encodedImage)
print(type(decodedImage))
image_result = open('deer_decode.gif', 'wb')
image_result.write(decodedImage)
"""

newCollection = db['criminals_backup']
document = newCollection.find_one({})
b64Img = base64.b64decode(document['imageData'])
imageName = document['fullname']
#decodedImageFromDB = base64.decodebytes(b64Img)
image_result = open('./testingFolder/' + imageName + '.jpg', 'wb')
#image_result.write(decodedImageFromDB)
image_result.write(b64Img)
