#!/usr/bin/env bash

#
# This scripts waits until a command is successful.
#
# Parameters:
# 1. The command to run (required)
# 2. The timeout in seconds (optional, defaults to `30`)
#
# Usage:
# ./wait-until.sh <command> <timeout?>
#
# Example:
# ./wait-until.sh "pg_isready" 10
#
# Source:
# https://github.com/nickjj/wait-until
#

red=$(tput setaf 1)
reset=$(tput sgr0)

command="${1}"
timeout="${2:-30}"

i=1
until eval "${command}"; do
    ((i++))

    if [ "${i}" -gt "${timeout}" ]; then
        echo "${red}command was never successful, aborting due to ${timeout}s timeout!${reset}"
        exit 1
    fi

    sleep 1
done
