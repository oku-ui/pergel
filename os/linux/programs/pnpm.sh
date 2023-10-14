#!/bin/bash

OPERATION=$1
if [ $OPERATION = "install" ]; then
    sudo apt update
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    source ~/.bashrc
    echo "✅ Pnpm has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    sudo apt-get remove pnpm
    sudo rm -rf $PNPM_HOME
    sudo npm rm -g pnpm
    echo "✅ Pnpm has been uninstalled successfully."
fi

exec bash
