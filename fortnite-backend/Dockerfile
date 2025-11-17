FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Expõe a porta do servidor
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]

