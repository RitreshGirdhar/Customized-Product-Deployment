FROM node:12
VOLUME /usr/src/app/prometheus/
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3333
CMD [ "node", "server.js" ]