#!/bin/bash
docker-compose up --force-recreate -d
docker start house1
docker start house2
docker start house3
docker start house4
docker start house5

