#!/usr/bin/env bash

#
# This script generates SSL certificates for the local development environment.
# It uses mkcert to generate the certificates and install the root certificate.
#
# Parameters:
# 1. The domain name for the dev environment (required)
# 3. The domain name for the test environment (required)
#
# Usage:
# ./gen-certs.sh <domain_name_dev> <domain_name_test>
#
# Example:
# ./gen-certs.sh my-project.dev.example.com my-project.test.example.com
#

set -e

# Get the directory of this script
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

red=$(tput setaf 1)
green=$(tput setaf 2)
reset=$(tput sgr0)

domain_name_dev=$1
domain_name_test=$2

certs_dir=$dir/../certs

dev_cert_file_name=dev.cert.pem
dev_key_file_name=dev.key.pem
test_cert_file_name=test.cert.pem
test_key_file_name=test.key.pem

# Check if mkcert is installed
if ! command -v mkcert &>/dev/null; then
    echo "${red}mkcert could not be found. Please install it and try again.${reset}"
    echo "See ${green}https://github.com/FiloSottile/mkcert${reset} for installation options."
    exit 1
fi

# Install root certificate
echo "${green}=== Installing root certificate... ===${reset}"
mkcert -install

# Generate dev certificates
echo "${green}=== Generating dev certificates... ===${reset}"
mkcert -cert-file $certs_dir/$dev_cert_file_name -key-file $certs_dir/$dev_key_file_name $domain_name_dev

# Generate test certificates
echo "${green}=== Generating test certificates... ===${reset}"
mkcert -cert-file $certs_dir/$test_cert_file_name -key-file $certs_dir/$test_key_file_name $domain_name_test

echo "${green}=== Certificates generated successfully! ===${reset}"
