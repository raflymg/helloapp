const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const secret = '220102'; // samakan dengan secret di GitHub

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

    if (signature === digest) {
        exec('/var/www/helloapp/deploy.sh', (err, stdout, stderr) => {
            console.log(stdout, stderr);
        });
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
});

app.listen(9000, () => {
    console.log('Webhook listener running on port 9000');
});
