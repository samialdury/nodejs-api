#!/bin/bash

set -e

docker compose -f $1 run --rm service sh -c "$2"
