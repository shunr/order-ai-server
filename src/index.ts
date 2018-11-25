import express from 'express';
import { readFileSync } from 'fs';
import { createServer } from 'https';

import { DB } from './db';
import { Generator } from './generator';

const fulfillment = require('./fulfillment');

const sslOptions: object = {
  key: readFileSync('/cert/privkey.pem'),
  cert: readFileSync('/cert/cert.pem'),
  ca: readFileSync('/cert/chain.pem')
};

async function main(): Promise<void> {
  await DB.init();
  await DB.test();
  console.log(await DB.getItems());
  await Generator.setup();

  const app: express.Express = express();
  app.use(express.json());
  app.post('/fulfillment', fulfillment.handleRequest);
  createServer(sslOptions, app).listen(443);
}

main();
