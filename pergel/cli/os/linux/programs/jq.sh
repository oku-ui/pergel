#!/bin/sh

OPERATION=$1
if [ "$OPERATION" = "install" ]; then
  echo "Installing Jq"
  sudo apt update
  sudo apt install -y jq
  echo "✅ jq has been installed successfully."
elif [ "$OPERATION" = "uninstall" ]; then
  echo "Uninstalling Jq"
  sudo apt remove -y jq
  echo "✅ jq has been uninstalled successfully."
fi

exec bash
