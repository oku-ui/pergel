#!/bin/bash

if [ $OPERATION = "install" ]; then
    echo "Installing Gdebi"

    sudo apt update
    sudo apt-get -y install gdebi-core
    echo "✅ Gdebi has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    echo "Uninstalling Gdebi"
    sudo apt-get remove gdebi-core
    echo "✅ Gdebi has been uninstalled successfully."
fi

exec bash
