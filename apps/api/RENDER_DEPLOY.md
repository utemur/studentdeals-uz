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
JWT_SECRET=your-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:3000,https://studentdeals.uz,https://www.studentdeals.uz,https://studentdeals-uz.vercel.app
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

### 🌐 CORS Configuration

API использует переменную окружения `ALLOWED_ORIGINS` для настройки CORS.

#### Формат:
```bash
ALLOWED_ORIGINS="origin1,origin2,origin3"
```

#### По умолчанию (если не указано):
```bash
ALLOWED_ORIGINS="http://localhost:3000"
```

#### Для продакшна на Render:
```bash
ALLOWED_ORIGINS="http://localhost:3000,https://studentdeals.uz,https://www.studentdeals.uz,https://studentdeals-uz.vercel.app"
```

**Важно:** 
- Разделяйте origins запятыми
- Не добавляйте пробелы между origins (или они будут автоматически удалены)
- Включайте все варианты вашего домена (с www и без)
- Включайте Vercel preview URLs если нужно

#### Проверка CORS локально:
```bash
# Установите переменную окружения
export ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# Запустите API
pnpm --filter api start:prod

# Проверьте CORS
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3001/auth/register -v
```

### 📚 Полезные ссылки

- [Render Docs](https://render.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
