# Types Package

Общие TypeScript типы и интерфейсы для проекта Student Deals Uzbekistan.

## Описание

Этот пакет содержит все общие типы данных, используемые в приложении. Он обеспечивает типобезопасность и консистентность данных между различными частями системы.

## Типы

### User

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isStudent: boolean;
  university?: string;
  studentId?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### Offer

```typescript
interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  category: OfferCategory;
  merchant: Merchant;
  images: string[];
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  isStudentOnly: boolean;
  requirements?: string[];
  terms?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Merchant

```typescript
interface Merchant {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Категории предложений

```typescript
enum OfferCategory {
  FOOD = "food",
  ENTERTAINMENT = "entertainment",
  EDUCATION = "education",
  SHOPPING = "shopping",
  HEALTH = "health",
  TRANSPORT = "transport",
  TECHNOLOGY = "technology",
  OTHER = "other",
}
```

## Использование

```typescript
import { User, Offer, OfferCategory } from "@studentdeals/types";

const user: User = {
  id: "1",
  email: "student@example.com",
  firstName: "Али",
  lastName: "Алиев",
  isStudent: true,
  university: "TUIT",
  studentId: "12345",
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
};
```

## Разработка

```bash
# Сборка типов
pnpm build

# Режим разработки с watch
pnpm dev

# Проверка типов
pnpm typecheck

# Очистка
pnpm clean
```

## Структура

```
src/
├── user.ts        # Пользовательские типы
├── offer.ts       # Типы предложений
└── index.ts       # Экспорт всех типов
```
