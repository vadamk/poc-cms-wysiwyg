FROM node:12.18.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
