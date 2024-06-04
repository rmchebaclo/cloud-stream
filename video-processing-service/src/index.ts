import express from 'express';
import ffmpeg from 'fluent-ffmpeg'


const app = express();
app.use(express.json())

app.post('/process-video', (req, res) => {
  // Get path of the input video file from the request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  // error throwing for missing files
  if (!inputFilePath && !outputFilePath) {
    res.status(400).send("Bad Request: Missing input and output file path")
  }
  else if (!inputFilePath) {
    res.status(400).send("Bad Request: Missing input file path")
  } 
  else if (!outputFilePath) {
    res.status(400).send("Bad Request: Missing output file path")
  }

  ffmpeg(inputFilePath).outputOptions("-vf", "scale= 1920:1080") // 1080p

  .on("end", () => {
    return res.status(200).send("Video processing finished succesfully.")
  })
  .on("error", (err) => {
    console.log(`An error occured: ${err.message}`)
    res.status(500).send(`Internal Server Error: ${err.message}`)
  })
  .save(outputFilePath)
  
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

