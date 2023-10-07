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

  # shellcheck disable=SC1090
	source ~/.profile

  # Verify the installation and default version
  echo "Default Node.js version: $(node --version)"
  echo "Default npm version: $(npm --version)"

  echo "nvm has been installed successfully."

  # Install the latest version of Pergel
  echo "Installing the latest version of Pergel..."
  npm install -g pergel
  npm list -g pergel

else
  echo "An error occurred while installing nvm."
  exit 1
fi

