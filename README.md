# smartrix-21-22-soa-21-22-i

Le PDF de rendu du 03/10/2021 est dans [/DOC/Rendu intermédiaire - Equipe I.pdf](https://github.com/pns-si5-soa/smartrix-21-22-soa-21-22-i/blob/dev/DOC/Rendu%20interm%C3%A9diaire%20-%20Equipe%20I.pdf)

Le ReadMe de rendu du 03/10/2021 est dans [/DOC/README_RenduIntermédiaire.md](https://github.com/pns-si5-soa/smartrix-21-22-soa-21-22-i/blob/dev/DOC/README_RenduIntermédiaire.md)  

# Résultats attendus lors du prepare.sh

*Attention : des erreurs peuvent apparaître lors de la première exécution de prepare.sh, cela est dû à la tentative de suppression des images docker des maisons.* 

# Résultats attendus lors du run.sh
## Résultats attendus avant l’exécution des scénarios
Avant l’exécution des scénarios, les containers de tous nos services (sauf house créé lors du prepare.sh) sont lancés grâce au docker-compose, puis on crée le container permettant de lancer les scénarios. 
Les containers de nos services sont re-créés entre chaque scénario.

*Attention : une erreur peut arriver “Error: No such container: scenario2”. Cela est dû à la tentative de suppression de scenario 2 s’il existe encore.*

## Scénarios
**Scénario 1 : inscription, object paramétrable et adaptation de la production avec la consommation**

1 - Une maison s’inscrit à la smartgrid  
2 - La maison reçoit un id  
3 - Le client peut voir sa consommation  
4 - Un producteur s’inscrit à la smartgrid  
5 - Le producteur reçoit un id  
6 - On vérifie que la consommation est égale à la production  
7 - Un object paramètrable est branché  
8 - On demande un planning de consommation  
9 - On peut voir que l’objet consomme à l‘heure donnée depuis smartGrid
10 - On peut voir que la production n’est plus égale à la consommation, on demande aux producteurs de s’adapter 
11 - On vérifie que la production s’est bien adaptée  

**Scénario 2 : Gestion de la consommation et pic de consommation dans une communauté**  

1 - Plusieurs maisons dans une communautés et d'autres maisons dans d'autres communautés  
2 - Plein d’objets planifiables et non planifiables dans les maisons de la communauté  
3 - On regarde la consommation totale de toutes les maisons  
4 - On regarde la consommation dans la communauté  
5 - On détecte un pic de consommation dans cette communautée  
6 - On demande au object panifiable d'arrêter de charger  
7 - On remarque qu’il n’y a plus de pic   

**Scénario 3 : Achat de la production supplémentaire d'une maison**

1 - Une maison consommant de l'électricité  
2 - Ajout d’un objet produisant de l'électricité  
3 - On peut voir au niveau de la maison que de l'électricité est produite mais pas en excès  
4 - On remarque que la consommation de la maison au niveau de SmartGrid est réduite  
5 - On peut voir niveau producteur que l'on n'accède pas à cette électricité  
6 - On ajoute un deuxième objet producteur dans la maison  
7 - La production est en excès  
8 - On peut y accèder côté producteur  
9 - On remarque que la consommation de la maison au niveau de SmartGrid est nulle  


*PS: Quand une maison est lancée lors d’un scénario, on fait un sleep() de 10 secondes pour être sûr que celle-ci soit bien inscrite lors de la prochaine étape.*

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

## Port
- 127.0.0.1 house=3000  
- 127.0.0.1 production-db=3001
- 127.0.0.1 consumption-scheduler=3002  
- 127.0.0.1 registry-manager=3003   
- 127.0.0.1 client-database=3004  
- 127.0.0.1 producers=3005  
- 127.0.0.1 production-provider=3006 
- 127.0.0.1 consumption-verifier=3007  
- 127.0.0.1 consumption-detailed=3008  
- 127.0.0.1 global-consumption-database=3009 
- 127.0.0.1 producer-database=3010 
- 127.0.0.1 consumption-provider=3012