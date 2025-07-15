const express = require('express');
const crypto = require('crypto');
const getRawBody = require('raw-body');
const { exec } = require('child_process');

const app = express();
const secret = '220102'; // samakan dengan secret GitHub Webhook

// Middleware untuk ambil raw body
app.use((req, res, next) => {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: true,
  }, (err, string) => {
    if (err) return next(err);
    req.rawBody = string;
    next();
  });
});

// Endpoint webhook
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

  if (signature === digest) {
    console.log("✅ Signature cocok, menjalankan deploy.sh...");
    exec('/var/www/helloapp/deploy.sh', (err, stdout, stderr) => {
      console.log(stdout, stderr);
    });
    res.sendStatus(200);
  } else {
    console.log("⛔ Signature tidak cocok!");
    res.sendStatus(403);
  }
});

// Jalankan server listener
app.listen(9000, () => {
  console.log('Webhook listener berjalan di port 9000');
});
