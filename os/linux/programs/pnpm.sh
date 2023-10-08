#!/bin/bash

echo "Installing Pnpm"

sudo apt update
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
echo "✅ Pnpm has been installed successfully."
exec bash