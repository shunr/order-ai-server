const express = require('express');
const app = express();
const server = require('./server');

app.use(express.json());

app.post('/receive_order', (req, res) => {
  res.send('ok');
  let payload = {
    items: req.body,
    total: 25.00,
    contact: '<phone number>'
  };
  server.broadcast(JSON.stringify(payload));
  console.log(req.body);
})

app.listen(3000, () => console.log('SERVER STARTED'));