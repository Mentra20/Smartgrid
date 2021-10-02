start powershell -command "[console]::windowwidth=70; [console]::windowheight=30; cd dataservice | npm run start:dev" &
start powershell -command "[console]::windowwidth=70; [console]::windowheight=30; cd registry-manager | npm run start:dev" &
start powershell -command "[console]::windowwidth=70; [console]::windowheight=30; cd supplier | npm run start:dev" &
start powershell -command "[console]::windowwidth=70; [console]::windowheight=30; cd consumption-scheduler | npm run start:dev" &
start powershell -command "[console]::windowwidth=70; [console]::windowheight=30; cd consumption-verifier | npm run start:dev " &
start powershell -command "[console]::windowwidth=70; [console]::windowheight=30; cd consumption-manager | npm run start:dev " &
start powershell -command "[console]::windowwidth=70; [console]::windowheight=30; cd house ; $env:PORT='3000' ; $env:IP='0.0.0.0' ; npm run start:dev"&
start powershell -command "[console]::windowwidth=70; [console]::windowheight=30; cd scenario | npm run start:dev " &

