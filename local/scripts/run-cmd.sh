#!/bin/bash

#
# This script runs a command in a docker container, using docker compose.
#
# Parameters:
# 1. The docker compose file (required)
# 2. The command to run (required)
# 3. The target service (optional, defaults to `app-dev` or `app-test`, depending if the `file` includes `test.docker-compose` or `dev.compose`)
#
# Usage:
# ./run-cmd.sh <docker-compose-file> <command> <target-service?>
#
# Example:
# ./run-cmd.sh docker-compose.yml "psql -V" db
#
# Makefile example:
# @$(WAIT_UNTIL) '$(RUN_IN_DOCKER) $(TEST_COMPOSE_FILE) '\''pg_isready --host postgres_test'\'' postgres_test'

set -e

red=$(tput setaf 1)
reset=$(tput sgr0)

file=$1
cmd=$2
target=$3

dev_compose_file="dev.docker-compose"
test_docker_compose_file="test.docker-compose"

# If `target` variable is empty, default it to `app-dev` or `app-test`,
# depending if the `file` includes `test.docker-compose` or `dev.compose`
if [ -z "$target" ]; then
    if [[ $file == *$test_docker_compose_file* ]]; then
        target="app-test"
    elif [[ $file == *$dev_compose_file* ]]; then
        target="app-dev"
    else
        echo "${red}ERROR: The docker compose file must start with either $dev_compose_file or $test_docker_compose_file.${reset}"
        exit 1
    fi
fi

docker compose -f $file run --rm $target sh -c "$cmd"
