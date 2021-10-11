#!/bin/bash
docker-compose build
docker build -t scenario2 ./scenario2/ 
