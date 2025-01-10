FROM node:23.5-alpine
WORKDIR /usr/nodemon
COPY ./package.json .
RUN npm install --quiet
COPY . .
ENV NODE_PATH=./build
RUN npm run build
