#!/bin/bash
echo "Installing Snap"

sudo apt update
sudo apt install snapd

echo "snap has been installed successfully."

exec bash
