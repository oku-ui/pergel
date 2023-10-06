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

# Check if Curl is already installed
if command -v curl &>/dev/null; then
  installed_version=$(curl --version | awk 'NR==1{print $2}')
  echo "Curl is already installed (Version $installed_version)."
else
  echo "Curl is not installed, starting the installation..."
  
  # Use the appropriate package manager to install Curl
  if command -v apt-get &>/dev/null; then
    sudo apt-get update
    sudo apt-get install curl -y
  elif command -v yum &>/dev/null; then
    sudo yum install curl -y
  elif command -v dnf &>/dev/null; then
    sudo dnf install curl -y
  else
    echo "Unsupported package manager, please install Curl manually."
    exit 1
  fi
  
  # Display a message if the installation was successful
  if [ $? -eq 0 ]; then
    installed_version=$(curl --version | awk 'NR==1{print $2}')
    echo "Curl has been installed successfully (Version $installed_version)."
  else
    echo "An error occurred while installing Curl."
    exit 1
  fi
fi

# Get the latest version of Curl
latest_version=$(curl -sI https://curl.se/download/ | grep -i "location" | awk -F'/' '{print $NF}' | tr -d '\r')

# Check if Curl is outdated
if [ "$(version_compare "$installed_version" "$latest_version")" -eq "1" ]; then
  echo "Curl is outdated (Installed Version: $installed_version, Latest Version: $latest_version)."
  
  # Ask the user if they want to update Curl
  read -p "Do you want to update Curl? (yes/no): " update_choice
  if [ "$update_choice" == "yes" ]; then
    # Use the appropriate package manager to update Curl
    if command -v apt-get &>/dev/null; then
      sudo apt-get update
      sudo apt-get install curl -y
    elif command -v yum &>/dev/null; then
      sudo yum install curl -y
    elif command -v dnf &>/dev/null; then
      sudo dnf install curl -y
    else
      echo "Unsupported package manager, please update Curl manually."
    fi
    
    # Display a message if the update was successful
    if [ $? -eq 0 ]; then
      updated_version=$(curl --version | awk 'NR==1{print $2}')
      echo "Curl has been updated to Version $updated_version."
    else
      echo "An error occurred while updating Curl."
    fi
  else
    echo "Curl will not be updated."
  fi
else
  echo "Curl is up to date (Version $installed_version)."
fi
