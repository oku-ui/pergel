#!/bin/bash

OPERATION=$1
if [ $OPERATION = "install" ]; then
    echo "Installing Android Studio"
    sudo apt install openjdk-11-jdk
    sudo snap install android-studio --classic
    echo "✅ Android Studio has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    echo "Uninstalling Android Studio"
    sudo snap remove android-studio
    echo "✅ Android Studio has been uninstalled successfully."
fi

exec bash
