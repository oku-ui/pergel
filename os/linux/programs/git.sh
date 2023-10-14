#!/bin/bash

OPERATION=$1
if [ $OPERATION = "install" ]; then
    echo "Installing Git"
    sudo apt update
    sudo apt install git
    echo "✅ Git has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    echo "Uninstalling Git"
    sudo apt-get remove git
    echo "✅ Git has been uninstalled successfully."
fi

exec bash
