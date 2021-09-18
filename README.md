# smartrix-21-22-soa-21-22-i

## Docker

- build project: `docker-compose build`
- start project: `docker-compose up`
- start project in background: `docker-compose up -d`
- Enter in bash: `docker-compose exec name-of-service bash` (replace name-of-service ex : `docker-compose exec house bash`)
- build only one service: `docker-compose build name-of-service`
- log of service: `docker-compose logs -f --tail=1000 name-of-service`