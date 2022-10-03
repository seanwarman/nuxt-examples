# Herbie - The CMS for DMRB and beyond...

> A Strapi CMS running on Node with a MariaDB database. It provides some of the content for DMRB Nuxt website

## Dev Requirements

- NodeJS + Yarn
- Docker

## Dev Setup

- Create a .env file and paste the example env file from the env vars sections of this document
- Start a database in docker, eg.
  `docker run -e MYSQL_DATABASE=herbie -e MYSQL_USER=herbie -e MYSQL_PASSWORD=herbie -e MYSQL_RANDOM_ROOT_PASSWORD=yes -p 3307:3306 mariadb`
- `yarn`
- `yarn build`
- `yarn develop`

## Environment Variables

Example env vars for a local development instalation

```
HOST=0.0.0.0
PORT=1337

APP_KEYS=04XCFrD6Qd9sWhX3vE91Lg==,d7uQBOcPAXzd7076d6uqbw==,a2MDSZvxdUJExty0wnHcCw==,GxWzJ4cq21Y7CdhZPXQZmA==
API_TOKEN_SALT=/a8A4uEKdGHgQgWBdzh2+A==
ADMIN_JWT_SECRET=269abf4182180aa2705b8e09bdeaf487
JWT_SECRET=0z+vFvRPPGZmmXwt4u+r1w==

ADMIN_USERNAME=admin
ADMIN_FIRSTNAME=Peter
ADMIN_SURNAME=Stringfella
ADMIN_PASSWORD=password
ADMIN_EMAIL=admin@example.com
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3307
DATABASE_NAME=herbie
DATABASE_USERNAME=herbie
DATABASE_PASSWORD=herbie
```

## Creating a config dump

Some CMS options and field layouts are stored in the database. When you make changes to Strapi's
options you'll likely want to dump these changes and commit them to source ready for deploy
or for the next dev. To make a dump of these settings you need to run;

`yarn config.dump`

## Deploying to server enviroments

As part of of the deployment process (and also for local dev) you'll likely want to
import the latest config options in to your database run;

`yarn config.restore`

This will probably want to be done after every deploy
