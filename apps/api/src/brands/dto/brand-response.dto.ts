import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ description: 'Category ID' })
  id!: number;

  @ApiProperty({ description: 'Category slug' })
  slug!: string;

  @ApiProperty({ description: 'Category name in Russian' })
  nameRu!: string;

  @ApiProperty({ description: 'Category name in Uzbek' })
  nameUz!: string;
}

export class BrandResponseDto {
  @ApiProperty({ description: 'Brand ID' })
  id!: number;

  @ApiProperty({ description: 'Brand slug' })
  slug!: string;

  @ApiProperty({ description: 'Brand name' })
  name!: string;

  @ApiProperty({ description: 'Brand description', required: false })
  description?: string;

  @ApiProperty({ description: 'Brand logo URL', required: false })
  logoUrl?: string;

  @ApiProperty({ description: 'Brand category', type: CategoryDto })
  category!: CategoryDto;
}

export class BrandListResponseDto {
  @ApiProperty({ description: 'List of brands', type: [BrandResponseDto] })
  data!: BrandResponseDto[];
}
