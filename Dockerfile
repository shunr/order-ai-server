FROM node:10-stretch

WORKDIR /home/order-ai-server

RUN npm install -g typescript

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start