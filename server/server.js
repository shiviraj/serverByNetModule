const {Server} = require('net');
const fs = require('fs');
const {getContentType} = require('./src/contentTypeLookup');
const {getResponseHeader} = require('./src/responseHeader');
const CLIENT_DIR = `${__dirname}/../client`;

const NOT_FOUND_TEXT = fs.readFileSync(`${__dirname}/database/notFound.html`);
const STATUS_OK = 'HTTP/1.1 200 OK';
const NOT_FOUND_STATUS = 'HTTP/1.1 404 NOT FOUND';

const getPathAndContentType = function(resource) {
  if (resource === '/') resource = '/index.html';
  const contentType = getContentType(resource);
  return [`${CLIENT_DIR}${resource}`, contentType];
};

const contentForError = () => [NOT_FOUND_TEXT, NOT_FOUND_STATUS, 'text/html'];

const sendResponse = function(data, socket) {
  const [request, ...headers] = data.split('\r\n');
  const [method, resource, protocol] = request.split(' ');
  let [path, contentType] = getPathAndContentType(resource);
  fs.readFile(path, (err, data) => {
    let statusCode = STATUS_OK;
    if (err) [data, statusCode, contentType] = contentForError();
    const response = {data, statusCode, contentType, headers};
    const responseHeader = getResponseHeader(response);
    [responseHeader, data].forEach(chunk => socket.write(chunk));
  });
};

const socketHandler = function(socket) {
  const remote = {addr: socket.remoteAddress, port: socket.remotePort};
  console.log('New Connection', remote);
  socket.setEncoding('utf8');
  socket.on('data', text => sendResponse(text, socket));
  socket.on('end', () => console.warn('connection ended', remote));
  socket.on('close', () => console.warn('connection closed', remote));
};

const main = function() {
  const server = new Server();
  server.on('connection', socketHandler);
  server.on('close', () => console.log('Server Closed'));
  server.on('error', err => console.error('There is server error: ', err));
  server.listen(3000, () => console.log('server is on'));
};

main();
