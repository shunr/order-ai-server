FROM node:10-stretch

WORKDIR /home/order-ai-server

RUN npm install -g typescript

COPY package*.json ./

COPY . .

RUN npm install

CMD npm run clean && npm run build && npm start