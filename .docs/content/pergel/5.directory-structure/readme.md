---
title: README.yaml
description: 'Pergel is a full stack Nuxt application. GraphQL, BullMQ, NodeCron, Redis, SES, S3, and more smart and speed used.'
icon: 'i-ph-file'
---


All configuration files are in the `pergel` directory. Automatically created by the Pergel Nuxt Module. Do not edit it manually.

::callout{color="yellow" icon="i-ph-check-circle-duotone"}
Env names can be quickly copied from here and imported into .env or related locations.
::

::callout{color="yellow" icon="i-ph-check-circle-duotone"}
Pergel CLI can be used to install packages. `pergel install` command. Do it in the directory where the Pergel folder is located.
::

::code-group
```yaml [README.yaml]
pergel:
# This file is generated by pergel. Do not edit it manually.
# Version: 0.0.24
project1:
  graphql:
    # If pergel cli is installed, you can run `pergel install` automatically to install
    packageJson:
      dependencies: '@pergel/graphql@0.0.0'
      devDependencies: ''
project2:
  bullmq:
    env:
      NUXT_PROJECT2_BULLMQ_OPTIONS_HOST:
      NUXT_PROJECT2_BULLMQ_OPTIONS_PORT: 6379
      NUXT_PROJECT2_BULLMQ_OPTIONS_DB: 0
      NUXT_PROJECT2_BULLMQ_OPTIONS_PASSWORD:
      NUXT_PROJECT2_BULLMQ_OPTIONS_USERNAME:
      NUXT_PROJECT2_BULLMQ_URL:
    # If pergel cli is installed, you can run `pergel install` automatically to install
    packageJson:
      dependencies: 'bullmq@^4.14.3, ioredis@^5.3.2, p-timeout@^6.1.2'
      devDependencies: ''
  rabbitmq:
    env:
      NUXT_PROJECT2_RABBITMQ_OPTIONS_USERNAME:
      NUXT_PROJECT2_RABBITMQ_OPTIONS_PASSWORD:
      NUXT_PROJECT2_RABBITMQ_OPTIONS_HOST:
      NUXT_PROJECT2_RABBITMQ_OPTIONS_PORT: 5672
      NUXT_PROJECT2_RABBITMQ_URL:
    # If pergel cli is installed, you can run `pergel install` automatically to install
    packageJson:
      dependencies: amqplib@^0.10.3
      devDependencies: '@types/amqplib@^0.10.4'
  nodeCron:
    # If pergel cli is installed, you can run `pergel install` automatically to install
    packageJson:
      dependencies: node-cron@^3.0.3
      devDependencies: '@types/node-cron@^3.0.11'
  json2Csv:
    # If pergel cli is installed, you can run `pergel install` automatically to install
    packageJson:
      dependencies: '@json2csv/node@^7.0.3'
      devDependencies: ''
  S3:
    env:
      NUXT_PROJECT2S3_REGION: auto
      NUXT_PROJECT2S3_ENDPOINT:
      NUXT_PROJECT2S3_ACCESS_KEY_ID:
      NUXT_PROJECT2S3_SECRET_ACCESS_KEY:
      NUXT_PROJECT2S3_BUCKET:
    # If pergel cli is installed, you can run `pergel install` automatically to install
    packageJson:
      dependencies: '@pergel/module-s3@0.0.0'
      devDependencies: ''
  ses:
    env:
      NUXT_PROJECT2_SES_REGION:
      NUXT_PROJECT2_SES_ACCESS_KEY_ID:
      NUXT_PROJECT2_SES_SECRET_ACCESS_KEY:
    # If pergel cli is installed, you can run `pergel install` automatically to install
    packageJson:
      dependencies: '@aws-sdk/client-ses@^3.454.0'
      devDependencies: ''
```
::