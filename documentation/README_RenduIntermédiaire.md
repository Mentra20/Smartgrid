# smartrix-21-22-soa-21-22-i

Le PDF de rendu du 03/10/2021 est dans [/DOC/Rendu intermédiaire - Equipe I.pdf](https://github.com/pns-si5-soa/smartrix-21-22-soa-21-22-i/blob/dev/DOC/Rendu%20interm%C3%A9diaire%20-%20Equipe%20I.pdf)

# Résultats attendus lors du prepare.sh
Lors du prepare.sh, toutes les images de nos services sont construites grâce à notre docker-compose, puis 5 containers de maisons (notre service House) sont créés.

*Attention : des erreurs peuvent apparaître lors de la première exécution de prepare.sh, cela est dû à la tentative de suppression des images docker des maisons.* 

# Résultats attendus lors du run.sh
## Résultats attendus avant l’exécution des scénarios
Avant l’exécution des scénarios, les containers de tous nos services (sauf house créé lors du prepare.sh) sont lancés grâce au docker-compose, puis on crée le container permettant de lancer les scénarios. 
Les containers de nos services sont re-créés entre chaque scénario.

*Attention : une erreur peut arriver “Error: No such container: scenario2”. Cela est dû à la tentative de suppression de scenario 2 s’il existe encore.*

## Résultats attendus lors de l’exécution des scénarios
Lorsque notre projet est lancé, quatre scénarios s’exécutent : scenarioAdaptConsumption, scenarioConsumptionPeak, scenarioConsumptionSchedule et scenarioSubscription, découpé en deux parties afterSubscribe et beforeSubscribe. Pour chacun, nous allons présenter ce qui est attendu lors de son exécution.

*PS: Quand une maison est lancée lors d’un scénario, on fait un sleep() de 10 secondes pour être sûr que celle-ci soit bien inscrite lors de la prochaine étape.*

**Les logs attendus dans la console sont écrits en gras.**

## Ajout d’une maison (scenarioSubscription_afterSubscription et scenarioSubscription_beforeSubscription)

Nous vérifions d’abord que la maison que nous souhaitons inscrire n’est pas déjà dans la base de données :  
**A ce moment là ma maison avec l'ip: house2:3000 n'est pas inscrite :**  
**Maisons inscrites: ["http://house1:3000/"]**

Nous faisons une demande d’inscription et vérifions qu’une maison a bien été ajoutée dans la liste des maisons inscrites :  
**Ma maison est maintenant inscrite :**    
**Maisons inscrites: ["http://house1:3000/%22,%22http://house2:3000"]**

On affiche l’ID de maison et de communauté qui lui ont été attribués par la base de données :  
**On constate que SmartGrid lui a attribué un ID et un ID de communauté :**  
**HouseID reçu depuis la maison: 1  
CommunityID reçu de la maison: 1  
HouseID reçu depuis dataservice 1 : http://house2:3000/  
CommunityID reçu depuis dataservice 1 : ["http://house2:3000/"]**

Et nous consultons finalement sa consommation pour prouver qu’elle est bien affiliée à Smartrix Grid :  
**Je peux maintenant consulter sa consommation en interne :**  
**Consommation de la maison a la date 2021-10-02T03:00 est : 200**
## Adaptation production (scenarioAdaptConsumption)

Dans le but de comparer la production et la consommation totale, on demande leur consommation à toutes les maisons en faisant la requête GET /total-consumption au consumption-manager :   
**On monitore la consommation totale de la grille :**  
**La consommation totale a la date2021-10-02T02:00 est : 200**

Puis on récupère la production en faisant une requête GET au supplier :  
**On compare la production et la consommation :**  
**La production est : 200**

Puis on compare les deux :  
**La production est-elle égale à la consommation le 2021-10-02T02:00 ? : true**

On ajoute un objet sur une maison pour augmenter la consommation avec un POST puis on refait un GET /total-consumption sur le consumption-manager :  
**Un objet est branché, la consommation augmente :**  
**La consommation totale a la date2021-10-02T03:00 est : 700**

On compare à nouveau la consommation et la production qu’on a récupéré précédemment :  
**On compare de nouveau la production et la consommation :**  
**La production est-elle égale à la consommation le 2021-10-02T03:00 ? : false**

On redemande la production et on remarque qu’elle s’est adaptée  
**On constate que la production s'est adaptée :**  
**La production est : 700**
## Planning de consommation (scenarioConsumptionSchedule)

Dans le but de créer un planning, on regarde d’abord la consommation d’une maison et quels objets elle contient en son sein :
**On regarde la consommation actuelle de la maison en interne :**  
**La consommation de la maison d'ID 2 le 2021-10-02T02:00 est : 200**

**On regarde les équipements de la maison:**  
**Les équipement de la maison d'ID 2 le 2021-10-02T02:00 : [{"name":"Mixeur","consumption":200}]**

On branche ensuite une voiture électrique à cette maison à l’aide d’un POST sur la maison et on vérifie que celle-ci est bien comptée dans les objets de la maison :
**On branche une voiture à la maison :**

**On regarde si la voiture est ajoutée:**  
**Les équipement de la maison d'ID 2 le 2021-10-02T03:00 : [{"name":"Mixeur","consumption":200},{"name":"voiture","consumption":500}]**

On fait une demande de planning, qui nous est donnée :
**Une demande de planning est faite et reçue :**

On vérifie que la voiture électrique est bien branchée et en charge lors de l’horaire prévue :
**On regarde la nouvelle consommation de la maison depuis SmartGrid:**  
**La consommation de la maison d'ID 2 le 2021-10-02T03:00 est : 700**

On voit donc que la voiture est branchée.
## Pic de consommation (scenarioConsumptionPeak)

On récupère la consommation d’une communauté une première fois :  
**On monitore la consommation d'une communauté :**   
**La consommation de la communauté d'ID 0 le 2021-10-02T02:00 est : 200**

On appelle ensuite le consumption-verifier pour vérifier  qu’aucun pic de consommation n’est présent dans cette communauté :  
**On regarde s'il n'y a pas de pic de consommation :**  
**Est ce que la communauté d'ID 0 a un pic de consommation le 2021-10-02T02:00 ? : false**

On ajoute un objet qui consomme beaucoup d’électricité dans une maison avec un POST et on vérifie de nouveau la consommation de la communauté avec un /GET sur le consumption-manager :  
**Un objet très gourmand en électricité est branché, la consommation augmente fortement :**  
**La consommation de la communauté d'ID 0 le 2021-10-02T04:00 est : 5200**

Après ce changement, on vérifie de nouveau s’il y a un pic et on remarque que c’est bien le cas :  
**On regarde de nouveau s'il y a un pic de consommation :**   
**Est ce que la communauté d'ID 0 a un pic de consommation le 2021-10-02T04:00 ? : true** 
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
| house         | consumption/houseID | _              | ID (number)     | L'ID de la maison|
| house         | consumption/communityID | _              | ID (number)     | L'ID de communauté de la maison|
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
- 127.0.0.1 production-db=3001
- 127.0.0.1 consumption-scheduler=3002  
- 127.0.0.1 registry-manager=3003   
- 127.0.0.1 client-database=3004  
- 127.0.0.1 supplier=3005  
- 127.0.0.1 production-manager=3006 
- 127.0.0.1 consumption-verifier=3007  
- 127.0.0.1 consumption-manager=3008  
- 127.0.0.1 consumption-db=3009 
- 127.0.0.1 producer-database=3010  
