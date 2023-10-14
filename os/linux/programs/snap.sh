#!/bin/bash

if [ $OPERATION = "install" ]; then
    echo "Installing Snap"

    sudo apt update
    sudo apt install snapd

    echo "snap has been installed successfully."

elif [ $OPERATION = "uninstall" ]; then
    echo "Uninstalling Snap"
    sudo apt-get remove snapd
    echo "✅ Snap has been uninstalled successfully."
fi

exec bash
