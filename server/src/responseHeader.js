const setCookie = function(headerText, requestHeader) {
  if (!requestHeader['Cookie']) {
    headerText = `${headerText}Set-Cookie: sessionId=38afes7a8\n`;
  }
  return `${headerText}\n`;
};

const parseHeader = function(header, headerLine) {
  const [key, ...value] = headerLine.split(': ');
  header[key] = value.join(': ');
  return header;
};

const getResponseHeader = function({data, statusCode, contentType, headers}) {
  const requestHeader = headers.reduce(parseHeader, {});
  const headerText = `${statusCode}\nContent-Type: ${contentType}\nContent-Length: ${data.length}\n`;
  return setCookie(headerText, requestHeader);
};

module.exports = {getResponseHeader};
