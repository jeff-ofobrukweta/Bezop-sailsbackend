/**
 * GcuController
 *
 * @description :: Server-side logic for managing gcus
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const file = require('file');
// The name for the new bucket
const bucketName = 'my-bucketbezop';
// Imports the Google Cloud client library
 const Storage = require('@google-cloud/storage');
// Your Google Cloud Platform project ID
const projectId = 'newproject-191221';
module.exports = {
upload: function  (req, res) {
    // Call to /upload via GET is error
    if(req.method === 'GET')
          return res.json({'status':'GET not allowed'});                        

    let uploadFile = req.file('uploadFile');
    console.log(uploadFile._files);
    //process.exit(1);
    uploadFile.upload(function onUploadComplete(err, files) {
        // Files will be uploaded to .tmp/uploads

        // IF ERROR Return and send 500 error with error
        if (err) return res.serverError(err);                               

        console.log(">>>"+JSON.stringify(files[0].fd,null,2));
        res.json({status:200,file:files});
    });
        // Creates a client
        const storage = new Storage({
        projectId: projectId,
        });


        // Creates the new bucket
        storage
        .createBucket(bucketName)
        .then(() => {
            console.log(`Bucket ${bucketName} created.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
},
uploadFiletocloud(req,res){
// Call to /upload via GET is error
if(req.method === 'GET')
return res.json({'status':'GET not allowed'});                        

let uploadFile = req.file('uploadFile');
console.log(uploadFile._files);
//process.exit(1);
uploadFile.upload(function onUploadComplete(err, files) {
// Files will be uploaded to .tmp/uploads
console.log("files>>>>?"+JSON.stringify(files,null,2))
// IF ERROR Return and send 500 error with error
if (err) return res.serverError(err);                               

// console.log(">>>"+files);
const filename = files[0].fd
// Creates a client
const storage = new Storage();
// Uploads a local file to the bucket
storage
    .bucket(bucketName)
    .upload(filename)
    .then(() => {
    console.log("message"+filename+"uploaded to"+" "+bucketName+"");
    })
    .catch(err => {
    console.error('ERROR:', err);
    });
    // [END storage_upload_file]
    });
    res.json({status:200,file:files});
},

listFiles:function(req,res){
     // Imports the Google Cloud client library
    const Storage = require('@google-cloud/storage');

     // Creates a client
    const storage = new Storage({
        projectId: projectId,
    });

     /**
      * TODO(developer): Uncomment the following line before running the sample.
      */
     const bucketName = 'my-bucketbezop';

     // Lists files in the bucket
    storage
     .bucket(bucketName)
     .getFiles()
     .then(results => {
         const files = results[0];
         return res.json(files);
        //  console.log('Files:');
        //  files.forEach(file => {
        //  console.log(file.name);
        //  });
     })
     .catch(err => {
         console.error('ERROR:', err);
     });
},
downloadFile(){
    // Creates a client
    const storage = new Storage();

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
   // const bucketName = 'Name of a bucket, e.g. my-bucket';
    const srcFilename = 'courage.jpg';
    const destFilename = '/home/jeff/Downloads/courage.jpg';

    const options = {
        // The path to which the file should be downloaded, e.g. "./file.txt"
        destination: destFilename,
    };

    // Downloads the file
    storage
        .bucket(bucketName)
        .file(srcFilename)
        .download(options)
        .then(() => {
        console.log(
            `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
        );
        })
        .catch(err => {
        console.error('ERROR:', err);
        });

    },
deletefile(req,res){
const Storage = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

/**
* TODO(developer): Uncomment the following lines before running the sample.
*/

const bucketName = req.body.bucketNamedir;
const filename = req.body.filedir;


console.log("this is the filename"+filename)



//copy file to another bucket


// Deletes the file from the bucket
storage
.bucket(bucketName)
.file(filename)
.delete()
.then(() => {
  console.log(`gs://${bucketName}/${filename} deleted.`);
})
.catch(err => {
  console.error('ERROR:', err);
});
},

copyfile(){

// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

/**
* TODO(developer): Uncomment the following lines before running the sample.
*/
const srcBucketName = bucketName;
const srcFilename = 'courage.jpg';
const destBucketName = 'archivestuff';
const destFilename = srcFilename;
// Copies the file to the other bucket
storage
.bucket(srcBucketName)
.file(srcFilename)
.copy(storage.bucket(destBucketName).file(destFilename))
.then(() => {
  console.log(
    `gs://${srcBucketName}/${srcFilename} copied to gs://${destBucketName}/${destFilename}.`
  );
})
.catch(err => {
  console.error('ERROR:', err);
});
},

makefilepublic(){
    // [START storage_make_public]
  // Imports the Google Cloud client library
  const Storage = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const bucketName = 'my-bucketbezop';
  const filename = '275b3506-e66f-4423-b36b-be24b37e9f42.jpg';

  // Makes the file public
  storage
    .bucket(bucketName)
    .file(filename)
    .makePublic()
    .then(() => {
      console.log(`gs://${bucketName}/${filename} is now public.`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

};

