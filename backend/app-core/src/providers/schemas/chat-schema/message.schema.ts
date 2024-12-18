import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  chatId: string;

  @Prop({ required: true, unique: true })
  hash: string;

  @Prop({ default: Date.now })
  timeStamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
