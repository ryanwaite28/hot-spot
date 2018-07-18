// imports
const Storage = require('@google-cloud/storage');
const firebase = require('firebase');
const firebase_admin = require("firebase-admin");
const chamber = require('../chamber');

// Setup
const firebaseConfig = {
    apiKey: "AIzaSyByRSgYKDKwIMmw5lQeVfXFTX2pDqPCCy0",
    authDomain: "blue-world-202.firebaseapp.com",
    databaseURL: "https://blue-world-202.firebaseio.com",
    projectId: "blue-world-202",
    storageBucket: "blue-world-202.appspot.com",
    messagingSenderId: "990574132403"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

// const storage = firebaseApp.storage();
// const storageRef = storage.ref();

// firebase init
const firebase_keyfile = "./firebase.json";
const firebase_ServiceAccount = require(firebase_keyfile);
firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(firebase_ServiceAccount),
  storageBucket: firebaseConfig.storageBucket,
  databaseURL: firebaseConfig.databaseURL,
});


const firebase_db         = firebase_admin.database();            // database
const firebase_bucket     = firebase_admin.storage().bucket();    // storage
const firestore_fs        = firebase_admin.firestore();           // firestore


function createPublicFileURL(filename) {
  return `https://storage.googleapis.com/${firebaseConfig.storageBucket}/${encodeURIComponent(filename)}`;
}

function upload_file(file, prev_ref = "") {
  return new Promise((resolve, reject) => {
    var ext = file.mimetype.split('/')[1];
    if(chamber.allowed_images.indexOf(ext.toLowerCase()) == -1) {
      return reject({error: true, message: 'File Not Accepted. Must Be Image Type.'});
    }

    var unique_filename = chamber.uniqueValue();
    var filename = "";
    if(file.name.indexOf('.') == -1) {
      for(var key in chamber.allowed_images) {
        var type = chamber.allowed_images[key];
        if( file.name.indexOf(type) != -1 ){
          // console.log('match: ', type);
          filename = unique_filename + file.name.split(type)[0] + '.' + type;
          break;
        }
      }
    }
    else {
      filename = unique_filename + file.name;
    }

    var image_path = __dirname + '/' + filename;

    file.mv(filename, function(error) {
      if (error) {
        return reject({error: true, message: "could not upload file..."});
      }
      else {
        return resolve({ filename, image_path });
      }
    });
  });
}

function upload_bucket(filename, prev_ref = "") {
  return new Promise((resolve, reject) => {
    var options = {
      public: true
    };

    if(prev_ref && /https:\/\/storage.googleapis.com\/.*\/.*/.test(prev_ref)) {
      // console.log("previous image exist; Deleting it...", prev_ref);
      // options.destination = firebase_bucket.file(prev_ref.split('/')[4]);
      try {
        firebase_bucket.file(prev_ref.split('/')[4]).delete();
        // console.log('storage file deleted successfully!');
      }
      catch(e) {
        // console.log('error deleting: ', e);
      }
    }

    firebase_bucket.upload(filename, options)
    .then((data) => {
      let link = createPublicFileURL(filename);
      return resolve({ link, prev_ref })
    })
    .catch((e) => {
      console.log("error", e);
      return reject({error: true, message: "Could Not Upload To Bucket..."})
    });
  });
}

function upload_chain(file, prev_ref = "") {
  return new Promise((resolve, reject) => {
    upload_file(file, prev_ref)
    .then(filedata => {
      upload_bucket(filedata.filename, prev_ref)
      .then(bucketdata => {
        return resolve(bucketdata);
      })
      .catch(error => { return reject(error); })
    })
    .catch(error => { return reject(error); })
  });
}





// exports
module.exports = {
  firebaseConfig,
  firebase_ServiceAccount,
  firebaseApp,
  firebase_admin,
  //
  firebase_db,
  firestore_fs,
  firebase_bucket,
  //
  createPublicFileURL,
  upload_file,
  upload_bucket,
  upload_chain
}
