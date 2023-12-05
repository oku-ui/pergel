---
title: Beekeeper Studio
description: Beekeeper Studio is an open source SQL editor and database management app that is both powerful and easy to use.
componentName: OkuAccordion
image: 'https://oku-ui.com/og/oku-accordion.png'
links:
  - label: Beekeeper Studio
    icon: i-ph-link
    to: https://www.beekeeperstudio.io/
---


# What is Beekeeper Studio?

Beekeeper Studio is an open source SQL editor and database management app that is both powerful and easy to use. It works with PostgreSQL, MySQL, SQLite, SQL Server, Redis & more.


## Requirements

Docker and a supported database server (PostgreSQL, MySQL, SQLite, SQL Server, Redis & more).

> If you already installed `docker-studio` with [Pergel](/pergel/getting-started), you don't need to install extra docker. Just install the docker database image you want to use with beekeeper.


## Install Beekeeper Studio

You can install the Beekeeper Studio program with [Pergel](/pergel/getting-started).

## Start the Application

First, you should run this database image (MySQL, PostgreSQL, etc.) using [Docker Desktop](/pergel/os/programs/docker-desktop) or Docker CLI before connecting to the database system of your choice.

1. To launch Beekeeper Studio, locate it in the menu or application launcher and click on it.
2. Once the application is launched, you can use it to manage your database connections and execute SQL queries.

### Run a Database Image with Docker CLI

#### Run the following command to run the `MySQL` database image:

```sh [terminal]
docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:latest
```

#### Run the following command to run the `PostgreSQL` database image:

```sh [terminal]
docker run --name postgres -e POSTGRES_PASSWORD=postgres -d postgres:latest
```

## Create a Database Connection

1. To create a new database connection, click on the 'New Connection' button located in the top left corner of the window.
2. Select the database type (for example, MySQL, PostgreSQL, SQLite, etc.). If you don't know which database type to select, you can use the 'Auto Detect' option.
3. In the 'New Connection' window, enter the connection details for your database and click on the 'Save' button.
4. Once the connection is saved, you can use it to execute SQL queries and manage your database.

## Example Database Connections

#### MySQL

- Host: localhost
- Port: 3306
- Username: root
- Password: root

#### PostgreSQL

- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres


## Example SQL Queries

Open the SQL editor and execute the following SQL queries.

#### Create a Table

::code-group

```sh [terminal]
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
```
::

#### Insert Data

::code-group

```sh [terminal]
INSERT INTO users (name, email)
VALUES ('John Doe', 'test@test.com');
```
::

#### Select Data

::code-group

```sh [terminal]
SELECT * FROM users;
```
::

#### Update Data

::code-group

```sh [terminal]
UPDATE users SET name = 'Jane Doe' WHERE id = 1;
```
::

#### Delete Data

::code-group

```sh [terminal]
DELETE FROM users WHERE id = 1;
```
::



