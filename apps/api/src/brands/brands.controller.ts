import { Controller, Get, Param, Query, ParseIntPipe, Optional } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { BrandResponseDto, BrandListResponseDto } from './dto/brand-response.dto';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category slug' })
  @ApiResponse({ status: 200, description: 'List of brands', type: BrandListResponseDto })
  async findAll(@Query('category') category?: string): Promise<BrandListResponseDto> {
    return this.brandsService.findAll(category);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get brand by slug' })
  @ApiResponse({ status: 200, description: 'Brand details', type: BrandResponseDto })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async findOne(@Param('slug') slug: string): Promise<BrandResponseDto> {
    return this.brandsService.findOne(slug);
  }
}
