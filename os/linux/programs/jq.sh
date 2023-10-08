#!/bin/bash

echo "Installing Jq"

sudo apt update
sudo apt install -y jq
echo "✅ jq has been installed successfully."
exec bash
