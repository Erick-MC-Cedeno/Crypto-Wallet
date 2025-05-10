import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true })
  chatName: string;

  @Prop({ required: true, type: [String] })
  users: string[];

  @Prop({ type: String, default: null })
  latestMessage: string;

  @Prop({ type: String, default: '' })
  photo: string;

  @Prop({ default: Date.now })
  timeStamp: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ required: true })  
  chatroomId: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
