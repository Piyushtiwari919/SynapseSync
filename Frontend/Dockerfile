#build stage

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#production stage

FROM node:22-alpine

RUN npm i -g serve
ENV PATH="/usr/local/bin:$PATH"
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s","dist", "-l","3000"]