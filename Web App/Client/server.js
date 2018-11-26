var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
//var url = 'mongodb://localhost:27017';
var url = "mongodb+srv://new_admin:admin@cluster0-h7uii.mongodb.net/CriminalDB";
var port = 8080; 
var ID = 0;
var criminalID = 0;
var suspectID = 0;
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var criminalColl = "criminals";

var imgPath = './resources/Criminals/Amita/Amita2.jpg';

// connect to mongo
//mongoose.connect('localhost', 'testing_storeImg');

// example schema
var schema = new Schema({
    img: { data: Buffer, contentType: String }
});

// our model
var A = mongoose.model('A', schema);

app.use(bodyParser.json());

app.listen(port);
console.log("Server listening on port " + port);

app.post('/v1/user/login', function(request, response){
    console.log("Request received");
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('CriminalDB');
            if(db){
                db.collection('users').find({'username' : request.body.username}).toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error validating user. Please try again!"});
                    }
                    if(result.length > 0){
                        console.log("User found : ", result);
                        if(result[0].password == request.body.password){
                            console.log("Valid user");
                            response.status= 200;
                            response.send({"message": "Valid credentials", "statuscode": 0});
                        }
                        else{
                            console.log("username exists but password does not match");
                            response.status= 400;
                            response.send({"message": "Invalid credentials", "statuscode": 1});
                        }
                    }
                    else{
                        console.log("user does not exist");
                        response.status= 401;
                        response.send({"message": "Invalid credentials", "statuscode" : 2});
                    }
                    client.close();
                });
            }
        }
    });
    /*if(request.body.username == "test" && request.body.password == "test"){
        response.status= 200;
        response.send({"message": "Valid"});
    }
    else{
        response.status= 500;
        response.send({"message": "Invalid"});
    }*/
})

app.post('/v1/user', function(request, response){
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('CriminalDB');
            if(db){
                db.collection('users').find({'email' : (request.body.email)}).toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error creating user. Please try again!", "statuscode": 2});
                    }
                    else{
                        if(result.length == 0){
                        db.collection('users').insertOne({'email': request.body.email, 'username': request.body.username, 'password': request.body.password}, function(err, res) {
                            if (err){
                                console.log(err);
                                response.status = 500;
                                response.send({"message": "Error creating user. Please try again!", "statuscode": 2});
                            }
                            console.log("User created successfully");
                            response.status= 200;
                            response.send({"message": "User created successfully", "statuscode": 0});
                        });
                        }
                        else{
                            response.send({"message": "Email already exist!", statuscode : 1});
                        }
                    }
                    client.close();
                });
            }
        }
    });
})

app.post('/v1/criminal', function(request, response){
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!", "statuscode": 2});
        }
        if(client){
            var db = client.db('CriminalDB');
            if(db){
                db.collection(criminalColl).insertOne({'firstname': request.body.firstname.toLowerCase(), 'lastname': request.body.lastname.toLowerCase(),  'DOB': request.body.DOB, 'Address': request.body.address.toLowerCase(),
                            'Sex': request.body.sex, 'Ethnicity': request.body.ethnicity.toLowerCase(),  'Height': request.body.height, 'Weight': request.body.weight,
                            'Contact': request.body.phone, 'Offence': request.body.offences.toLowerCase(), 'imageData': request.body.imageData}, function(err, res) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error creating criminal entry. Please try again!", "statuscode": 1});
                    }
                    console.log("Criminal entry created successfully");
                    response.status= 200;
                    response.send({"message": "Criminal entry created successfully", "statuscode": 0});
                    client.close();
                });
            }
        }
    });
})

app.get('/v1/criminal/:ID', function(request, response){
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db("CriminalDB");
            if(db){
                db.collection(criminalColl).find({'_id' : ObjectId(request.params.ID)}).toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error fetching criminal details. Please try again!"});
                    }
                    if(result.length > 0){
                        console.log("Criminal found : ", result);
                        response.status= 200;
                        response.send({"result": result});
                    }
                    else{
                        console.log("criminal does not exist");
                        response.status= 200;
                        response.send({"message": "Record not found"});
                    }
                    client.close();
                });
            }
        }
    });
})

