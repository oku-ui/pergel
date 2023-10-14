#!/bin/bash

if [ $OPERATION = "install" ]; then
    echo "Installing Bun"

    curl -fsSL https://bun.sh/install | bash # for macOS, Linux, and WSL
    source ~/.bashrc
    echo "✅ Bun has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    sudo rm -rf ~/.bun 
    echo "✅ Bun has been uninstalled successfully."
fi

exec bash
