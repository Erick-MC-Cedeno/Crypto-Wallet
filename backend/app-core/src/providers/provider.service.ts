import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProviderDto } from './dto/provider.dto';
import { Provider, ProviderDocument } from './schemas/provider.schema';

@Injectable()
export class ProviderService {
  constructor(
    @InjectModel(Provider.name) private providerModel: Model<ProviderDocument>,
  ) {}

  async createProvider(createProviderDto: CreateProviderDto): Promise<Provider> {
    const createdProvider = new this.providerModel(createProviderDto);
    return createdProvider.save();
  }

  async findAllProviders(): Promise<Provider[]> {
    return this.providerModel.find({ isValid: true }).exec();
  }

  async findProviderById(id: string): Promise<Provider> {
    return this.providerModel.findById(id).exec();
  }
}
