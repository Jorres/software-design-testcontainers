FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 30001

CMD node /usr/src/app/src/exchange/exchange.js
