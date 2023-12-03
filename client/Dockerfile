FROM node:20-alpine

WORKDIR /app

RUN ls -la

COPY package.json .
RUN npm i

COPY . .

EXPOSE 80

CMD ["npm", "run", "dev"]