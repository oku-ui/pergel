#!/bin/bash

OPERATION=$1
if [ $OPERATION = "install" ]; then
    echo "Installing Android Studio"
    
    sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386
    sudo snap install android-studio --classic
    echo "Add Android Studio to PATH"

    # Add Android Studio to PATH
    echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
    echo 'export ANDROID_SDK_ROOT=$HOME/Android/Sdk' >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/tools/bin' >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc

    echo 'export ANDROID_USER_HOME=$HOME/.android' >> ~/.bashrc
    echo 'export ANDROID_EMULATOR_HOME=$HOME/.android' >> ~/.bashrc
    echo 'export ANDROID_AVD_HOME=$HOME/.android/avd' >> ~/.bashrc

    echo "✅ Android Studio has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    echo "Uninstalling Android Studio"
    sudo snap remove android-studio

    sed -E -i '/^export ANDROID_HOME=\$HOME\/Android\/Sdk/d' ~/.bashrc
    sed -E -i '/^export ANDROID_SDK_ROOT=\$HOME\/Android\/Sdk/d' ~/.bashrc
    sed -E -i '/^export PATH=\$PATH:\$ANDROID_HOME\/emulator/d' ~/.bashrc
    sed -E -i '/^export PATH=\$PATH:\$ANDROID_HOME\/tools/d' ~/.bashrc
    sed -E -i '/^export PATH=\$PATH:\$ANDROID_HOME\/tools\/bin/d' ~/.bashrc
    sed -E -i '/^export PATH=\$PATH:\$ANDROID_HOME\/platform-tools/d' ~/.bashrc
    sed -E -i '/^export ANDROID_USER_HOME=\$HOME\/.android/d' ~/.bashrc
    sed -E -i '/^export ANDROID_EMULATOR_HOME=\$HOME\/.android/d' ~/.bashrc
    sed -E -i '/^export ANDROID_AVD_HOME=\$HOME\/.android\/avd/d' ~/.bashrc

    echo "✅ Android Studio has been uninstalled successfully."
fi

exec bash
