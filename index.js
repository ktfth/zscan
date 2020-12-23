'use strict';
const net = require('net');

function resolve(host, port, cb) {
  return net.connect({
    port: port,
    host: host,
  }, cb);
}

function isPortOpen(host, port) {
  return net.connect({
    port: port,
    host: host,
  }, () => {
    console.log(`${port} open`);
  });
}

let args = process.argv.slice(2);
let showedIpAddress = false;

if (args.length === 2) {
  for (let port of args[1].split(/\,|\,\s/)) {
    const s0 = resolve(args[0], port, () => {
      if (!showedIpAddress) console.log(s0.remoteAddress);
      const s1 = isPortOpen(s0.remoteAddress, port);

      s1.setTimeout(3000);
      s1.on('timeout', () => {
        s1.destroy();
      });
    });

    s0.setTimeout(3000);
    s0.on('timeout', () => {
      s0.destroy();
    });
  }
}
