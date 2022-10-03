#!/usr/bin/env bash
docker run -e MYSQL_DATABASE=herbie -e MYSQL_USER=herbie -e MYSQL_PASSWORD=herbie -e MYSQL_RANDOM_ROOT_PASSWORD=yes -p 3307:3306 mariadb