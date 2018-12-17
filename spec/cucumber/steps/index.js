import superagent from 'superagent';
import { When, Then } from 'cucumber';
import assert from 'assert';

// In Cucumber, an isolated context for each scenario is called a world
// The context object is exposed inside each step as the this object

When(/^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/, function (method, path) {
  this.request = superagent(method, `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}${path}`);
});

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function (headerName) {
  this.request.unset(headerName);
});

When(/^attaches a generic (.+) payload$/, function (payloadType) {
  switch (payloadType) {
    case 'malformed':
      this.request.send('{"email": "dan@danyll.com", name: }');
      this.request.set('Content-Type', 'application/json');
      break;
    case 'non-JSON':
      this.request.send('<?xml version="1.0" encoding="UTF-8" ?><email>dan@danyll.com</email>');
      this.request.set('Content-Type', 'text/xml');
      break;
    case 'empty':
    default:
  }
});

When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9]+) fields?$/, function (payloadType, missingFields) {
  const payload = {
    email: 'e@ma.il',
    password: 'password',
  };
  const fieldsToDelete = missingFields.split(',').map(s => s.trim()).filter(s => s !== '');
  fieldsToDelete.forEach(field => delete payload[field]);
  this.request
    .send(JSON.stringify(payload))
    .set('Content-Type', 'application/json');
});

When(/^sends the request$/, function (cb) {
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

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

Then(/^the payload of the response should be a JSON object$/, function () {
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

Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function (message) {
  assert.equal(this.responsePayload.message, message);
});
