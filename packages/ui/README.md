# UI Package

Переиспользуемые UI компоненты для проекта Student Deals Uzbekistan.

## Описание

Этот пакет содержит общие UI компоненты, построенные с использованием Tailwind CSS и React. Компоненты спроектированы для переиспользования во всех частях приложения.

## Компоненты

### Button

Кнопка с различными вариантами стилизации.

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}
```

**Использование:**
```tsx
import { Button } from "@studentdeals/ui";

<Button variant="primary" size="md">
  Нажми меня
</Button>
```

### Card

Карточка с заголовком, контентом и футером.

```typescript
interface CardProps {
  children: React.ReactNode;
}

interface CardHeaderProps {
  children: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
}

interface CardFooterProps {
  children: React.ReactNode;
}
```

**Использование:**
```tsx
import { Card, CardHeader, CardContent, CardFooter } from "@studentdeals/ui";

<Card>
  <CardHeader>
    <h3>Заголовок карточки</h3>
  </CardHeader>
  <CardContent>
    <p>Содержимое карточки</p>
  </CardContent>
  <CardFooter>
    <Button>Действие</Button>
  </CardFooter>
</Card>
```

### Container

Адаптивный контейнер с различными размерами.

```typescript
interface ContainerProps {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
}
```

**Использование:**
```tsx
import { Container } from "@studentdeals/ui";

<Container size="lg">
  <h1>Заголовок страницы</h1>
  <p>Контент страницы</p>
</Container>
```

## Утилиты

### cn

Утилита для объединения CSS классов с поддержкой Tailwind CSS.

```typescript
import { cn } from "@studentdeals/ui";

const className = cn(
  "base-class",
  "conditional-class",
  props.className
);
```

## Стилизация

Все компоненты используют Tailwind CSS классы и поддерживают:
- Темную тему
- Адаптивный дизайн
- Кастомные CSS переменные
- Hover и focus состояния

## Разработка

```bash
# Сборка компонентов
pnpm build

# Режим разработки с watch
pnpm dev

# Проверка типов
pnpm typecheck

# Очистка
pnpm clean
```

## Зависимости

- `react` - React компоненты
- `clsx` - Утилита для работы с классами
- `tailwind-merge` - Объединение Tailwind классов

## Структура

```
src/
├── components/
│   ├── Button.tsx      # Компонент кнопки
│   ├── Card.tsx        # Компоненты карточек
│   └── Container.tsx   # Компонент контейнера
├── lib/
│   └── utils.ts        # Утилиты
└── index.ts           # Экспорт всех компонентов
```
