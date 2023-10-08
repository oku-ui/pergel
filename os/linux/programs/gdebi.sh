#!/bin/bash

echo "Installing Gdebi"

sudo apt update
sudo apt-get -y install gdebi-core
echo "✅ Gdebi has been installed successfully."
exec bash
