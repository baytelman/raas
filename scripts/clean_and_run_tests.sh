#!/bin/bash

echo "npm: Installing dependencies"
npm install

echo "rebuilding test db"
export POSTGRES_PORT_5432_TCP_ADDR=localhost
sh ./scripts/rebuild_test_db.sh

echo "running tests"
ENV=test ./node_modules/.bin/mocha
