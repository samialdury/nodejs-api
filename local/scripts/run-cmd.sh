#!/bin/bash

#
# This script runs a command in a docker container, using docker compose.
#
# Parameters:
# 1. The docker compose file (required)
# 2. The command to run (required)
# 3. The target service (optional, defaults to `app`)
#
# Usage:
# ./run-cmd.sh <docker-compose-file> <command> <target-service?>
#
# Example:
# ./run-cmd.sh docker-compose.yml "psql -V" db
#
# Makefile example:
# @$(WAIT_UNTIL) '$(RUN_IN_DOCKER) $(TEST_COMPOSE_FILE) '\''pg_isready --host postgres'\'' postgres'

set -e

file=$1
cmd=$2
target=${3:-app}

docker compose -f $file run --rm $target sh -c "$cmd"
