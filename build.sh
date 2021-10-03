#!/bin/bash
docker-compose build
docker build -t house ./house/ 

docker stop house1 || true && docker rm house1 || true
docker create --network=si5-soa --rm --name house1 --network-alias=house1 -p 4001:3000 --env IP="house1" house
docker stop house2 || true && docker rm house2 || true
docker create --network=si5-soa --rm --name house2 --network-alias=house2 -p 4002:3000 --env IP="house2" house
docker stop house3 || true && docker rm house3 || true
docker create --network=si5-soa --rm --name house3 --network-alias=house3 -p 4003:3000 --env IP="house3" house
docker stop house4 || true && docker rm house4 || true
docker create --network=si5-soa --rm --name house4 --network-alias=house4 -p 4004:3000 --env IP="house4" house
docker stop house5 || true && docker rm house5 || true
docker create --network=si5-soa --rm --name house5 --network-alias=house5 -p 4005:3000 --env IP="house5" house