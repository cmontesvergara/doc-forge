FROM node:18-alpine
RUN apk update && apk upgrade && \
    apk add --no-cache git
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install --production --omit=dev && npm cache clean --force
COPY ./ /usr/src/app
RUN npm run build
COPY ./dist /usr/src/app
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

CMD [ "node", "dist/src/main.js" ]