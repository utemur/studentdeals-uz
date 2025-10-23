// apps/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

// Простая функция для слага
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Функция для получения иконки категории
function getCategoryIcon(categoryKey: string): string {
  const icons: Record<string, string> = {
    'food': '🍔',
    'entertainment': '🎬',
    'technology': '💻',
    'fashion': '👕',
    'education': '📚',
    'travel': '✈️',
  };
  return icons[categoryKey] || '📦';
}

// Функция для получения порядка категории
function getCategoryOrder(categoryKey: string): number {
  const orders: Record<string, number> = {
    'food': 1,
    'entertainment': 2,
    'education': 3,
    'technology': 4,
    'fashion': 5,
    'travel': 6,
  };
  return orders[categoryKey] || 99;
}

// Ожидаем формат JSON: { "food": ["KFC","Burger King"], "electronics": ["Artel", ...], ... }
type BrandMap = Record<string, string[]>;

async function main() {
  // Путь к данным (положи файл сюда: apps/api/prisma/data/brands.json)
  const dataPath = path.join(process.cwd(), 'prisma', 'data', 'brands.json');
  const raw = readFileSync(dataPath, 'utf-8');
  const brandsByCategory = JSON.parse(raw) as BrandMap;

  console.log('⏳ Seeding brands...');

  for (const [categoryKey, brands] of Object.entries(brandsByCategory)) {
    const categorySlug = slugify(categoryKey);

     // Если категорий уже насеяны – connect по slug,
     // иначе создадим (идемпотентно через upsert).
     const category = await prisma.category.upsert({
       where: { slug: categorySlug },
       update: {},
       create: {
         slug: categorySlug,
         nameRu: categoryKey,
         nameUz: categoryKey, // Можно будет перевести позже
         icon: getCategoryIcon(categoryKey),
         order: getCategoryOrder(categoryKey),
       },
     });

    for (const name of brands) {
      const brandSlug = slugify(name);

      await prisma.brand.upsert({
        where: { slug: brandSlug }, // предполагаем unique index по slug у Brand
        update: {
          name,
          categoryId: category.id,
        },
        create: {
          name,
          slug: brandSlug,
          categoryId: category.id,
        },
      });

      console.log(`✔ ${name} → ${category.name}`);
    }
  }

  console.log('✅ Seeding completed');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// ВАЖНО: никаких export в сидере!