FROM node:latest

WORKDIR /
COPY ./package.json ./package.json
COPY . .

RUN npm install
RUN apt-get update 

EXPOSE 3000
CMD [ "node", "./server.js" ]
