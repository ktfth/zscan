'use strict';
const net = require('net');

function isPortOpen(host, port) {
  return net.connect({
    port: port,
    host: host,
  }, () => {
    console.log(`${port} open`);
  });
}

let args = process.argv.slice(2);

if (args.length === 2) {
  args[1].split(/\,|\,\s/).forEach(port => {
    const s = isPortOpen(args[0], port);
    setTimeout(() => {
      s.destroy();
    }, 3000);
  });
}
