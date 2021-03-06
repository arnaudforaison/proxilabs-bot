FROM node:7.7.2-alpine

# Create app directory
RUN mkdir -p /usr/app/proxilabs-bot
WORKDIR /usr/app/proxilabs-bot

# Install app dependencies
COPY package.json .
RUN npm i --quiet

# Copy app source
COPY src .
CMD [ "node", "/usr/app/proxilabs-bot/index.js" ]
