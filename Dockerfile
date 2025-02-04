FROM node:23.5-alpine
WORKDIR /usr/nodemon
COPY ./package.json .
RUN npm install --quiet
COPY . .
RUN npm run build

CMD ["sh", "-c", "npm run migrate up && npm run prod"]
