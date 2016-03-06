#!/bin/bash

echo "test db: re/create"
dropdb ratings_test
createdb ratings_test

echo "test db: migrate"
DATABASE_URL="postgresql://postgres:@localhost:5432/ratings_test?param=value" ./node_modules/.bin/pg-migrate up
