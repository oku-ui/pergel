---
title: Snap
description: Snap is a software deployment and package management system. 
componentName: OkuAccordion
image: 'https://oku-ui.com/og/oku-accordion.png'
links:
  - label: Snap
    icon: i-ph-link
    to: https://snapcraft.io/
---

# What is Snap?

Snap is a software deployment and package management system. It was originally designed for the Ubuntu Phone operating system. The packages, called snaps, and the tool for using them, snapd, work across a range of Linux distributions and allow upstream software developers to distribute their applications directly to users. Snaps are self-contained applications running in a sandbox with mediated access to the host system. This allows them to work similarly across different Linux distributions. 

Snap is supported on Ubuntu, Debian, Fedora, Arch Linux, Manjaro, OpenSUSE, Solus, Linux Mint, Zorin OS, KDE Neon, Pop!_OS, elementary OS and other Linux distributions. 

Snaps are also supported on embedded versions of Linux, such as those used on smart TVs and IoT devices. Snaps are discoverable and installable from the Snap Store, an app store with an audience of millions. Snaps also integrate with many Linux desktops, enabling automatic updates and transactional, system-wide rollbacks. Snaps are available for any Linux user, regardless of package format or software distribution.

## Install Snap

You can install the Snap program with [Pergel](/pergel/getting-started).

To make sure that Snap is installed correctly, run the following command: `snap --version`

## Install Snap Packages

You can install Snap packages with the following command: `sudo snap install <package-name>`

Install Discord with the following command:

```sh [terminal]
sudo snap install discord
```

## Remove Snap Packages

You can remove Snap packages with the following command: `sudo snap remove <package-name>`

Remove Discord with the following command:

```sh [terminal]
sudo snap remove discord
```

## Update Snap Packages

You can update Snap packages with the following command: `sudo snap refresh <package-name>`

Update Discord with the following command:

```sh [terminal]
sudo snap refresh discord
```

## List Snap Packages

You can list Snap packages with the following command: `snap list`

## Search Snap Packages

You can search Snap packages with the following command: `snap find <package-name>`

## List Snap Services

You can list Snap services with the following command: `snap services`

## List Snap Changes

You can list Snap changes with the following command: `snap changes`

## List Snap Aliases

You can list Snap aliases with the following command: `snap aliases`

## Snap Info for a Package

You can list Snap info with the following command: `snap info <package-name>`

```sh [terminal]
snap info discord
```

## For All Snap Commands

You can list all Snap commands with the following command: `snap help`

## Snap Documentation

You can find more information about Snap on the [Snap Documentation](https://snapcraft.io/docs){:target="_blank"} page.

