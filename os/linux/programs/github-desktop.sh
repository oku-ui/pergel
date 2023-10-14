#!/bin/bash

if [ $OPERATION = "install" ]; then
    echo "Installing Github Desktop"

    release_url="https://api.github.com/repos/shiftkey/desktop/releases/latest"

    # Get file name
    file_name="$(curl -sL $release_url | jq -r '.assets[] | select(.name | contains("amd64") and endswith(".deb")) | .name')"
    echo version found to install: $file_name

    sudo wget $(wget -q -O - $release_url | jq -r '.assets[] | select(.name | contains("amd64") and endswith(".deb")) | .browser_download_url')
    sudo gdebi "$file_name"
    sudo rm ./$file_name
    echo "✅ Github Desktop has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    echo "Uninstalling Github Desktop"
    sudo apt-get remove github-desktop
    echo "✅ Github Desktop has been uninstalled successfully."
fi

exec bash