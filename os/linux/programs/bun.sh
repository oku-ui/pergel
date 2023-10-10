#!/bin/bash

echo "Installing Bun"

curl -fsSL https://bun.sh/install | bash # for macOS, Linux, and WSL

source ~/.bashrc

echo "✅ Bun has been installed successfully."
exec bash
