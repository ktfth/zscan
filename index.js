'use strict';
const net = require('net');

function resolve(host, port, cb=() => {}) {
  return net.connect({
    port: port,
    host: host,
  }, cb);
}

function isPortOpen(host, port, cb=() => {}) {
  return net.connect({
    port: port,
    host: host,
  }, () => {
    console.log(`${port} open`);
    cb();
  });
}

let args = process.argv.slice(2);
let showedIpAddress = false;

if (args.length === 2 && /\,|\,\s/.test(args[1])) {
  for (let port of args[1].split(/\,|\,\s/)) {
    const s0 = resolve(args[0], port, () => {
      if (!showedIpAddress) {
        console.log(s0.remoteAddress);
        showedIpAddress = true;
      }
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
} else if (args.length === 2 && /\-/.test(args[1])) {
  let params = args[1].split('-').map(v => v.trim()).map(v => parseInt(v, 10));
  let start = Math.max(1, params[0]);
  let end = params[1];

  for (let port = start; port <= end; port += 1) {
    const s0 = resolve(args[0], port, () => {
      if (!showedIpAddress) {
        console.log(s0.remoteAddress);
        showedIpAddress = true;
      }
      const s1 = isPortOpen(s0.remoteAddress, port, () => {
        if (!s0.destroyed) {
          s0.destroy();
        } if (!s1.destroyed) {
          s1.destroy();
        }
      });

      s1.setTimeout(6000);
      s1.on('timeout', () => {
        if (!s1.destroyed) {
          s1.destroy();
        }
      });
    });

    s0.setTimeout(6000);
    s0.on('timeout', () => {
      if (!s0.destroyed) {
        s0.destroy();
      }
    });
  }
}
