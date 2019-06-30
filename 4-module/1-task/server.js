const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const mime = require("mime-types");

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const pathnameArray = url.parse(req.url).pathname.split('/');
  if (pathnameArray.length > 2) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
        sendFile(filepath, res)
        .catch(err => {console.log(err)});
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

const sendFile = async (filepath, res) => {
  fs.stat(filepath, (err, stats) => {
    if (err) {
      res.statusCode = '404';
      res.end('File not found');
      return;
    }
    if (!stats.isFile()) {
      res.statusCode = '404';
      res.send('is not file');
    };
  });
  if (res.finished) return;
  const readFileStream = fs.createReadStream(filepath);
  const mimetype = mime.lookup(filepath);
  
  res.statusCode = '200'; 
  res.setHeader('Content-Type', mimetype + "; charset=utf-8");
  readFileStream
    .on('error', err => {
      res.statusCode = '500';
      res.end(err);
    })
    .pipe(res);
};

module.exports = server;