app.get('/v1/criminals', function(request, response){
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!", "statuscode": 3});
        }
        if(client){
            var db = client.db('CriminalDB');
            if(db){
                db.collection(criminalColl).find().toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error fetching criminal records. Please try again!", "statuscode": 1});
                    }
                    if(result.length > 0){
                        response.status= 200;
                        response.send({"result": result, "statuscode": 0});
                    }
                    else{
                        console.log("No criminals found");
                        response.status= 200;
                        response.send({"message": "No Criminal records available", "statuscode" : 2});
                    }
                    client.close();
                });
            }
        }
    });
})

app.put('/v1/criminal/:ID', function(request, response){
    var filter = { _id: ObjectId(request.params.ID) };
    var setValues = { $set: {'firstname': request.body.firstname.toLowerCase(), 'lastname': request.body.lastname.toLowerCase(),  'DOB': request.body.DOB, 'Address': request.body.address.toLowerCase(),
    'Sex': request.body.sex, 'Ethnicity': request.body.ethnicity.toLowerCase(),  'Height': request.body.height, 'Weight': request.body.weight,
    'Contact': request.body.phone, 'Offence': request.body.offences.toLowerCase(), "imageData": request.body.imageData} };
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('CriminalDB');
            if(db){
                db.collection(criminalColl).updateOne(filter, setValues, function(err, res) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error updating criminal entry. Please try again!", "statuscode": 1});
                    }
                    console.log("Criminal entry updated with ID : " + request.params.ID);
                    response.status= 200;
                    response.send({"message": "Criminal entry updated successfully", "statuscode" : 0});
                    client.close();
                });
            }
        }
    });
})

app.delete('/v1/criminal/:ID', function(request, response){
    var filter = { '_id' : ObjectId(request.params.ID) };
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!", "statuscode" : 2});
        }
        if(client){
            var db = client.db('CriminalDB');
            if(db){
                db.collection(criminalColl).deleteOne(filter, function(err, res) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error deleting criminal entry. Please try again!", "statuscode" : 1});
                    }
                    console.log("Criminal entry deleted with ID : " + request.params.ID);
                    response.status= 200;
                    response.send({"message": "Criminal entry deleted successfully with ID " + request.params.ID, "statuscode" : 0});
                    client.close();
                });
            }
        }
    });
})

app.get('/v1/logs/:ID', function(request, response){
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('CriminalDB');
            if(db){
                db.collection('alerts').find({'_id' : ObjectId(request.params.ID)}).toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error fetching alert details. Please try again!", "statuscode": 2});
                    }
                    if(result.length > 0){
                        console.log("Log entry found");
                        response.status= 200;
                        response.send({"result": result, "statuscode": 0});
                    }
                    else{
                        console.log("Log entry does not exist");
                        response.status= 200;
                        response.send({"message": "Record not found", "statuscode": 1});
                    }
                    client.close();
                });
            }
        }
    });
})

app.get('/v1/logs', function(request, response){
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('CriminalDB');
            if(db){
                db.collection('alerts').find().toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error fetching criminal details. Please try again!", "statuscode": 1});
                    }
                    if(result.length > 0){
                        response.status= 200;
                        response.send({"result": result, "statuscode": 0});
                    }
                    else{
                        console.log("Log entry does not exist");
                        response.status= 200;
                        response.send({"message": "Record not found", "statuscode": 2});
                    }
                    client.close();
                });
            }
        }
    });
})

