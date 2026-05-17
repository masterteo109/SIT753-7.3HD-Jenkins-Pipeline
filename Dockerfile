FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY src ./src

RUN mkdir -p data logs

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_FILE=/app/data/students-db.json

EXPOSE 3000

CMD ["node", "src/server.js"]
