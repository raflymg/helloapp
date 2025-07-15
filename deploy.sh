#!/bin/bash
cd /var/www/helloapp
git pull origin main
pm2 restart helloapp
