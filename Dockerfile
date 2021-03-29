FROM node:latest

WORKDIR /
COPY ./package.json ./package.json
COPY . .

RUN npm install
# RUN yarn install --production
EXPOSE 3000
CMD [ "node", "./server.js" ]
