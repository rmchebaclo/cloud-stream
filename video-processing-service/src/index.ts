import express from 'express';
import ffmpeg from 'fluent-ffmpeg'
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcesssedVideo } from './storage';
import { upload } from '@google-cloud/storage/build/cjs/src/resumable-upload';

setupDirectories();


const app = express();
app.use(express.json())

app.post('/process-video', async (req, res) => {
  // Get the bucket and filename from the Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send('Bad request: missing filename.');
  }

  const inputFileName = data.name;
  const outputFileName = `processes-${inputFileName}`;

  // Download the raw video from cloud storage
  await downloadRawVideo(inputFileName)
  
  // Convert the video to 1080p
  try {
    await convertVideo(inputFileName, outputFileName)
  } catch (err) {
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);

    await deleteRawVideo(inputFileName)
    await deleteProcessedVideo(outputFileName)
    console.error(err);
    return res.status(500).send('Internal Server Error: video processing failed.')
  }
  
  // Upload the processed video to Cloud Storage
  await uploadProcesssedVideo(outputFileName);
  
  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ]);
  return res.status(200).send('Processing finished succesfully.')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

