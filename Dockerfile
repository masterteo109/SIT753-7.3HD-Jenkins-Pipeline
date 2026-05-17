FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY src ./src

RUN npm run build

ENV NODE_ENV=production

RUN mkdir -p data logs

EXPOSE 3000

CMD ["node", "src/server.js"]