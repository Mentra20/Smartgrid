#!/bin/bash
COMPOSE_HTTP_TIMEOUT=360 docker-compose up --force-recreate -d
docker rm scenario2 || true

docker run -td --network=si5-soa --name scenario2 scenario2

#scenario before/after subscribe
echo "=========================================================================================="
echo "---------------------------- Scenario1 ----------------------------"

docker exec scenario2 sh -c 'node ./scenarioN1.js'
docker-compose exec -T database bash -c 'psql -u$POSTGRES_PASSWORD -p$POSTGRES_PASSWORD $POSTGRES_DB' < ./scriptSQL/resetDB.sql
docker-compose restart 
docker exec scenario2 sh -c 'node ./scenarioN2.js'
docker-compose exec -T database bash -c 'psql -u$POSTGRES_PASSWORD -p$POSTGRES_PASSWORD $POSTGRES_DB' < ./scriptSQL/resetDB.sql
docker-compose restart 
docker exec scenario2 sh -c 'node ./scenarioN3.js'
docker-compose exec -T database bash -c 'psql -u$POSTGRES_PASSWORD -p$POSTGRES_PASSWORD $POSTGRES_DB' < ./scriptSQL/resetDB.sql


docker-compose stop
docker stop scenario2



