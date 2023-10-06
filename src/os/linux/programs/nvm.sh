#!/bin/bash

# Check if nvm is not installed
if command -v nvm &>/dev/null; then
  echo "nvm is already installed."
else
  echo "nvm is not installed, starting the installation..."
  wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
  # Display a message if the installation was successful
  if [ $? -eq 0 ]; then

    # Install the latest LTS version of Node.js using nvm
    echo "Installing the latest LTS version of Node.js..."
    nvm install --lts

    # Set the LTS version as the default
    nvm alias default $(nvm ls --lts | tail -n 1)

    # Verify the installation and default version
    echo "Default Node.js version: $(node --version)"
    echo "Default npm version: $(npm --version)"

    
    echo "nvm has been installed successfully."
  else
    echo "An error occurred while installing nvm."
    exit 1
  fi
fi
