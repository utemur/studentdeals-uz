import { PrismaClient, Category } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Same reasoning as src/lib/db.ts: query over HTTPS/WebSocket rather than
// raw Postgres TCP, since that's blocked on some networks.
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const wiut = await prisma.university.upsert({
    where: { domain: 'wiut.uz' },
    update: {},
    create: {
      name: 'Westminster International University in Tashkent',
      domain: 'wiut.uz',
      isActive: true,
    },
  });

  console.log(`University ready: ${wiut.name} (@${wiut.domain})`);

  const brands: Array<{
    name: string;
    slug: string;
    category: Category;
    description: string;
    deals: Array<{ title: string; discountLabel: string; code: string; description?: string }>;
  }> = [
    {
      name: 'Yandex Taxi',
      slug: 'yandex-taxi',
      category: Category.TRAVEL,
      description: 'Заказ такси по всему Узбекистану.',
      deals: [
        {
          title: 'Скидка на первые 3 поездки',
          discountLabel: '15% off',
          code: 'STUDENT15',
          description: 'Действует на первые три поездки после активации кода.',
        },
      ],
    },
    {
      name: 'Evos',
      slug: 'evos',
      category: Category.FOOD_DRINK,
      description: 'Бургеры и фастфуд.',
      deals: [
        {
          title: 'Скидка на комбо-меню',
          discountLabel: '10% off',
          code: 'EVOSSTUDENT',
        },
      ],
    },
    {
      name: 'Xiaomi',
      slug: 'xiaomi',
      category: Category.TECH,
      description: 'Техника и аксессуары.',
      deals: [
        {
          title: 'Скидка на аксессуары',
          discountLabel: '10% off',
          code: 'XIAOMISTU',
        },
      ],
    },
  ];

  for (const b of brands) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        name: b.name,
        slug: b.slug,
        category: b.category,
        description: b.description,
        isActive: true,
      },
    });

    for (const d of b.deals) {
      const existing = await prisma.deal.findFirst({
        where: { brandId: brand.id, title: d.title },
      });
      if (!existing) {
        await prisma.deal.create({
          data: {
            brandId: brand.id,
            title: d.title,
            description: d.description,
            code: d.code,
            discountLabel: d.discountLabel,
            isActive: true,
          },
        });
      }
    }

    console.log(`Brand ready: ${brand.name} (${b.deals.length} deal(s))`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
