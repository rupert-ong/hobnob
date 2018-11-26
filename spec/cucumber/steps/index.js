import { When, Then } from 'cucumber';

When('the client creates a POST request to /users', function (cb) {
  cb(null, 'pending');
});

When('attaches a generic empty payload', function (cb) {
  cb(null, 'pending');
});

When('sends the request', function (cb) {
  cb(null, 'pending');
});

Then('our API should respond with a 400 HTTP status code', function (cb) {
  cb(null, 'pending');
});

Then('the payload of the response should be a JSON object', function (cb) {
  cb(null, 'pending');
});

Then('contains a message property which says "Payload should not be empty"', function (cb) {
  cb(null, 'pending');
});
