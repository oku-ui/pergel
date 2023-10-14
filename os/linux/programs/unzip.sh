#!/bin/bash

if [ $OPERATION = "install" ]; then
    echo "Installing Unzip"

    sudo apt update
    sudo apt install unzip
    echo "✅ unzip has been installed successfully."
    exec bash
elif [ $OPERATION = "uninstall" ]; then
    sudo apt remove unzip
    echo "✅ unzip has been uninstalled successfully."
fi

exec bash
