#!/bin/bash

if [ $OPERATION = "install" ]; then
    echo "Installing Beekeeper Studio"

    wget --quiet -O - https://deb.beekeeperstudio.io/beekeeper.key | sudo apt-key add -

    echo "deb https://deb.beekeeperstudio.io stable main" | sudo tee /etc/apt/sources.list.d/beekeeper-studio-app.list

    sudo apt update
    sudo apt install beekeeper-studio

    echo "Beekeeper Studio has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    echo "Uninstalling Beekeeper Studio"
    sudo apt remove -y beekeeper-studio
    echo "✅ Beekeeper Studio has been uninstalled successfully."
fi

exec bash

