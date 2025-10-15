# Тестирование StudentDeals.uz

## Обзор

Проект использует Playwright для E2E тестирования, охватывающего как фронтенд, так и API endpoints.

## Структура тестов

```
e2e/
├── api.spec.ts          # API тесты (health, auth endpoints)
├── auth-ui.spec.ts      # UI тесты (signin/signup формы)
└── README.md           # Документация по тестам
```

## Локальный запуск

### Предварительные требования
```bash
# Установка зависимостей
pnpm install

# Установка браузеров Playwright
pnpm exec playwright install --with-deps
```

### Переменные окружения
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Запуск тестов
```bash
# Все тесты
pnpm test:e2e

# Конкретный файл
pnpm exec playwright test e2e/api.spec.ts

# С UI (headed mode)
pnpm exec playwright test --headed

# Отладка
pnpm exec playwright test --debug
```

## Конфигурация

### playwright.config.ts
```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: [
    {
      command: 'pnpm --filter web run dev',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'node simple-api.js',
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

## API Тесты (api.spec.ts)

### Health Endpoints
- `GET /health` - проверка статуса API
- `GET /health/db` - проверка подключения к БД

### Auth Endpoints
- `POST /auth/register` - регистрация пользователя
- `POST /auth/login` - авторизация
- `GET /auth/me` - получение профиля (с токеном)

### Валидация
- Проверка обязательных полей
- Валидация email формата
- Проверка силы пароля
- Обработка ошибок

## UI Тесты (auth-ui.spec.ts)

### Страницы аутентификации
- `/ru/signup` - страница регистрации
- `/ru/signin` - страница входа

### Валидация форм
- Проверка обязательных полей
- Валидация email
- Проверка паролей
- Сообщения об ошибках

### Интерактивность
- Переключение языков
- Адаптивность (мобильные устройства)
- Доступность (accessibility)

## CI/CD (GitHub Actions)

### Workflow (.github/workflows/e2e.yml)
```yaml
name: E2E Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 18
        cache: 'npm'
    - name: Install pnpm
      uses: pnpm/action-setup@v2
    - name: Install dependencies
      run: pnpm install
    - name: Install Playwright Browsers
      run: pnpm exec playwright install --with-deps
    - name: Build web app
      run: pnpm --filter web run build
    - name: Run Playwright tests
      run: pnpm test:e2e
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

## Переменные окружения

### Локальная разработка
```bash
# Frontend
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend
DATABASE_URL=postgresql://...
CORS_ORIGIN=http://localhost:3000
```

### CI/CD
```bash
# GitHub Actions
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
CI=true
```

### Production
```bash
# Vercel (Frontend)
NEXT_PUBLIC_SITE_URL=https://studentdeals.uz
NEXT_PUBLIC_API_URL=https://api.studentdeals.uz

# Render (Backend)
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://studentdeals.uz,https://*.vercel.app
```

## Отладка

### Локальная отладка
```bash
# Запуск с UI
pnpm exec playwright test --headed

# Отладка конкретного теста
pnpm exec playwright test --debug e2e/api.spec.ts

# Генерация trace
pnpm exec playwright test --trace on
```

### Просмотр результатов
```bash
# HTML отчет
pnpm exec playwright show-report

# Screenshots
ls playwright-results/
```

## Лучшие практики

### Написание тестов
1. **Изолированность**: каждый тест независим
2. **Чистота**: очистка данных после тестов
3. **Надежность**: использование `waitFor` для асинхронных операций
4. **Читаемость**: понятные названия и структура

### Селекторы
```typescript
// Хорошо - семантические селекторы
await page.locator('button[type="submit"]').click();
await page.locator('input[name="email"]').fill('test@example.com');

// Плохо - хрупкие селекторы
await page.locator('.btn-primary').click();
await page.locator('#email-input').fill('test@example.com');
```

### Ожидания
```typescript
// Хорошо - явные ожидания
await expect(page.locator('text=Success')).toBeVisible();
await expect(response).toHaveStatus(200);

// Плохо - неявные ожидания
await page.waitForTimeout(1000);
```

## Мониторинг

### Метрики
- Время выполнения тестов
- Процент успешных тестов
- Количество флаки тестов

### Алерты
- Падение тестов в CI
- Увеличение времени выполнения
- Проблемы с инфраструктурой

## Troubleshooting

### Частые проблемы

#### Тесты падают в CI
```bash
# Проверка переменных окружения
echo $NEXT_PUBLIC_SITE_URL
echo $NEXT_PUBLIC_API_URL

# Проверка доступности серверов
curl http://localhost:3000/health
curl http://localhost:3001/health
```

#### Проблемы с селекторами
```bash
# Генерация селекторов
pnpm exec playwright codegen http://localhost:3000/ru/signup
```

#### Проблемы с браузерами
```bash
# Переустановка браузеров
pnpm exec playwright install --force
```

### Логи
```bash
# Подробные логи
DEBUG=pw:api pnpm exec playwright test

# Логи CI
pnpm exec playwright test --reporter=line
```

## Обновление

### Playwright
```bash
# Обновление до последней версии
pnpm update @playwright/test

# Обновление браузеров
pnpm exec playwright install
```

### Зависимости
```bash
# Обновление всех зависимостей
pnpm update

# Проверка устаревших пакетов
pnpm outdated
```

---

**Последнее обновление**: Январь 2025  
**Версия Playwright**: 1.40+  
**Статус**: Активное использование
