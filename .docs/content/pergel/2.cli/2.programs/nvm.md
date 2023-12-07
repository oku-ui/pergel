---
title: Nvm
description: Nvm is a version manager for node.js, designed to be installed per-user, and invoked per-shell.
componentName: OkuAccordion
image: 'https://oku-ui.com/og/oku-accordion.png'
links:
  - label: Nvm
    icon: i-ph-link
    to: https://github.com/nvm-sh/nvm
---

# What is Nvm?

Nvm is a version manager for node.js, designed to be installed per-user, and invoked per-shell.

Nvm works on any POSIX-compliant shell (sh, dash, ksh, zsh, bash), in particular on these platforms: unix, macOS, and windows WSL. It supports running on Linux, macOS, WSL, and windows.


## Install Nvm

You can install the Nvm program with [Pergel](/pergel/getting-started).

To make sure that Nvm is installed correctly, run the following command: `nvm --version`

## Nvm Commands

::code-group
```sh [terminal]
nvm install <version>​             # install a version
nvm install --lts                 # install the latest LTS version
nvm install --lts=<LTS name>      # install a specific LTS version
nvm install <version> --reinstall-packages-from=<version>   # reinstall packages from a version
nvm uninstall <version>           # uninstall a version
nvm use <version>                 # use a version
nvm run <version> <program>       # run a program in a version
nvm exec <version> <program>      # execute a program in a version
nvm which <version> <program>     # locate a program
nvm ls                            # list installed versions
nvm ls <version>                  # list versions matching a given description
nvm ls-remote                     # list remote versions available for install
nvm current                       # display currently activated version
nvm alias <name> <version>        # set an alias named <name> pointing to <version>
nvm unalias <name>                # unset an alias
nvm reinstall-packages <version>  # reinstall global npm packages contained in <version> to current version
nvm unload                        # unload nvm from shell
nvm deactivate                    # undo effects of `nvm` on current shell
nvm debug <version>               # enter node-inspect debugger, working on either node or chromium
nvm profile <version>             # display path to installed node executable used in `nvm use`, and PATH that `nvm use` modifies
nvm help                          # show the help screen
nvm --version                     # print out the latest released version of nvm
```
::


## Example

Specify the version of node.js to install.

::code-group
```sh [terminal]
nvm install 14.17.0
nvm use 14.17.0
```
::

