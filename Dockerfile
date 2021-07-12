FROM node:latest

ENV SOURCE=/opt/app/lean-tech-challenge

# Create app directory
RUN mkdir -p $SOURCE
WORKDIR $SOURCE

COPY ./yarn.lock ./package.json ./tsconfig.json .env $SOURCE/

RUN yarn

COPY ./src/ $SOURCE/src/

EXPOSE 3000 3000

ENV TS_NODE=${SOURCE}/node_modules/.bin/ts-node
ENV TS_EXEC=${SOURCE}/src/index.ts

CMD $TS_NODE $TS_EXEC