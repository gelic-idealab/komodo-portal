FROM node:lts-alpine
COPY ./ /komodo/portal/backend
WORKDIR /komodo/portal/backend
RUN npm install
EXPOSE 4040
CMD [ "node", "index.js"]
