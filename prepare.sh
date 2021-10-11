#!/bin/bash
docker-compose build
docker build -t scenario2 ./scenario2/ 
export DOCKER_CLIENT_TIMEOUT=360
export COMPOSE_HTTP_TIMEOUT=360