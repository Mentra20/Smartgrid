#!/bin/bash
docker-compose up --force-recreate -d
docker rm scenario2 || true

docker run -td --network=si5-soa --name scenario2 scenario2

#scenario before/after subscribe
# echo "=========================================================================================="
# echo "---------------------------- Scenario : Ajout d'une maison ----------------------------"
# docker start house1
# sleep 10
# docker exec scenario2 sh -c 'IP=house2:3000 node ./scenarioSubscription_beforeSubscribe.js'
# docker start house2
# sleep 10
# docker exec scenario2 sh -c 'IP=house2:3000 node ./scenarioSubscription_afterSubscribe.js'
# docker stop house1
# docker stop house2

# #scenario adapt consumption
# echo "=========================================================================================="
# echo "---------------------------- Scenario : Adaptation production ----------------------------"
# docker-compose up --force-recreate -d
# docker start house1
# sleep 10
# docker exec scenario2 sh -c 'IP_PORT=house1:3000 node ./scenarioAdaptConsumption.js'
# docker stop house1

#scenario consumption schedule
echo "=========================================================================================="
echo "---------------------------- Scenario : Adaptation production ----------------------------"
docker-compose up --force-recreate -d
docker start house1
docker start house2
docker start house3
docker start house4
sleep 20
docker exec scenario2 sh -c 'IP_PORT=house3:3000 node ./scenarioConsumptionSchedule.js'
# docker stop house1
# docker stop house2
# docker stop house3
# docker stop house4

# docker-compose stop
# docker stop scenario2





