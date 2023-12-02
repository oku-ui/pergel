---
title: Git
description: Git is a command-line tool for managing version control using a distributed system.
componentName: OkuAccordion
image: 'https://oku-ui.com/og/oku-accordion.png'
links:
  - label: Git
    icon: i-ph-link
    to: https://git-scm.com/
---


## What is Git?

`Git` is a distributed version control system that facilitates collaborative software development by allowing multiple users to track changes to source code. Git is a command-line tool and also provides a library for managing and versioning code repositories. Git is known for its versatility and is widely used across different operating systems.

Using Git, you can create and manage code repositories, track changes, collaborate with others, and synchronize your work with remote repositories. It supports a variety of remote protocols, such as HTTP, HTTPS, SSH, and Git itself, making it suitable for both individual developers and large teams.

To use Git, you can enter commands with the following syntax in the command line:

::code-group

```sh [terminal]
git [options] [command] [arguments]
```

::

# Examples

Here are some example usages:

### Clone a Repository:

::code-group

```sh [terminal]
git clone https://github.com/username/repository.git
```
::

This command clones a remote Git repository onto your local machine.

### Create a new Git repository:

::code-group

```sh [terminal]
git init new-project
cd new-project
```
::

### Modify and commit files:

::code-group

```sh [terminal]
git add .
git commit -m "First commit"
```
::

### Push local changes to remote repository:

::code-group

```sh [terminal]
git push origin main-branch
```
::

### Update an existing Git repository:

::code-group

```sh [terminal]
git pull origin main-branch
```
::