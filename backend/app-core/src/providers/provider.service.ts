import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProviderDto } from './dto/provider.dto';
import { Provider, ProviderDocument } from './schemas/provider.schema';
import { Chat, ChatDocument } from './schemas/chat-schema/chat.schema';
import { Message, MessageDocument } from './schemas/chat-schema/message.schema';
import * as crypto from 'crypto';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class ProviderService {
  constructor(
    @InjectModel(Provider.name) private providerModel: Model<ProviderDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>, 
  ) {}

  async createProvider(createProviderDto: CreateProviderDto): Promise<Provider> {
    const createdProvider = new this.providerModel(createProviderDto);
    return createdProvider.save();
  }

  async findAllProviders(): Promise<Provider[]> {
    return this.providerModel.find({ isValid: true }).exec();
  }

  async findProviderByEmail(email: string): Promise<Provider> {
    const provider = await this.providerModel.findOne({ email }).exec();
    if (!provider) {
      throw new NotFoundException(`Provider with email ${email} not found`);
    }
    return provider;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async openChat(userEmail: string, providerEmail: string): Promise<{ chat: Chat }> {
    const provider = await this.findProviderByEmail(providerEmail); 
    if (!provider) {
        throw new NotFoundException(`Provider with email ${providerEmail} not found`);
    }

    const user = await this.findUserByEmail(userEmail); 
    if (!user) {
        throw new NotFoundException(`User with email ${userEmail} not found`);
    }

    console.log(`User found: ${user.firstName} ${user.lastName}`);
    console.log(`Provider found: ${provider.firstName} ${provider.lastName}`);

    const existingChats = await this.chatModel.aggregate([
        { $match: { users: { $all: [user._id, provider._id] } } }, 
        { $limit: 1 },
    ]);

    if (existingChats.length > 0) {
        return { chat: existingChats[0] }; 
    }

    const providerName = provider.firstName && provider.lastName 
        ? `${provider.firstName} ${provider.lastName}` 
        : 'Unknown Provider';

    const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : 'Unknown User';

    const newChat = new this.chatModel({
        chatName: `Chat with ${userName} and ${providerName}`,
        users: [user.email, provider.email],
        latestMessage: null,
        photo: provider.photo || '',
        timeStamp: new Date(),
    });

    try {
        await newChat.save();
    } catch (error) {
        throw new ConflictException('Could not create chat');
    }

    
    const chatResponse = {
        chat: {
            chatName: newChat.chatName,
            chatId: newChat._id.toString(), 
            users: newChat.users,
            latestMessage: newChat.latestMessage,
            photo: newChat.photo,
            timeStamp: newChat.timeStamp,
            createdAt: newChat.createdAt,
            updatedAt: newChat.updatedAt,
            __v: newChat.__v,
        }
    };

    return chatResponse; 
}

  async sendMessage(
    senderEmail: string,
    chatId: string,
    messageContent: string,
  ): Promise<Message> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const messageHash = crypto
      .createHash('sha256')
      .update(`${senderEmail}-${messageContent}-${Date.now()}`)
      .digest('hex');

    const existingMessage = await this.messageModel.findOne({ hash: messageHash }).exec();
    if (existingMessage) {
      throw new ConflictException('Duplicate message detected');
    }

    const newMessage = new this.messageModel({
      sender: senderEmail,
      message: messageContent,
      chatId: chat._id,
      hash: messageHash,
      timeStamp: new Date(),
    });
    await newMessage.save();
    chat.latestMessage = newMessage._id;
    await chat.save();
    return newMessage;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
  
    const chatMessages = await this.messageModel.find({ chatId }).sort({ timeStamp: 1 }).exec();
    return chatMessages;
  }
  
}
