#!/bin/bash

OPERATION=$1
if [ $OPERATION = "install" ]; then
    echo "Installing Starship"
    sudo curl -sS https://starship.rs/install.sh | sh
    sed -i '$aeval "\$\(starship init bash\)"' ~/.bashrc
    echo "✅ Starship has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    echo "Uninstalling Starship"

    # Locate and delete the starship binary
    sudo sh -c 'rm "$(command -v 'starship')"'
    sed -E -i '/^eval "\$\(starship init bash\)"/d' ~/.bashrc
    echo "✅ Starship has been uninstalled successfully."
fi

exec bash
