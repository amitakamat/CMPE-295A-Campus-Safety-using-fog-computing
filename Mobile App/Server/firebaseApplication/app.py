from firebaseApplication import app
from firebaseApplication import serverApp
from flask import request
import json
import pymongo
from bson.objectid import ObjectId

connection = pymongo.MongoClient('mongodb+srv://new_admin:admin@cluster0-h7uii.mongodb.net/CriminalDB')
db = connection.CriminalDB
collection = db['alerts']

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/record')
def getRecord():
    id = request.args.get('id')
    document = collection.find_one({"_id":ObjectId(id)})
    return document['imageData']


@app.route('/send', methods=['POST'])
def publish():
    if not request.json:
        return "No data"
    data = request.json
    msg = data['data']
    result = serverApp.publish_andr(data=msg)
    return result
