const aws = require('aws-sdk');
const s3 = new aws.S3();
module.exports = class S3PolicySigner {
  constructor(bucketName, expiry) {
    this.bucketName = bucketName;
    this.expiry = expiry || 600;
  };
  signUpload(key, uploadLimitInMB) {
    const uploadParams = {
      Bucket: this.bucketName,
      Expires: this.expiry,
      Conditions: [
        ['content-length-range', 1, uploadLimitInMB * 1000000]
      ],
      Fields: { acl: 'private', key: key }
    };
    return s3.createPresignedPost(uploadParams);
  };
  signDownload(key) {
    const downloadParams = {
      Bucket: this.bucketName,
      Key: key,
      Expires: this.expiry
    };
    return s3.getSignedUrl('getObject', downloadParams);
  };
};
