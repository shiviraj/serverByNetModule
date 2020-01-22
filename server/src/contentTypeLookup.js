const contentSubType = require('../database/contentType');
const fileType = require('../database/extensions');

const getExtension = function(resource) {
  let extension = resource.split('.').reverse()[0];
  if (extension in fileType) extension = fileType[extension];
  return extension;
};

const getContentType = function(resource) {
  const extension = getExtension(resource);
  const allContentTypes = Object.keys(contentSubType);
  const type = allContentTypes.filter(key =>
    contentSubType[key].includes(extension)
  );
  return `${type[0]}/${extension}`;
};

module.exports = {getContentType};
