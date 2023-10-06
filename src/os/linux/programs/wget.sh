#!/bin/bash

# Function to compare two version numbers
version_compare() {
    local version1=$1
    local version2=$2
    if dpkg --compare-versions "$version1" gt "$version2"; then
        echo "1"
    else
        echo "0"
    fi
}

# Check if Wget is already installed
if command -v wget &>/dev/null; then
  installed_version=$(wget --version | awk 'NR==1{print $3}')
  echo "Wget is already installed (Version $installed_version)."
else
  echo "Wget is not installed, starting the installation..."
  
  # Use the appropriate package manager to install Wget
  if command -v apt-get &>/dev/null; then
    sudo apt-get update
    sudo apt-get install wget -y
  elif command -v yum &>/dev/null; then
    sudo yum install wget -y
  elif command -v dnf &>/dev/null; then
    sudo dnf install wget -y
  else
    echo "Unsupported package manager, please install Wget manually."
    exit 1
  fi
  
  # Display a message if the installation was successful
  if [ $? -eq 0 ]; then
    installed_version=$(wget --version | awk 'NR==1{print $3}')
    echo "Wget has been installed successfully (Version $installed_version)."
  else
    echo "An error occurred while installing Wget."
    exit 1
  fi
fi

# Get the latest version of Wget
latest_version=$(wget -qO- https://ftp.gnu.org/gnu/wget/ | grep -oE 'wget-[0-9]+\.[0-9]+\.[0-9]+' | sort -V | tail -n 1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')

# Check if Wget is outdated
if [ "$(version_compare "$installed_version" "$latest_version")" -eq "1" ]; then
  echo "Wget is outdated (Installed Version: $installed_version, Latest Version: $latest_version)."
  
  # Ask the user if they want to update Wget
  read -p "Do you want to update Wget? (yes/no): " update_choice
  if [ "$update_choice" == "yes" ]; then
    # Use the appropriate package manager to update Wget
    if command -v apt-get &>/dev/null; then
      sudo apt-get update
      sudo apt-get install wget -y
    elif command -v yum &>/dev/null; then
      sudo yum install wget -y
    elif command -v dnf &>/dev/null; then
      sudo dnf install wget -y
    else
      echo "Unsupported package manager, please update Wget manually."
    fi
    
    # Display a message if the update was successful
    if [ $? -eq 0 ]; then
      updated_version=$(wget --version | awk 'NR==1{print $3}')
      echo "Wget has been updated to Version $updated_version."
    else
      echo "An error occurred while updating Wget."
    fi
  else
    echo "Wget will not be updated."
  fi
else
  echo "Wget is up to date (Version $installed_version)."
fi
