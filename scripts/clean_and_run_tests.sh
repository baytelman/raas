#!/bin/bash

echo "npm: Installing dependencies"
npm install

echo "rebuilding test db"
sh ./scripts/rebuild_test_db.sh

echo "running tests"
ENV=test mocha