app.post('/v1/suspect', function(request, response){
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('suspects').insertOne({'ID': suspectID, 'name': request.body.name, 'DOB': request.body.DOB, 'address': request.body.address,
                              'phone': request.body.phone, 'Offence': request.body.offences, 'imagePath': request.body.imagePath}, function(err, res) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error creating suspect entry. Please try again!"});
                    }
                    console.log("Suspect entry created with ID : " + suspectID);
                    response.status= 200;
                    response.send({"message": "Suspect entry created successfully with ID " + suspectID});
                    suspectID++;
                    client.close();
                });
            }
        }
    });
})

app.get('/v1/suspect/:ID', function(request, response){
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('suspects').find({'ID' : parseInt(request.params.ID)}).toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error fetching suspect details. Please try again!"});
                    }
                    if(result.length > 0){
                        console.log("Suspect found : ", result);
                        response.status= 200;
                        response.send({"result": result});
                    }
                    else{
                        console.log("suspect does not exist");
                        response.status= 200;
                        response.send({"message": "Record not found"});
                    }
                    client.close();
                });
            }
        }
    });
})

app.put('/v1/suspect/:ID', function(request, response){
    var filter = { ID: parseInt(request.params.ID) };
    var setValues = { $set: {'name': request.body.name, 'DOB': request.body.DOB, 'address': request.body.address,
                        'phone': request.body.phone, 'Offence': request.body.offences, 'imagePath': request.body.imagePath} };
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('suspects').updateOne(filter, setValues, function(err, res) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error creating suspect entry. Please try again!"});
                    }
                    console.log("Suspect entry updated with ID : " + request.params.ID);
                    response.status= 200;
                    response.send({"message": "Suspect entry updated successfully with ID " + request.params.ID});
                    client.close();
                });
            }
        }
    });
})

app.delete('/v1/suspect/:ID', function(request, response){
    var filter = { ID: parseInt(request.params.ID) };
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('suspects').deleteOne(filter, function(err, res) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error deleting suspect entry. Please try again!"});
                    }
                    console.log("Suspect entry deleted with ID : " + request.params.ID);
                    response.status= 200;
                    response.send({"message": "Suspect entry deleted successfully with ID " + request.params.ID});
                    client.close();
                });
            }
        }
    });
})

app.post('/v1/image', function(request, response){
    
    mongoose.connect('mongodb://localhost:27017/UPD');
    var connection = mongoose.connection;
    connection.once('open', function () {

        connection.db.collection("Images", function(err, collection){
            var a = new A;
            a.img.data = fs.readFileSync(imgPath);
            console.log(a.img.data);
            a.img.contentType = 'image/png';
            collection.insertOne(a);
            /*a.save(function (err, a) {
            if (err) throw err;
            console.error('saved img to mongo');
            })*/
        });
    
    });
});

app.post('/v1/logs', function(request, response){
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!", "statuscode": 2});
        }
        if(client){
            var db = client.db('CriminalDB');
            if(db){
                var bitmap = fs.readFileSync(imgPath);
                var imageData = new Buffer(bitmap).toString('base64');
                date = new Date();
                //console.log(imageData);
                db.collection("alerts").insertOne({'timestamp': date, 'message': "Somebody spotted with gun",  'image': imageData}, function(err, res) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error creating logs entry. Please try again!", "statuscode": 1});
                    }
                    console.log("Logs entry created successfully");
                    response.status= 200;
                    response.send({"message": "Logs entry created successfully", "statuscode": 0});
                    client.close();
                });
            }
        }
    });
})

app.get('/v1/image/:ID', function(request, response){
    console.log("Request received");
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('Images').find({'_id' : ObjectId(request.params.ID)}).toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error fetching criminal details. Please try again!"});
                    }
                    if(result.length > 0){
                        console.log("Image found : ", result[0].img.data.toString('base64'));
                        response.status= 200;
                        response.send({"result": result[0].img.data.toString('base64')});
                    }
                    else{
                        console.log("criminal does not exist");
                        response.status= 200;
                        response.send({"message": "Record not found"});
                    }
                    client.close();
                });
            }
        }
    });
});

