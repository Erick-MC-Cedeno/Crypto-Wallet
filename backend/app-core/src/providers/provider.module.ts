import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { Provider, ProviderSchema } from './schemas/provider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Provider.name, schema: ProviderSchema }]),
  ],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
