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

# Check if Git is already installed
if command -v git &>/dev/null; then
  installed_version=$(git --version | awk '{print $3}')
  echo "Git is already installed (Version $installed_version)."
else
  echo "Git is not installed, starting the installation..."
  
  # Use the appropriate package manager to install Git
  if command -v apt-get &>/dev/null; then
    sudo apt-get update
    sudo apt-get install git -y
  elif command -v yum &>/dev/null; then
    sudo yum install git -y
  elif command -v dnf &>/dev/null; then
    sudo dnf install git -y
  else
    echo "Unsupported package manager, please install Git manually."
    exit 1
  fi
  
  # Display a message if the installation was successful
  if [ $? -eq 0 ]; then
    installed_version=$(git --version | awk '{print $3}')
    echo "Git has been installed successfully (Version $installed_version)."
  else
    echo "An error occurred while installing Git."
    exit 1
  fi
fi

# Get the latest version of Git
latest_version=$(git ls-remote --tags --refs https://github.com/git/git.git | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | sort -V | tail -n 1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')

# Check if Git is outdated
if [ "$(version_compare "$installed_version" "$latest_version")" -eq "1" ]; then
  echo "Git is outdated (Installed Version: $installed_version, Latest Version: $latest_version)."
  
  # Ask the user if they want to update Git
  read -p "Do you want to update Git? (yes/no): " update_choice
  if [ "$update_choice" == "yes" ]; then
    # Use the appropriate package manager to update Git
    if command -v apt-get &>/dev/null; then
      sudo apt-get update
      sudo apt-get install git -y
    elif command -v yum &>/dev/null; then
      sudo yum install git -y
    elif command -v dnf &>/dev/null; then
      sudo dnf install git -y
    else
      echo "Unsupported package manager, please update Git manually."
    fi
    
    # Display a message if the update was successful
    if [ $? -eq 0 ]; then
      updated_version=$(git --version | awk '{print $3}')
      echo "Git has been updated to Version $updated_version."
    else
      echo "An error occurred while updating Git."
    fi
  else
    echo "Git will not be updated."
  fi
else
  echo "Git is up to date (Version $installed_version)."
fi
