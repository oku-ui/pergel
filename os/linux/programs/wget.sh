#!/bin/bash

if [ $OPERATION = "install" ]; then
    echo "Installing Wget"

    sudo apt update
    sudo apt install wget

    echo "✅ Wget has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    echo "Uninstalling Wget"
    sudo apt remove wget
    echo "✅ Wget has been uninstalled successfully."
fi

exec bash
