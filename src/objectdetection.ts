//import { loadavg } from "os";

/*var fs  = require('fs');

const microsofComputerVision = require("microsoft-computer-vision");
fs.readFile('./tests/image/test.jpg', function(err, data) {
    if (err)
        throw err;
 
    microsofComputerVision.analyzeImage({
      "Ocp-Apim-Subscription-Key": "21fb4724b5cb419d8b589e497530f42f",
      "request-origin":"westus",
      "content-type": "application/octet-stream",
      "body": data,
      "visual-features":"Tags, Faces"
    }).then((result) => {
        console.log(result);     
                                 // { tags:
                                 //  [ { name: 'tree', confidence: 0.9994124174118042 },
                                 //    { name: 'outdoor', confidence: 0.9984000325202942 },
                                 //    { name: 'sky', confidence: 0.9974111914634705 },
                                 //    { name: 'grass', confidence: 0.9564579725265503 },
                                 //    { name: 'building', confidence: 0.9447041153907776 },
                                 //    { name: 'castle', confidence: 0.6080892086029053 } ],
                                 // requestId: 'c9c33a0d-7100-4cea-b37a-b93d2b3aff10',
                                 // metadata: { width: 883, height: 589, format: 'Jpeg' },
                                 // faces: [] }
    }).catch((err)=>{
      throw err;
    })
});*/

var suspicious_labels = ["Gun", "Knife", "Crime", "Violence", "Concealed carry", "Stabbing", "Shooting", "Mask", "Firearm", "Weapon"];
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
var uuid = require('uuid');

// Creates a client
const client = new vision.ImageAnnotatorClient();
const request = {
const request = {
    image: {
      source: {
        filename: '../resources/ObjectImages/student-gun.jpg', // Path of your image file
      }
    },
    imageContext: {
      webDetectionParams: {
        includeGeoResults: true,
      },
    },
  };
console.log("Calling Google Cloud API......\n");

// Performs label and web entities detection on the image file 
client
  /* For label detection uncomment below line */
  //.labelDetection('../resources/ObjectImages/gun.jpg')
  .webDetection(request)
  .then(results => {
    //const labels = results[0].labelAnnotations;
    const webLabels = results[0].webDetection.webEntities;
   // console.log(results);
    var matchingLabels = []
    console.log('Detected web entities:');
    var isSuspicious = false;
    for (var i = 0; i < webLabels.length; ++i) {
      console.log(webLabels[i].description);
        if(suspicious_labels.indexOf(webLabels[i].description)!=-1){
            isSuspicious = true;
            matchingLabels.push(webLabels[i].description)
            break;
        }
    }
    var comment = "";
    console.log("\nMatching Suspicious Labels:");
    for (var i = 0; i < matchingLabels.length; i++) {
      console.log(matchingLabels[i]);
      comment += matchingLabels[i] + " ";
    }
    console.log("\n");
    if(!isSuspicious){
        console.log("Result: Not Suspicious Photo");
    }
    else{
        console.log("Result: Suspicious Photo");
        mongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, function (err, client) {
          if (err){
              console.log(err);
          }
          if(client){
              var db = client.db('UPD');
              if(db){
                  var ID = uuid.v4();
                  db.collection('historic-data').insertOne({'ID': ID, 'message': "Suspicious activity detected", 'comment': comment, 
                        'timestamp': Date.now().toString()}, function(err, res) {
                      if (err){
                          console.log(err);
                          console.log("Error inserting records in DB. Please try again!");
                      }
                      console.log("Log created successfully with ID " + ID);
                      client.close();
                  });
              }
          }
      });
    }})
  .catch(err => {
    console.error('ERROR:', err);
  });   