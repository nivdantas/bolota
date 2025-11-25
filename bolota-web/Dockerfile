FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# O --host é necessário para acessar o Vite de fora do container
CMD ["npm", "run", "dev", "--", "--host"]
