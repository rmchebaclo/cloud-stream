"use strict";
// 1. GCS file interactions 
// 2. Local file interactions
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDirectories = setupDirectories;
exports.convertVideo = convertVideo;
exports.downloadRawVideo = downloadRawVideo;
exports.uploadProcesssedVideo = uploadProcesssedVideo;
exports.deleteRawVideo = deleteRawVideo;
exports.deleteProcessedVideo = deleteProcessedVideo;
const storage_1 = require("@google-cloud/storage");
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const storage = new storage_1.Storage();
const rawVideoBucketName = "rmchebaclo-raw-videos";
const processedVideoBucketName = "rmchebaclo-processed-videos";
const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";
// Creates local directories for raw and processed videos
// Ensures these folders exist by the time a containter is started up
// Important because files with always be saved to these folders
function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}
/**
 *
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted
 */
function convertVideo(rawVideoName, processedVideoName) {
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)(`${localRawVideoPath}/${rawVideoName}`).outputOptions("-vf", "scale= 1:1080") // 1080p
            .on("end", () => {
            console.log("Video processing finished succesfully.");
            resolve();
        })
            .on("error", (err) => {
            console.log(`An error occured: ${err.message}`);
            reject(err);
        })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}
/**
 * @param filename - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
function downloadRawVideo(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield storage.bucket(rawVideoBucketName)
            .file(fileName)
            .download({ destination: `${localRawVideoPath}/${fileName}` });
        console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`);
    });
}
/**
 * @param filename - The name of the file to upload from the
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
function uploadProcesssedVideo(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const bucket = storage.bucket(processedVideoBucketName);
        yield bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
            destination: fileName
        });
        console.log(`gs://${localProcessedVideoPath}/${fileName} uploaded to ${processedVideoBucketName}/${fileName}`);
        // specifying we want a file uploaded to this processed bucket to be public since it isn't by default
        yield bucket.file(fileName).makePublic();
    });
}
/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        if (fs_1.default.existsSync(filePath)) {
            // quickest way to delete file without updating disk space
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                }
                else {
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            });
        }
        else {
            console.log(`File not found at ${filePath}. skipping the delete.`);
            resolve();
        }
    });
}
/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted
 */
function deleteRawVideo(fileName) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}
/**
 * @param fileName- The name of the file to delete from the
 * {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted
 */
function deleteProcessedVideo(fileName) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}
/**
 * Ensures a directory exists, creating it if neccesary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExistence(dirPath) {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true }); // enables creating nested directories
        console.log(`Directory created at ${dirPath}`);
    }
}
