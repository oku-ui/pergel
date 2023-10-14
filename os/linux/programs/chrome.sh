#!/bin/bash

if [ $OPERATION = "install" ]; then
  sudo apt update
  sudo apt upgrade

  sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  sudo apt install ./google-chrome-stable_current_amd64.deb

  echo "Package installed successfully. Removing the installation file..."
  sudo rm ./google-chrome-stable_current_amd64.deb

  # Display a message if the installation was successful
  echo "google chrome has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
  sudo dpkg -r google-chrome-stable
  echo "✅ google chrome has been uninstalled successfully."
fi

exec bash
