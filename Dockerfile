FROM node:alpine 
WORKDIR /usr/app
COPY ./ /usr/app
EXPOSE 3000
RUN npm install
CMD ["npm", "start"]