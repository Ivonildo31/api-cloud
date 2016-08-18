FROM ubuntu:14.04

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get install -y nodejs
#RUN apt-get install -y npm
RUN apt-get install -y git 
#RUN apt-get install -y openssh

# add project to build
COPY src /root/api/src
COPY node_modules /root/api/node_modules
COPY package.json /root/api/package.json
COPY newrelic.js /root/api/newrelic.js
WORKDIR /root/api

#RUN npm install

ENV PORT 4242

EXPOSE 4242

CMD ["node", "src/bin/www"]
