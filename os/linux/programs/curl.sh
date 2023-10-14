#!/bin/bash

OPERATION=$1
if [ $OPERATION = "install" ]; then
    echo "Installing Curl"

    sudo apt update
    sudo apt install curl
    echo "✅ Curl has been installed successfully."
    exec bash
elif [ $OPERATION = "uninstall" ]; then
    echo "Uninstalling Curl"
    sudo apt remove -y curl
    echo "✅ Curl has been uninstalled successfully."
fi

exec bash
