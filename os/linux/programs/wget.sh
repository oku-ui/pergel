#!/bin/bash

if command -v wget &> /dev/null
then
    echo "Wget is already installed"
else
    echo "Installing Wget"

    sudo apt update
    sudo apt install wget

    exec bash
fi