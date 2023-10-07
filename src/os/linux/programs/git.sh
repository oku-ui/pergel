#!/bin/bash
# Install Git

if command -v git &> /dev/null
then
    echo "Git is already installed"
else
    echo "Installing Git"

    sudo apt update
    sudo apt install git

    exec bash
fi
