// Allows us to use Newer JavaScript API (Like Fetch)
import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

function checkEmptyPayload(req, res, next) {
  if (
    ['POST', 'PATCH', 'PUT'].includes(req.method)
    && req.headers['content-length'] === '0'
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'Payload should not be empty' });
  }
  next();
}

function checkContentTypeIsSet(req, res, next) {
  if (
    req.headers['content-length']
    && req.headers['content-length'] !== '0'
    && !req.headers['content-type']
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'The "Content-Type" header must be set for requests with a non-empty payload' });
  }
  next();
}

function checkContentTypeIsJson(req, res, next) {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(415);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'The "Content-Type" header must always be "application/json"' });
  }
  next();
}

app.use(bodyParser.json({ limit: 1e6 }));
app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);

app.post('/users', (req, res, next) => {
  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'email')
    || !Object.prototype.hasOwnProperty.call(req.body, 'password')
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'Payload must contain at least the email and password fields' });
  }

  if (
    typeof req.body.email !== 'string'
    || typeof req.body.password !== 'string'
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'The email and password fields must be of type string' });
  }

  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'The email field must be a valid email' });
  }
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && err.body && err.type === 'entity.parse.failed') {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({
      message: 'Payload should be in JSON format',
    });
  }
  next();
});

app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Hobnob API server listing on port ${process.env.SERVER_PORT}`);
});
