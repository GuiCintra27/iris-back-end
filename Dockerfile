FROM node:16

WORKDIR /src/usr/

COPY . .

EXPOSE 5000

RUN npm i