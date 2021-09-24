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
| house         | consumption | -               | number     | La consomation de la maison|
| house-object  | consumption | Date            |{ objectName : string, consumption : number } | La consomation de la maison   |
|power-grid     |total-consumption|-            |number      | Consomation total du reseau |
|supplier       |production   |-                |number      | La production total |
| Clock         | clock/tick  |-                |  Date      | La date courrant dans la simultion a chaque tick |