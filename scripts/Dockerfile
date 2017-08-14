FROM node:7.7.2-alpine

RUN mkdir /usr/app/proxilabs-bot

WORKDIR /usr/app/proxilabs-bot

COPY ./package.json .
RUN npm i --quiet

COPY ./index.js .
