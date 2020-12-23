'use strict';
const net = require('net');

let port = 80;

net.connect({
  port: port,
  host: 'google.com',
}, () => {
  console.log('Port open: ' + port);
  process.exit(0);
});
