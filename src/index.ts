import express from 'express';
import { createServer } from 'https';
import { readFileSync } from 'fs';

const fulfillment = require('./fulfillment')

const app = express();
app.use(express.json());

app.post('/fulfillment', fulfillment.handleRequest)

const sslOptions = {
  key: readFileSync('/cert/privkey.pem'),
  cert: readFileSync('/cert/cert.pem'),
  ca: readFileSync('/cert/chain.pem')
};

createServer(sslOptions, app).listen(443);
