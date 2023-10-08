#!/bin/bash

echo "Installing Curl"

release_url="https://api.github.com/repos/shiftkey/desktop/releases/latest"

# Get file name
file_name="$(curl -sL $release_url | jq -r '.assets[] | select(.name | contains("amd64") and endswith(".deb")) | .name')"
echo version found to install: $file_name

sudo wget $(wget -q -O - $release_url  |  jq -r '.assets[] | select(.name | contains("amd64") and endswith(".deb")) | .browser_download_url')
sudo gdebi "$file_name" 
sudo rm ./$file_name
