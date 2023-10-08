#!/bin/bash

# Check if google chrome is not installed
INSTALLED_CHROME_VERSION=$(google-chrome-stable --version)
echo $INSTALLED_CHROME_VERSION
if [ -z "$INSTALLED_CHROME_VERSION" ]; then
  echo "google chrome is not installed, starting the installation..."

  sudo apt update
  sudo apt upgrade

  sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  sudo apt install ./google-chrome-stable_current_amd64.deb

  echo "Package installed successfully. Removing the installation file..."
  sudo rm ./google-chrome-stable_current_amd64.deb

  # Display a message if the installation was successful
  echo "google chrome has been installed successfully."
else
  echo "google chrome is already installed."
fi
exec bash