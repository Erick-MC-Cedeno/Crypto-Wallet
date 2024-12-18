import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider } from './schemas/provider.schema';
import { CreateProviderDto } from './dto/provider.dto';
import { Chat, ChatDocument } from './schemas/chat-schema/chat.schema';
import { Message, MessageDocument } from './schemas/chat-schema/message.schema';

@Injectable()
export class ProviderService {
  constructor(
    @InjectModel('Provider') private providerModel: Model<Provider>,
    @InjectModel('Chat') private chatModel: Model<ChatDocument>,
    @InjectModel('Message') private messageModel: Model<MessageDocument>,
  ) {}

  async createProvider(createProviderDto: CreateProviderDto): Promise<Provider> {
    const provider = new this.providerModel(createProviderDto);
    return provider.save();
  }

  async findAllProviders(): Promise<Provider[]> {
    return this.providerModel.find().exec();
  }

  async findProviderByEmail(email: string): Promise<Provider> {
    return this.providerModel.findOne({ email }).exec();
  }

  async openChat(userEmail: string, providerEmail: string): Promise<{ chat: Chat & { chatId: string } }> {
    const chat = await this.findOrCreateChat(userEmail, providerEmail);
    const usersDetails = await this.providerModel.find({ 
      email: { $in: [userEmail, providerEmail] } 
    }).exec();
    const users = usersDetails.map(user => user._id.toString()); 
    return {
      chat: {
        chatId: chat._id.toString(),
        chatName: chat.chatName,
        users: users,  
        latestMessage: chat.latestMessage,
        photo: chat.photo,
        timeStamp: chat.timeStamp,
      },
    };
  }

  private async findOrCreateChat(userEmail: string, providerEmail: string): Promise<ChatDocument> {
    let chat = await this.chatModel.findOne({
      users: { $all: [userEmail, providerEmail] },
    });
    if (!chat) {
      const user = await this.providerModel.findOne({ email: userEmail }).exec();
      const provider = await this.providerModel.findOne({ email: providerEmail }).exec();

      chat = new this.chatModel({
        chatName: `Chat with ${user.firstName} ${user.lastName} and ${provider.firstName} ${provider.lastName}`,
        users: [user._id, provider._id], 
        latestMessage: null,
        photo: '',
        timeStamp: new Date(),
      });
      await chat.save();
    }

    return chat;
  }


  async sendMessage(senderId: string, chatId: string, messageContent: string): Promise<Message> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new Error('Chat not found');
    }
    if (!chat.users.includes(senderId)) {
      throw new Error('User is not part of this chat');
    }
    const hash = this.generateHash(messageContent);
    const message = new this.messageModel({
      sender: senderId,
      message: messageContent,
      chatId: chatId,
      hash: hash,
      timeStamp: new Date(),
    });
    const savedMessage = await message.save();
    await this.chatModel.findByIdAndUpdate(chatId, { latestMessage: savedMessage._id });
    return savedMessage;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.messageModel.find({ chatId }).exec(); 
  }

  private generateHash(messageContent: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(messageContent).digest('hex');
  }
}
