#!/bin/bash

docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS
docker push $DOCKER_IMAGE
git clone https://github.com/prodest/gerencio-upgrade
cd gerencio-upgrade
npm install
node ./gerencio-upgrade $SERVICENAME 40000