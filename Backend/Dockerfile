FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm","start" ]