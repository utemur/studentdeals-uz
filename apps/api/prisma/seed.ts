import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface BrandData {
  name: string;
  categorySlug: string;
  descriptionRu?: string;
  logoUrl?: string;
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

async function seedBrands() {
  try {
    console.log('🌱 Starting brands seeding...');

    // Read brands data
    const brandsPath = join(__dirname, 'data', 'brands.json');
    const brandsData: BrandData[] = JSON.parse(readFileSync(brandsPath, 'utf8'));

    console.log(`📦 Found ${brandsData.length} brands to seed`);

    // First, create categories if they don't exist
    const categoriesData = [
      { slug: 'food', nameRu: 'Еда и напитки', nameUz: 'Ovqat va ichimliklar', icon: '🍔', order: 1 },
      { slug: 'entertainment', nameRu: 'Развлечения', nameUz: 'O\'yin-kulgi', icon: '🎬', order: 2 },
      { slug: 'education', nameRu: 'Образование', nameUz: 'Ta\'lim', icon: '📚', order: 3 },
      { slug: 'technology', nameRu: 'Технологии', nameUz: 'Texnologiya', icon: '💻', order: 4 },
      { slug: 'fashion', nameRu: 'Мода', nameUz: 'Moda', icon: '👕', order: 5 },
      { slug: 'travel', nameRu: 'Путешествия', nameUz: 'Sayohat', icon: '✈️', order: 6 },
    ];

    console.log('📂 Seeding categories...');
    for (const categoryData of categoriesData) {
      await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: {},
        create: categoryData,
      });
    }
    console.log('✅ Categories seeded successfully');

    // Process brands
    let successCount = 0;
    let skipCount = 0;

    for (const brandData of brandsData) {
      try {
        // Find category by slug
        const category = await prisma.category.findUnique({
          where: { slug: brandData.categorySlug },
        });

        if (!category) {
          console.warn(`⚠️  Category with slug "${brandData.categorySlug}" not found for brand "${brandData.name}". Skipping.`);
          skipCount++;
          continue;
        }

        // Generate slug for brand
        const brandSlug = generateSlug(brandData.name);

        // Upsert brand
        await prisma.brand.upsert({
          where: { name: brandData.name },
          update: {
            slug: brandSlug,
            description: brandData.descriptionRu || null,
            logoUrl: brandData.logoUrl || null,
            categoryId: category.id,
          },
          create: {
            name: brandData.name,
            slug: brandSlug,
            description: brandData.descriptionRu || null,
            logoUrl: brandData.logoUrl || null,
            categoryId: category.id,
          },
        });

        console.log(`✅ Brand "${brandData.name}" seeded successfully`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error seeding brand "${brandData.name}":`, error);
        skipCount++;
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`✅ Successfully seeded: ${successCount} brands`);
    console.log(`⚠️  Skipped: ${skipCount} brands`);
    console.log(`📦 Total processed: ${brandsData.length} brands');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedBrands()
    .then(() => {
      console.log('🎉 Brands seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Brands seeding failed:', error);
      process.exit(1);
    });
}

export { seedBrands };
