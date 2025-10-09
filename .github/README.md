# GitHub Actions CI/CD

## 🔄 Workflows

### CI Pipeline (`ci.yml`)

Автоматически запускается при:
- Push в ветки `main` или `develop`
- Pull Request в ветки `main` или `develop`

#### Шаги:

1. **Checkout** - клонирование репозитория
2. **Setup Node.js 20** - установка Node.js
3. **Setup pnpm 8.15.0** - установка менеджера пакетов
4. **Cache pnpm store** - кэширование зависимостей
5. **Cache Turbo** - кэширование сборок Turbo
6. **Install** - `pnpm install --frozen-lockfile`
7. **Lint** - `pnpm -w lint`
8. **Typecheck** - `pnpm -w typecheck`
9. **Build web** - `pnpm --filter web build`
10. **Build with Turbo** - `pnpm turbo run build --filter=web`

## ⚡ Кэширование

### pnpm Store Cache
- **Key:** `${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}`
- **Путь:** `$(pnpm store path)`
- **Инвалидация:** при изменении `pnpm-lock.yaml`

### Turbo Cache
- **Key:** `${{ runner.os }}-turbo-${{ github.sha }}`
- **Путь:** `.turbo`
- **Restore keys:** предыдущие сборки для инкрементальных билдов

## 🌍 Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://studentdeals-uz.onrender.com
```

## 📊 Производительность

### Без кэша:
- Установка зависимостей: ~2-3 минуты
- Lint + Typecheck: ~1 минута
- Build: ~2-3 минуты
- **Итого:** ~5-7 минут

### С кэшем:
- Установка зависимостей: ~30 секунд
- Lint + Typecheck: ~30 секунд
- Build (Turbo cache hit): ~10 секунд
- **Итого:** ~1-2 минуты

## 🔧 Локальное тестирование CI

```bash
# Установка зависимостей
pnpm install --frozen-lockfile

# Lint
pnpm -w lint

# Typecheck
pnpm -w typecheck

# Build web app
pnpm --filter web build

# Build with Turbo
pnpm turbo run build --filter=web
```

## 📝 Turbo Pipeline

Конфигурация в `turbo.json`:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
```

## 🚀 Deployment

После успешного прохождения CI:
- **Frontend (Vercel):** автоматический деплой из `main`
- **Backend (Render):** автоматический деплой из `main`

## 🐛 Troubleshooting

### CI падает на lint
```bash
# Локально проверить
pnpm -w lint

# Исправить автоматически
pnpm -w lint --fix
```

### CI падает на typecheck
```bash
# Локально проверить
pnpm -w typecheck

# Проверить конкретный пакет
pnpm --filter web typecheck
```

### CI падает на build
```bash
# Локально собрать
pnpm --filter web build

# Проверить переменные окружения
cat apps/web/.env.local
```

### Очистка кэша Turbo
```bash
# Локально
pnpm turbo run build --force

# В CI - удалить кэш в GitHub Actions Settings
```

