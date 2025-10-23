import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BrandResponseDto, BrandListResponseDto } from './dto/brand-response.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categorySlug?: string): Promise<BrandListResponseDto> {
    const where = categorySlug ? { category: { slug: categorySlug } } : {};
    
    const brands = await this.prisma.brand.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            nameRu: true,
            nameUz: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      data: brands.map(brand => ({
        id: brand.id,
        slug: brand.slug,
        name: brand.name,
        description: brand.description,
        logoUrl: brand.logoUrl,
        category: {
          id: brand.category.id,
          slug: brand.category.slug,
          nameRu: brand.category.nameRu,
          nameUz: brand.category.nameUz,
        },
      })),
    };
  }

  async findOne(slug: string): Promise<BrandResponseDto> {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            nameRu: true,
            nameUz: true,
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with slug "${slug}" not found`);
    }

    return {
      id: brand.id,
      slug: brand.slug,
      name: brand.name,
      description: brand.description,
      logoUrl: brand.logoUrl,
      category: {
        id: brand.category.id,
        slug: brand.category.slug,
        nameRu: brand.category.nameRu,
        nameUz: brand.category.nameUz,
      },
    };
  }
}
