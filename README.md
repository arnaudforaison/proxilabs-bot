[![Build Status](https://travis-ci.org/arnaudforaison/proxilabs-bot.svg?branch=develop)](https://travis-ci.org/arnaudforaison/proxilabs-bot)

# ProxiLabs bot
A Slack bot for Proxilabs management

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You must need __NodeJs & npm__ was installed with version :
 - > 6.9.x for NodeJs
 - >v5.x.x for npm

### Installing

Install dependencies & setup env variables locally

```
npm run setup
```

Then, fill new **.env** created file with correct tokens


## Running the tests

To run all tests, only do this :
```
npm test
```

### Start application

To run locally the application is necessary to start a tunnel to expose localhost ip to the world.

```
npm i -g localtunnel
lt --port 9090 --subdomain proxilabs
```

This is necessary to allow Slack to find your localhost for slash command or dialog popin for examples

Then,
```
npm run start
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Botkit](https://github.com/howdyai/botkit/blob/master/docs/readme.md#botkit---building-blocks-for-building-bots) - Bot framework
* [Firebase](https://firebase.google.com/docs/) - Database manager

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details