const azureStorage = require("azure-storage");
const { Readable } = require("stream");
const { azureStorageConfig } = require("./config");

class BufferStream extends Readable {
  constructor(buffer) {
    super();
    this.buffer = buffer;
  }

  _read() {
    this.push(this.buffer);
    this.push(null);
  }
}

function bufferToStream(buffer) {
  return new BufferStream(buffer);
}

const uploadFileToBlob = async (file, containerName, UserID, filename) => {
  return new Promise((resolve, reject) => {
    let blobName =
      "AzureBlob" +
      "-" +
      Date.now() +
      "." +
      file.originalname.split(".")[ file.originalname.split(".").length - 1 ];
    if (containerName === "certificates") {
      blobName =
        "AzureBlob" +
        "-" +
        UserID +
        "FoodHandlingCert" +
        "." +
        file.originalname.split(".")[ file.originalname.split(".").length - 1 ];
    }
    if (filename === "profile") {
      blobName =
        UserID +
        "ProfileImage" +
        "." +
        file.originalname.split(".")[ file.originalname.split(".").length - 1 ];
    }
    const streamLength = file.buffer.length;
    const stream = bufferToStream(file.buffer);
    const blobService = azureStorage.createBlobService(
      azureStorageConfig.accountName,
      azureStorageConfig.accountKey
    );
    blobService.createBlockBlobFromStream(
      containerName,
      blobName,
      stream,
      streamLength,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            filename: blobName,
            originalname: file.originalname,
            size: streamLength,
            path: `${containerName}/${blobName}`,
            url: `${azureStorageConfig.blobURL}${containerName}/${blobName}`,
          });
        }
      }
    );
  });
};

const getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, ""); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};
module.exports = { uploadFileToBlob };
