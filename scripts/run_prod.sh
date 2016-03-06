#!/bin/bash

echo "migrating db"
DATABASE_URL="postgresql://postgres:ourlittlesecret@$POSTGRES_PORT_5432_TCP_ADDR:5432/ratings_test?param=value" ./node_modules/.bin/pg-migrate up

echo "running production"
ENV=prod ./node_modules/.bin/nodemon src/app.js
