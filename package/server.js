#!/usr/bin/env node
var fs = require('fs');

let slug;
try{
  let appConfig = JSON.parse(fs.readFileSync('./app.json', 'utf8'));
  slug = appConfig.expo.slug;
} catch(e) {
  console.error('must be run from a valid expo project');
  process.exit(1);
}


var express = require('express');
const cpFile = require('cp-file');
var app = express();
app.use(express.json());

app.post('/save', async function (req, res) {
  let { file, deviceName, timestamp } = req.body;
  await cpFile(file, `./screenshots/${timestamp}/${deviceName}.png`);
  res.end();
});

app.get('/status', function (req, res) {
  res.send({slug});
});

var server = app.listen(3030, function() {
  console.log('Listening on port %d', server.address().port);
});
