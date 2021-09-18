FROM node:14.17.0-alpine

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . .
RUN npm run build

CMD ["node", "dist/main"]