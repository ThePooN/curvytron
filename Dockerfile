FROM node:alpine

WORKDIR /src

COPY . /src

RUN apk add git python2 alpine-sdk
RUN npm i -g bower
RUN npm i
RUN bower install --allow-root
RUN ./node_modules/.bin/gulp

ENV NODE_ENV=production
RUN npm prune --production
RUN apk del git python2 alpine-sdk

EXPOSE 8080

ENTRYPOINT [ "node", "bin/curvytron.js" ]
