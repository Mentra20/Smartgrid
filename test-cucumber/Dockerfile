FROM node:14.17.6-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

CMD ["node", "dist/main"]
