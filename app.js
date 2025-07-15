const http = require('http'); // memanggil modul http bawaan Node.js

const server = http.createServer((req, res) => {
  res.end('Hello World from Node.js on VPS!'); // respon ke browser
});

server.listen(3000, () => {
  console.log('Server is running on port 3000'); // tampil di log VPS
});
