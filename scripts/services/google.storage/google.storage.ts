import { Storage } from "@google-cloud/storage";

const bucketName = "litter-tracker.appspot.com";

// Creates a client
const storage = new Storage();

export const UploadFile = async (filePath: string) => {
  try {
    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filePath, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: "public, max-age=31536000",
      },
    });

    return filePath;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const DownloadFile = async (destPath: string, srcFilepath: string) => {
  try {
    const options = {
      // The path to which the file should be downloaded, e.g. "./file.txt"
      destination: destPath,
    };

    // Downloads the file
    await storage.bucket(bucketName).file(srcFilepath).download(options);

    return destPath;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
