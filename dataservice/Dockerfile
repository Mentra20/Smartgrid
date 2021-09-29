FROM node:14.17.6-alpine

WORKDIR /usr/src/app

COPY package* .

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/main"]