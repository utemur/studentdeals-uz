# Config Package

Общие конфигурации для проекта Student Deals Uzbekistan.

## Описание

Этот пакет содержит общие конфигурации ESLint, Prettier и TypeScript, используемые во всех частях монорепозитория.

## Конфигурации

### ESLint

#### Базовая конфигурация (`eslint/base.js`)
- Основные правила ESLint
- TypeScript поддержка
- Prettier интеграция

#### Next.js конфигурация (`eslint/nextjs.js`)
- Next.js специфичные правила
- React и React Hooks правила
- Accessibility правила

**Использование:**
```json
{
  "extends": ["@studentdeals/config/eslint/nextjs.js"]
}
```

### Prettier

Конфигурация форматирования кода (`prettier/index.js`):
- Полуколонки включены
- Двойные кавычки
- Ширина строки: 80 символов
- 2 пробела для отступов

**Использование:**
```json
{
  "prettier": "@studentdeals/config/prettier"
}
```

### TypeScript

#### Базовая конфигурация (`typescript/base.json`)
- ES2022 target
- Строгий режим
- Path mapping для алиасов
- Next.js поддержка

#### Next.js конфигурация (`typescript/nextjs.json`)
- Расширяет базовую конфигурацию
- Next.js специфичные настройки

**Использование:**
```json
{
  "extends": "@studentdeals/config/typescript/nextjs.json"
}
```

## Правила ESLint

### Основные правила
- `@typescript-eslint/no-unused-vars` - предупреждение о неиспользуемых переменных
- `@typescript-eslint/no-explicit-any` - предупреждение об использовании `any`
- `react/react-in-jsx-scope` - отключено для Next.js
- `react/prop-types` - отключено в пользу TypeScript

### Next.js правила
- `next/core-web-vitals` - Core Web Vitals метрики
- `jsx-a11y` - Accessibility правила
- `react-hooks` - React Hooks правила

## Настройка проекта

### 1. ESLint

Создайте `.eslintrc.json`:
```json
{
  "extends": ["@studentdeals/config/eslint/nextjs.js"]
}
```

### 2. Prettier

Создайте `.prettierrc.js`:
```javascript
module.exports = require("@studentdeals/config/prettier");
```

### 3. TypeScript

Создайте `tsconfig.json`:
```json
{
  "extends": "@studentdeals/config/typescript/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Разработка

```bash
# Установка зависимостей
pnpm install

# Проверка конфигураций
pnpm lint
```

## Структура

```
├── eslint/
│   ├── base.js        # Базовая ESLint конфигурация
│   └── nextjs.js      # Next.js ESLint конфигурация
├── prettier/
│   └── index.js       # Prettier конфигурация
└── typescript/
    ├── base.json      # Базовая TypeScript конфигурация
    └── nextjs.json    # Next.js TypeScript конфигурация
```
