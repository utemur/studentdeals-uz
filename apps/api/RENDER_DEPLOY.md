# 🚀 Render Deploy Instructions

## ✅ Prisma Auto-Generate Enabled

Этот пакет настроен для автоматической генерации Prisma Client при установке зависимостей на Render.

### 📋 Настройки Render

#### Build Command:
```bash
pnpm install --prod=false && pnpm --filter api build
```

#### Start Command:
```bash
pnpm --filter api start:prod
```

#### Environment Variables:
```bash
DATABASE_URL=postgresql://postgres:password@host:port/database?sslmode=require
PORT=3001
NODE_ENV=production
```

### 🔧 Как работает автогенерация Prisma

В `apps/api/package.json` добавлен скрипт `postinstall`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Это гарантирует, что Prisma Client будет сгенерирован автоматически после `pnpm install`.

### 📦 Версии пакетов

- `@prisma/client`: ^6.16.3
- `prisma`: ^6.16.3

Версии синхронизированы для избежания конфликтов.

### 🐛 Troubleshooting

#### Ошибка: "@prisma/client did not initialize yet"

**Решение:** Убедитесь, что:
1. `postinstall` скрипт присутствует в `package.json`
2. Build Command использует `--prod=false` для установки devDependencies
3. Версии `@prisma/client` и `prisma` совпадают

#### Ошибка: "prisma: command not found"

**Решение:** Убедитесь, что `prisma` находится в `devDependencies` и Build Command включает `--prod=false`.

### 🎯 Проверка локально

```bash
# Установить зависимости (должен автоматически запуститься prisma generate)
pnpm install

# Собрать проект
pnpm --filter api build

# Запустить локально
pnpm --filter api start:prod
```

### 📚 Полезные ссылки

- [Render Docs](https://render.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
