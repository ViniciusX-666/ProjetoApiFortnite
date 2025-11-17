# Estágio 1: Build da aplicação Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Build da aplicação para produção
RUN npm run build

# Estágio 2: Servir com nginx
FROM nginx:alpine

# Copia os arquivos buildados para o nginx
# Angular 20 gera em dist/projeto-fortnite/browser
COPY --from=build /app/dist/projeto-fortnite/browser /usr/share/nginx/html

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"]

