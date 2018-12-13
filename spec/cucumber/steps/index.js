import superagent from 'superagent';
import { When, Then } from 'cucumber';
import assert from 'assert';

// In Cucumber, an isolated context for each scenario is called a world
// The context object is exposed inside each step as the this object

When('the client creates a POST request to /users', function () {
  this.request = superagent('POST', `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`);
});

When('attaches a generic empty payload', function () {
  return undefined;
});

When('sends the request', function (cb) {
  this.request
    .then((response) => {
      this.response = response.res;
      cb();
    })
    .catch((errResponse) => {
      this.response = errResponse.response;
      cb();
    });
});

Then('our API should respond with a 400 HTTP status code', function () {
  assert.equal(this.response.statusCode, 400);
});

Then('the payload of the response should be a JSON object', function () {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response not of Content type application/json');
  }

  try {
    this.responsePayload = JSON.parse(this.response.text);
  } catch (e) {
    throw new Error('Response is not a valid JSON object');
  }
});

Then('contains a message property which says "Payload should not be empty"', function () {
  assert.equal(this.responsePayload.message, 'Payload should not be empty');
});
