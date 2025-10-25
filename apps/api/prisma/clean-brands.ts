import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Список разрешенных брендов из brands.json
const allowedBrands = [
  'evos', 'kfc', 'safia', 'yaponamama', 'wendy\'s',
  'allplay', 'beeline',
  'macbro', 'artel', 'xiaomi',
  'terra-pro', 'just',
  'proweb', '5plus',
  'uzbekistan-airways', 'yandex-taxi',
  'oxymed', 'bloom'
];

async function cleanBrands() {
  console.log('🧹 Cleaning up old brands...');
  
  // Получаем все бренды из базы
  const allBrands = await prisma.brand.findMany();
  
  // Удаляем бренды, которых нет в разрешенном списке
  for (const brand of allBrands) {
    if (!allowedBrands.includes(brand.slug)) {
      console.log(`❌ Removing: ${brand.name} (${brand.slug})`);
      await prisma.brand.delete({ where: { id: brand.id } });
    } else {
      console.log(`✅ Keeping: ${brand.name} (${brand.slug})`);
    }
  }
  
  console.log('✅ Cleanup completed!');
}

cleanBrands()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
