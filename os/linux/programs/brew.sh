#!/bin/bash

if [ $OPERATION = "install" ]; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    test -d ~/.linuxbrew && eval "$(~/.linuxbrew/bin/brew shellenv)"
    test -d /home/linuxbrew/.linuxbrew && eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
    echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >>~/.bashrc
    sudo apt-get install build-essential
    brew install gcc
    echo "✅ Brew has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
    echo "✅ Brew has been uninstalled successfully."
fi

exec bash

