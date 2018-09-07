FROM node:latest

WORKDIR /home/order-ai-server

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start