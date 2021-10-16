start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd client-database | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd consumption-db | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd consumption-detailed | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd consumption-scheduler | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd consumption-verifier | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd consumption-adder | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd consumption-provider | npm install | npm run start:dev" &

start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd house | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd supplier | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd producer-database | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd production-db | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd production-provider | npm install | npm run start:dev" &
start powershell -command "[console]::windowwidth=100; [console]::windowheight=30; cd registry-manager | npm install | npm run start:dev" &
