import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProviderDocument = Provider & Document;

@Schema()
export class Provider {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  idNumber: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  streetName: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ default: '', required: false }) // Propiedad photo
  photo?: string;

  @Prop({ default: false })
  isValid: boolean;

  
  _id?: string; 

  // Propiedad calculada para el nombre completo
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
