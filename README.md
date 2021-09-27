# smartrix-21-22-soa-21-22-i

## Docker

- build project: `docker-compose build --pull`
- start project: `docker-compose up`
- start project in background: `docker-compose up -d`
- Enter in bash: `docker-compose exec name-of-service sh` (replace name-of-service ex : `docker-compose exec house sh`)
- build only one service: `docker-compose build name-of-service`
- log of service: `docker-compose logs -f --tail=1000 name-of-service`

## Utils
- Create new nestJS project with cli: `nest new project-name`
- Install dependency:  `npm install`
- Run script in package.json: `npm run script-name`
- Generate controller: `nest g controller path/name`
- Generate service: `nest g service path/name`

## Route

| Service       | Chemin      | Body            | Return     |Description            |
| :-------------|:--------    | :-----          |:--------   |:----------------------|
| house         | consumption | Date              | consommation (number)     | La consommation de la maison|
| house-object  | consumption | Date            |{ objectName : string, consumption : number } | La consommation de l'objet de la maison   |
|supplier       | production   |-                | production (number)      | La production totale |
| consumption-manager | house-consumption | ID (number) | consommation (number) | La consommation de la maison d'un ID donné |
| consumption-manager | community-consumption | ID (number) | consommation (number) | La consommation totale d'une communauté d'un ID donné |
| consumption-manager | total-consumption | - | consommation (number) | La consommation totale de toutes les maisons |
| consumption-verifier | consumption-peak | Date & ID (number) | booléen (true si il y a un pic, false sinon) | Indique la présence d'un pic à une certaine date et pour un certain groupe de maison
| consumption-verifier | consumption-check | Date | booléen (true si consommation == production, false sinon) | Indique si la consommation de la grid a la même valeur que la production
