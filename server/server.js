const {Server} = require('net');
const fs = require('fs');

const STATUS_OK = 'HTTP/1.1 200 OK';
const STATUS_NOT_FOUND = 'HTTP/1.1 404 NOT FOUND';

const NOT_FOUND = `
  <html>
    <head><title>NOT FOUND</title></head>
    <body>
      <h1>404 NOT FOUND</h1>
      <p>Page Not Found</p>
    </body>
  </html>`;

const getExtension = function(resource) {
  let extension = resource.split('.').reverse()[0];
  if (extension === 'ico') extension = 'x-icon';
  return extension;
};

const getContentType = function(resource) {
  const content = {
    text: ['html', 'css', 'js'],
    image: ['jpg', 'jpeg', 'png', 'x-icon']
  };
  const extension = getExtension(resource);
  const allContentTypes = Object.keys(content);
  const type = allContentTypes.filter(key => content[key].includes(extension));
  return `${type[0]}/${extension}`;
};

const getPathAndContentType = function(resource) {
  if (resource === '/') resource = '/index.html';
  const contentType = getContentType(resource);
  return [`client${resource}`, contentType];
};

const contentForError = function() {
  return [NOT_FOUND, STATUS_NOT_FOUND, 'text/html'];
};

const sendResponse = function(data, socket) {
  const [request, ...headers] = data.split('\n');
  const [method, resource, protocol] = request.split(' ');
  let [path, contentType] = getPathAndContentType(resource);
  fs.readFile(path, (err, data) => {
    let statusCode = STATUS_OK;
    if (err) [data, statusCode, contentType] = contentForError();
    const header = `${statusCode}\nContent-Type: ${contentType}\nContent-Length: ${data.length}\n\n`;
    [header, data].forEach((chunk, index) => socket.write(chunk));
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
