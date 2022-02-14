const RequestProcessor = require('../request-processor');
describe('request-processor', () => {
  let uploadSigner, downloadSigner,
    uploadLimit, allowedExtensions, underTest;
  beforeEach(() => {
    uploadSigner = {
      signUpload: jest.fn((key, limit) => `upload-max-${limit}-${key}`)
    };
    downloadSigner = {
      signDownload: jest.fn((key) => `download-${key}`)
    };
    uploadLimit = 10;
    allowedExtensions = 'jpg,gif';
    underTest = new RequestProcessor(
      uploadSigner, downloadSigner, uploadLimit, allowedExtensions
    );
  });
  describe('processRequest', () => {
    test('rejects request without an extension', () => {
      expect(() => underTest.processRequest('req-id'))
        .toThrow('no extension provided');
    });
    test('rejects requests with an unsupported extension', () => {
      expect(() => underTest.processRequest('req-id', 'xls'))
        .toThrow('extension xls is not supported');
    });
    test('signs a request for supported extensions', () => {
      expect(underTest.processRequest('req-id', 'jpg'))
        .toEqual({
          "download": "download-req-id.jpg",
          "upload": "upload-max-10-req-id.jpg"
        });
    });
  });
});
