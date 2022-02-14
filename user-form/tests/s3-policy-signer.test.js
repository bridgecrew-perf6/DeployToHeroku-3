const aws = require('aws-sdk'),
  get = require('got'),
  s3 = new aws.S3(),
  S3PolicySigner = require('../s3-policy-signer');
describe('s3-policy-signer', () => {
  let bucketName;
  beforeAll(() => {
    jest.setTimeout(10000);
    bucketName = `test-signer-${Date.now()}`;
    return s3.createBucket({Bucket: bucketName}).promise();
  });
  afterAll(() => {
    return s3.deleteBucket({Bucket: bucketName}).promise();
  });
  describe('signDownload', () => {
    let fileKey;
    beforeEach(() => {
      fileKey = `test-file-${Date.now()}`;
      return s3.putObject({
        Bucket: bucketName,
        Key: fileKey,
        Body: 'test-file-contents'
      }).promise();
    });
    afterEach(() => {
      return s3.deleteObject({
        Bucket: bucketName, Key: fileKey
      }).promise();
    });
    test('produces a URL allowing direct HTTPS access', () => {
      const underTest = new S3PolicySigner(bucketName, 600);
      const url = underTest.signDownload(fileKey);
      return get(url)
        .then(r => expect(r.body).toEqual('test-file-contents'));
    });
  });
});
