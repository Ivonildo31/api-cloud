FROM mhart/alpine-node:6.2.1

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# add project to build
COPY src /root/api/src
COPY package.json /root/api/package.json
COPY newrelic.js /root/api/newrelic.js
WORKDIR /root/api

RUN npm install

ENV PORT 4242

EXPOSE 4242

CMD ["node", "src/bin/www"]
