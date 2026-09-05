# Как запустить проект локально

```bash
pnpm install
cp .env.example .env   # заполните значения — см. README.md
pnpm db:push
pnpm db:seed
pnpm dev
```

Откройте: **http://localhost:3000**

Подробности — переменные окружения, модель данных, вход по magic link,
управление брендами — в [README.md](./README.md).

## Если сервер не запускается

```bash
lsof -ti:3000 | xargs kill -9   # освободить порт 3000
rm -rf node_modules .next
pnpm install
pnpm dev
```

Или просто `./dev.sh`.
