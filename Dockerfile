FROM node:latest

ENV SOURCE=/opt/app/lean-tech-challenge
ENV PORT=${PORT}
ENV NODE_ENV=development

# Create app directory
RUN mkdir -p $SOURCE
WORKDIR $SOURCE

COPY ./yarn.lock ./package.json ./tsconfig.json .env.${NODE_ENV} $SOURCE/

RUN yarn

COPY ./src/ $SOURCE/src/

EXPOSE ${PORT} ${PORT}
EXPOSE 27017 27017

CMD [ "yarn", "dev" ]