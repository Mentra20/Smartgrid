start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd client-database | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd consumption-db | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd consumption-manager | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd consumption-scheduler | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd consumption-verifier | npm run start:dev" &

start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd house | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd supplier | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd producer-database | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd production-db | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd production-manager | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd registry-manager | npm run start:dev" &
