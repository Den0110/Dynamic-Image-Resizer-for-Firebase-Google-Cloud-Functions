import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sharp from 'sharp';

const {Storage} = require('@google-cloud/storage');
const gcs = new Storage({
	projectId: <PROJECT_ID>,
  keyFilename: <SERVICE_ACCOUNT_PRIVATE_KEY_FILE_NAME>
});

const bucket = '<PROJECT_ID>.appspot.com';

exports.image = functions.https.onRequest((req, res) => {
  const filename = req.query.file;
  const width = parseInt(req.query.w);
  const height = parseInt(req.query.h);

  if(!filename) {
    res.sendStatus(500).send("No file specified");;
    return;
  }

  const file = gcs.bucket(fromaggio_bucket).file(filename);
  const stream = file.createReadStream();

  stream.on('error', function(err) {
    console.error(err);
    res.sendStatus(err.code).end(err);
  });

  const transform = sharp().resize(width, height);

  return stream.pipe(transform).pipe(res);
});
