FROM node:12.16.3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]