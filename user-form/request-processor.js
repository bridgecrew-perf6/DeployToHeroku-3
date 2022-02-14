module.exports = class RequestProcessor {
  constructor(uploadSigner, downloadSigner, uploadLimitInMB, allowedExtensions) {
    this.uploadSigner = uploadSigner;
    this.downloadSigner = downloadSigner;
    this.uploadLimitInMB = uploadLimitInMB;
    this.allowedExtensions = allowedExtensions;
  };
  processRequest(requestId, extension) {
    if (!extension) {
      throw `no extension provided`;
    }
    const normalisedExtension = extension.toLowerCase();
    const isImage = this.allowedExtensions.includes(normalisedExtension);
    if (!isImage) {
      throw `extension ${extension} is not supported`;
    }
    const fileKey = `${requestId}.${normalisedExtension}`;
    return {
      upload: this.uploadSigner.signUpload(fileKey, this.uploadLimitInMB),
      download: this.downloadSigner.signDownload(fileKey)
    };
  };
};
