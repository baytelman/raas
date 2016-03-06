#!/bin/bash

echo "migrating db"
DATABASE_URL=$PROD_DB_URL ./node_modules/.bin/pg-migrate up

echo "running production"
ENV=prod sudo ./node_modules/.bin/nodemon src/app.js
