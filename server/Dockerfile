FROM node:10-alpine

WORKDIR /tmp
COPY package.json yarn.lock .yarnrc ./
RUN yarn
WORKDIR /opt/app
RUN cp -a /tmp/node_modules .
COPY . .

RUN yarn global add pm2

EXPOSE 8000
CMD ["./entrypoint"]
