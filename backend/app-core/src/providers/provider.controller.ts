import { Controller, Post, Body, Get, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/provider.dto';
import { Provider } from './schemas/provider.schema';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async createProvider(
    @Body() createProviderDto: CreateProviderDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Provider> {
    console.log(file);
    return this.providerService.createProvider(createProviderDto);
  }

  @Get('all')
  async findAllProviders(): Promise<Provider[]> {
    return this.providerService.findAllProviders();
  }

  @Get('find/:id')
  async findProviderById(@Param('id') id: string): Promise<Provider> {
    return this.providerService.findProviderById(id);
  }
}
