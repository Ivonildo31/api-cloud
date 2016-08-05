#!/bin/bash

docker login -e $DOCKER_EMAIL -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker push $DOCKER_IMAGE
git clone https://github.com/prodest/gerencio-upgrade
cd gerencio-upgrade
npm install
node ./gerencio-upgrade $SERVICE_NAME 40000
