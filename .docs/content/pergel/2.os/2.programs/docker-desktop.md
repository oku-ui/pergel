---
title: Docker Desktop
description: Docker Desktop is an easy-to-install application for your Mac, Linux or Windows environment that enables you to start coding and containerizing in minutes.
componentName: OkuAccordion
image: 'https://oku-ui.com/og/oku-accordion.png'
links:
  - label: Docker Desktop
    icon: i-ph-link
    to: https://www.docker.com/products/docker-desktop
---

# What is Docker Desktop?

Docker Desktop is an easy-to-install application for your Mac, Linux or Windows environment that enables you to start coding and containerizing in minutes.

When you install Docker Desktop, it comes in a Docker kernel including the version of Docker. You can therefore see the Docker version by running `docker --version`. Docker Desktop provides a graphical interface for managing and using Docker and uses the Docker kernel underneath.

So, when you install Docker Desktop on Ubuntu, there is no need to install Docker separately, because Docker Desktop already includes Docker and provides everything needed to use it. Therefore, if the `docker --version` command works, Docker has already been successfully installed. Docker Desktop allows you to start and stop Docker, create and manage containers.

## Install

You can install the Docker Desktop program with [Pergel](/pergel/getting-started).

## Start the Application

- To launch Docker Desktop, locate it in the menu or application launcher and click on it.
- Once the application is launched, you can use it to manage your Docker containers.

## Explore Docker Desktop

The Docker Desktop application consists of three main sections: 'Containers', 'Images', and 'Volumes'.

`Containers` are the running instances of Docker images. 

`Images` are the templates used to create containers. 

`Volumes` are the storage locations used by containers.

Images and volumes can be created, removed, and managed using the Docker Desktop application. Containers can be created, started, stopped, and removed using the Docker Desktop application.

You can use Docker with the Docker Desktop app without the need for Docker commands. The Docker Desktop app includes everything you need to use Docker. Therefore, you do not need to install Docker separately to use Docker using the Docker Desktop app.

If you still want to use Docker with the CLI, you may need some Docker commands.

## Example Docker Commands

### Run the following command to list all running containers:

```sh [terminal]
docker ps
```

### Run the following command to list all containers:

```sh [terminal]
docker ps -a
```

### Run the following command to list all images:

```sh [terminal]
docker images
```

### Run the following command to run the `hello-world` image:

```sh [terminal]
docker run hello-world
```

### Run the following command to run the `nginx` image:

```sh [terminal]
docker run -d -p 80:80 nginx
```

### Run the following command to run the `mysql` image:

```sh [terminal]
docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:latest
```

[Some Docker commands](https://docs.docker.com/engine/reference/commandline/cli/){:target="_blank"} can be used to manage Docker containers and images.













