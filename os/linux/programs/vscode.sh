#!/bin/bash

if [ $OPERATION = "install" ]; then
    sudo apt update
    sudo apt install software-properties-common apt-transport-https -y
    wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
    sudo apt install code
    echo "✅ VSCode has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    sudo apt remove code
    echo "✅ VSCode has been uninstalled successfully."
fi

exec bash
