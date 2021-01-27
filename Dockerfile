FROM node:lts

WORKDIR /app
COPY ./package*.json ./
RUN npm install -g nodemon
RUN npm ci
COPY . .
RUN chown -R node:node /app
USER node

EXPOSE 9000
CMD npm start
