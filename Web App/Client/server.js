var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017';
var port = 8080; 
var ID = 0;
var criminalID = 0;
var suspectID = 0;

app.use(bodyParser.json());

app.listen(port);
console.log("Server listening on port " + port);

app.post('/v1/user/login', function(request, response){
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
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('users').find({'email' : (request.body.email)}).toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error creating user. Please try again!", "statuscode": 2});
                    }
                    else{
                        if(result.length == 0){
                        db.collection('users').insertOne({'ID': ID, 'email': request.body.email, 'username': request.body.username, 'password': request.body.password}, function(err, res) {
                            if (err){
                                console.log(err);
                                response.status = 500;
                                response.send({"message": "Error creating user. Please try again!", "statuscode": 2});
                            }
                            console.log("User created with ID : " + ID);
                            response.status= 200;
                            response.send({"message": "User created successfully with ID " + ID, "statuscode": 0});
                            ID++;
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
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!", "statuscode": 2});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('criminals').insertOne({'ID': criminalID, 'firstname': request.body.firstname.toLowerCase(), 'lastname': request.body.lastname.toLowerCase(),  'DOB': request.body.DOB, 'address': request.body.address.toLowerCase(),
                            'sex': request.body.sex, 'ethinicity': request.body.ethnicity.toLowerCase(),  'height': request.body.height, 'weight': request.body.weight,
                            'phone': request.body.phone, 'offences': request.body.offences.toLowerCase(), 'imagePath': request.body.imagePath}, function(err, res) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error creating criminal entry. Please try again!", "statuscode": 1});
                    }
                    console.log("Criminal entry created with ID : " + criminalID);
                    response.status= 200;
                    response.send({"message": "Criminal entry created successfully with ID " + criminalID, "statuscode": 0});
                    criminalID++;
                    client.close();
                });
            }
        }
    });
})

app.get('/v1/criminal/:ID', function(request, response){
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('criminals').find({'_id' : ObjectId(request.params.ID)}).toArray(function(err, result) {
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
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!", "statuscode": 3});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('criminals').find().toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error fetching criminal records. Please try again!", "statuscode": 1});
                    }
                    if(result.length > 0){
                        console.log("All criminals : ", result);
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
    var setValues = { $set: {'firstname': request.body.firstname.toLowerCase(), 'lastname': request.body.lastname.toLowerCase(),  'DOB': request.body.DOB, 'address': request.body.address.toLowerCase(),
    'sex': request.body.sex, 'ethinicity': request.body.ethnicity.toLowerCase(),  'height': request.body.height, 'weight': request.body.weight,
    'phone': request.body.phone, 'offences': request.body.offences.toLowerCase(), 'imagePath': request.body.imagePath} };
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('criminals').updateOne(filter, setValues, function(err, res) {
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
                db.collection('criminals').deleteOne(filter, function(err, res) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error deleting criminal entry. Please try again!"});
                    }
                    console.log("Criminal entry deleted with ID : " + request.params.ID);
                    response.status= 200;
                    response.send({"message": "Criminal entry deleted successfully with ID " + request.params.ID});
                    client.close();
                });
            }
        }
    });
})

app.get('/v1/logs/:ID', function(request, response){
    mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
        if (err){
            console.log(err);
            response.status = 500;
            response.send({"message": "Error connecting to the database. Please make sure the database service is running!"});
        }
        if(client){
            var db = client.db('UPD');
            if(db){
                db.collection('historic-data').find({'ID' : parseInt(request.params.ID)}).toArray(function(err, result) {
                    if (err){
                        console.log(err);
                        response.status = 500;
                        response.send({"message": "Error fetching criminal details. Please try again!"});
                    }
                    if(result.length > 0){
                        console.log("Log entry found : ", result);
                        response.status= 200;
                        response.send({"result": result});
                    }
                    else{
                        console.log("Log entry does not exist");
                        response.status= 200;
                        response.send({"message": "Record not found"});
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
                              'phone': request.body.phone, 'offences': request.body.offences, 'imagePath': request.body.imagePath}, function(err, res) {
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
                        'phone': request.body.phone, 'offences': request.body.offences, 'imagePath': request.body.imagePath} };
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

