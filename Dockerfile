# Artem Zaitsev
FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
EXPOSE 8082

RUN useradd -m app
RUN chown -R app /app
USER app

CMD ["node", "server.mjs"]
