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
| house         | consumption/global | Date              | consommation (number)     | La consommation de la maison|
| house         | consumption/detailed | Date              | consommationByObject ([{name:string,consumption:number}])     | La consommation de chaque objet a l'heure donnée|
| house         | consumption/detailed/{name} | Date  | consommation (number)     | La consommation de l'objet|
| house         | object-editor/add-scheduled | {name:string, consumption:number}  | -    | Ajout un objet programmer par la smart grid|
| house         |object-editor/add-basic | HouseObject  | -    | Ajout d'un objet classique|
|supplier       | get-production   |-                | production (number)      | La production totale |
|supplier       | change-production   | consumption                | new production (number)      | Permet de changer la production |
| consumption-manager | house-consumption | Date & ID (number) | consommation (number) | La consommation de la maison d'un ID donné |
| consumption-manager | community-consumption | Date & ID (number) | consommation (number) | La consommation totale d'une communauté d'un ID donné |
| consumption-manager | total-consumption | Date | consommation (number) | La consommation totale de toutes les maisons |
| consumption-verifier | consumption-peak | Date & ID (number) | booléen (true si il y a un pic, false sinon) | Indique la présence d'un pic à une certaine date et pour une certaine communauté
| consumption-verifier | consumption-check | Date | booléen (true si consommation == production, false sinon) | Indique si la consommation de la grid a la même valeur que la production et sinon adapte la production
| consumption-scheduler | schedule | ID | Liste d'horaires (string[]) | Retourne une liste d'horaires pour une maison donnée
| dataservice | fromregistry/getallhouseurl | _ | Liste des URL (string[]) | Retourne la liste des URL de toutes les maisons
| dataservice | fromregistry/gethouseurl | ID | une URL (string) | Retourne l'URL de la maison d'un ID donné
| dataservice | fromregistry/getcommunityurl | ID | Liste des URL (string[]) | Retourne la liste des URL de toutes les maisons d'une communauté d'un ID donné
| dataservice | fromregistry/'POST' | ID_Community ID_House  URL_House | _ | Ajoute une nouvelle maison 
| registry-manager | subscription/'POST' | IP PORT | ID_House ID_Community  | Inscrit une nouvelle maison et retourne son ID et son ID de communauté

## Port
- 127.0.0.1 house=3000  
- 127.0.0.1 consumption-scheduler=3002  
- 127.0.0.1 registry-manager=3003   
- 127.0.0.1 supplier=3005  
- 127.0.0.1 dataservice=3006  
- 127.0.0.1 consumption-verifier=3007  
- 127.0.0.1 consumption-manager=3008  
