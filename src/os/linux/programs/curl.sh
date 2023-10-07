#!/bin/bash

# Install curl

if command -v curl &> /dev/null
then
    echo "Curl is already installed"
else
    echo "Installing Curl"

    sudo apt update
    sudo apt install curl
    
    exec bash
fi