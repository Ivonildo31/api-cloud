FROM node:6.4.0-slim

RUN apt-get update
RUN apt-get install -y git 

# add project to build
COPY src /root/api/src
COPY package.json /root/api/package.json
COPY newrelic.js /root/api/newrelic.js
WORKDIR /root/api

RUN npm install

ENV PORT 4242

EXPOSE 4242

CMD ["node", "src/bin/www"]
