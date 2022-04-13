FROM node:latest

RUN yarn global add nodemon

USER node

WORKDIR /home/node/code