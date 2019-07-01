const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const pathnameArray = url.parse(req.url).pathname.split('/');
  if (pathnameArray.length > 2) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  };
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      checkAccessFile(res, filepath);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function checkAccessFile(res, filepath) {
  fs.stat(filepath, (err) => {
    if (!err) {
      deleteFile(res, filepath);
    } else if (err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('File not found');
    }
  });
}

function deleteFile(res, filepath) {
  fs.unlink(filepath, (err) => {
    if (!err) {
      res.statusCode = 200;
      res.end('File delete');
    } else if (err.code === 'ENOENT') {
      res.statusCode = 500;
      res.end('Internal error');
    }
  });
}

module.exports = server;
