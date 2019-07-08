const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

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
    case 'POST':
      writeData(req, res, filepath);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

const writeData = (req, res, filepath) => {
  const writeStream = fs.createWriteStream(filepath, {emitClose: true, flags: 'wx'});
  const limitStream = new LimitSizeStream({limit: 1048576});
  req
      .on('error', (err) => {
        writeStream.destroy(err);
      })
      .on('close', () => {
        if (req.aborted) writeStream.destroy(new Error('connection close'));
      })
      .pipe(limitStream)
      .on('error', (err) => {
        writeStream.destroy(err);
      })
      .pipe(writeStream)
      .on('error', (err) => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('already exists');
        } else {
          removeFileOnError(err, res, filepath);
        };
      })
      .on('close', () => {
        checkCompleteUpload(req, res, filepath);
      });
};

function removeFileOnError(err, res, filepath) {
  if (err instanceof LimitExceededError) {
    res.statusCode = 413;
    res.end('file length limit');
  } else if (err.message != 'connection aborted') {
    if (!res.finished) {
      res.statusCode = 500;
      res.end('internal error');
    };
  };
  fs.unlink(filepath, () => {});
};

function checkCompleteUpload(req, res, filepath) {
  if (!res.finished) {
    res.statusCode = 201;
    res.end('upload complete');
  };
};

module.exports = server;
