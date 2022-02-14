module.exports = function extractS3Info(event) {
  const eventRecord = event.Records && event.Records[0],
    bucket = eventRecord.s3.bucket.name,
    key = eventRecord.s3.object.key;
  return {bucket, key};
};

