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

  # Check if the installation was successful
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

    # Check if the update was successful
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

# Check if nvm is not installed
if ! command -v nvm &>/dev/null; then
  echo "nvm is not installed, starting the installation..."
  wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

  # Check if the installation was successful
  if [ $? -eq 0 ]; then
    # Load nvm into the current shell session
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    # Install the latest LTS version of Node.js using nvm
    echo "Installing the latest LTS version of Node.js..."
    nvm install --lts

    # Set the LTS version as the default
    nvm alias default $(nvm ls --lts | tail -n 1)

    # Verify the installation and default version
    echo "Default Node.js version: $(node --version)"
    echo "Default npm version: $(npm --version)"

    echo "nvm has been installed successfully."
  else
    echo "An error occurred while installing nvm."
    exit 1
  fi
fi


# Check if Node.js is installed
if ! command -v node &>/dev/null; then
  echo "Node.js is not installed."
  nvm install --lts
  nvm alias default $(nvm ls --lts | tail -n 1)
  echo "Default Node.js version: $(node --version)"
  echo "Default npm version: $(npm --version)"

else
  echo "Node.js is already installed."
fi

# Check if npm is installed
if ! command -v node &>/dev/null; then
  echo "npm is not installed."

  # Install the latest version of Pergel
  echo "Installing the latest version of Pergel..."
  npm install -g pergel
  npm list -g pergel

  # Check if the installation was successful
  if [ $? -eq 0 ]; then
    echo "npm has been installed successfully."
  else
    echo "An error occurred while installing npm."
    exit 1
  fi
else
  echo "npm is already installed."
fi
