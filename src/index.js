// Allows us to use Newer JavaScript API (Like Fetch)
import '@babel/polyfill';
import http from 'http';

function requestHandler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello Mom!');
}
const server = http.createServer(requestHandler);
server.listen(8080);
