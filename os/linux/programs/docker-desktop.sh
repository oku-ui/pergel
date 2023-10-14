#!/bin/bash

if [ $OPERATION = "install" ]; then
    echo "Installing Docker Desktop"

    sudo apt-get update

    sudo apt-get install -y \
        bridge-utils \
        cpu-checker \
        libvirt-clients \
        libvirt-daemon \
        qemu qemu-kvm \
        virt-manager

    sudo kvm-ok

    sudo apt-get update

    sudo -y apt-get install \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release

    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

    echo "Installing Docker Desktop"
    curl -fsSL -o /tmp/docker-desktop-amd64.deb https://desktop.docker.com/linux/main/amd64/docker-desktop-4.24.0-amd64.deb

    sudo apt-get install -y /tmp/docker-desktop-amd64.deb
    rm -f /tmp/docker-desktop-amd64.deb

    sudo apt-get update

    sudo usermod -aG docker $USER

    echo "✅ Docker Desktop has been installed successfully."
elif [ $OPERATION = "uninstall" ]; then
    sudo apt-get remove bridge-utils
    sudo apt-get remove cpu-checker
    sudo apt-get remove libvirt-clients
    sudo apt-get remove libvirt-daemon
    sudo apt-get remove qemu
    sudo apt-get remove qemu-kvm
    sudo apt-get remove virt-manager

    sudo apt remove docker-desktop
    echo "✅ Docker Desktop has been uninstalled successfully."

    echo "For a complete cleanup, remove configuration and data files at $HOME/.docker/desktop, the symlink at /usr/local/bin/com.docker.cli, and purge the remaining systemd service files."
fi

exec bash
