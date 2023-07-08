# BLUE-Pet

Welcome to BLUE-Pet, the shop pet website developed by [BlveH](https://github.com/BlveH).

## Prerequisites

Before you install and use the BLUE-Pet project, you'll need the following:

- [NodeJS](https://nodejs.org/en/)

## Installation

1.  Clone this repository

```
git clone https://github.com/BlveH/BLUE-Pet.git
```

2.  Install all dependencies

```
npx yarn install
```

3.  Start the BLUE-Pet server

```
npm start
```

That's it! You have successfully completed the installation of BLUE-Pet.

## Documentation

- API: [v1](https://documenter.getpostman.com/view/20764163/2s93RWMq5a)

## Docker image

- [bluehv/blue-pet](https://hub.docker.com/repository/docker/bluehv/blue-pet/general)

## docker-compose.yml

- Example:

```
services:
    node:
        env_file:
            - blue.env
        image: bluehv/blue-pet
        command: sh -c "yarn start"
        ports:
            - 3000:3000
        networks:
            - blue
    mongo:
        env_file:
            - blue.env
        image: mongo:focal
        restart: always
        ports:
            - 27017:27017
        volumes:
            - ./data/mongo:/data/db
        networks:
            - blue
networks:
    blue:
```

## blue.env

- Example:

```
MONGO_URI=mongodb://admin:example@localhost:27017/?retryWrites=true&w=majority
PORT=
CLIENT_ID=
CLIENT_SECRET=
CALLBACK_URL=http://localhost:3000/auth/redirect
SECRET=
REFRESH_SECRET=
ADMIN_EMAIL=
HOST=
SERVICE=
USER=
PASS=
BASE_URL = "http://localhost:3000/"
```
