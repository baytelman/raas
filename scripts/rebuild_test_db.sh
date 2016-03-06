#!/bin/bash

echo "test db: re/create $POSTGRES_PORT_5432_TCP_ADDR"
dropdb ratings_test
createdb ratings_test

echo "test db: migrate"
DATABASE_URL="postgresql://postgres:ourlittlesecret@$POSTGRES_PORT_5432_TCP_ADDR:5432/ratings_test?param=value" ./node_modules/.bin/pg-migrate up
