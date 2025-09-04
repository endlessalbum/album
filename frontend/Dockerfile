FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# 👇 копируем схему Prisma раньше, чем npm install
COPY prisma ./prisma

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]