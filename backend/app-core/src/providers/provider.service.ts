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
    await createdProvider.save();
    await this.openChat(createProviderDto.email, createProviderDto.email);
    return createdProvider;
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

  async openChat(userEmail: string, providerEmail: string): Promise<{ chat: any }> {
    const existingChat = await this.chatModel.findOne({
      users: { $all: [userEmail, providerEmail] },
    }).exec();
  
    if (existingChat) {
      const chatResponse = {
        chat: {
          chatName: existingChat.chatName,
          chatId: existingChat._id.toString(),
          users: existingChat.users,
          latestMessage: existingChat.latestMessage,
          photo: existingChat.photo,
          timeStamp: existingChat.timeStamp,
          createdAt: existingChat.createdAt,
          updatedAt: existingChat.updatedAt,
          __v: existingChat.__v,
        },
      };
      return chatResponse;
    }
    const provider = await this.findProviderByEmail(providerEmail);
    if (!provider) {
      throw new NotFoundException(`Provider with email ${providerEmail} not found`);
    }
    const user = await this.findUserByEmail(userEmail);
    if (!user) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
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
      },
    };
    return chatResponse;
  }

  
  async getMessagesAsProvider(providerEmail: string): Promise<any[]> {
    const provider = await this.findProviderByEmail(providerEmail);
    if (!provider) {
      throw new NotFoundException(`Provider with email ${providerEmail} not found`);
    }
    const chats = await this.chatModel.find({ users: providerEmail }).exec();
    if (chats.length === 0) {
      return [];
    }
    const chatDetails = [];
    for (const chat of chats) {
      const messages = await this.messageModel.find({ chatId: chat._id }).sort({ timeStamp: 1 }).exec();
      chatDetails.push({
        chatId: chat._id.toString(),
        chatName: chat.chatName,
        users: chat.users,
        messages: messages.map(message => ({
          sender: message.sender,
          message: message.message,
          timeStamp: message.timeStamp,
        })),
      });
    }
    return chatDetails;
  }


  async sendMessageAsProvider(providerEmail: string, chatId: string, messageContent: string, userEmail: string): Promise<Message> {
    const provider = await this.findProviderByEmail(providerEmail);
    if (!provider) {
      throw new NotFoundException(`Provider with email ${providerEmail} not found`);
    }
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if (!chat.users.includes(providerEmail) || !chat.users.includes(userEmail)) {
      throw new ConflictException('Proveedor aún no seleccionado');
    }
    const messageHash = crypto.createHash('sha256').update(`${providerEmail}-${messageContent}-${Date.now()}`).digest('hex');
    const existingMessage = await this.messageModel.findOne({ hash: messageHash }).exec();
    if (existingMessage) {
      throw new ConflictException('Duplicate message detected');
    }
    const newMessage = new this.messageModel({
      sender: providerEmail,
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


  
  async getMessagesAsUser(userEmail: string): Promise<any[]> {
    const user = await this.findUserByEmail(userEmail);
    if (!user) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
    }
    const chats = await this.chatModel.find({ users: userEmail }).exec();
    if (chats.length === 0) {
      return [];
    }
    const chatDetails = [];
    for (const chat of chats) {
      const messages = await this.messageModel.find({ chatId: chat._id }).sort({ timeStamp: 1 }).exec();
      chatDetails.push({
        chatId: chat._id.toString(),
        chatName: chat.chatName,
        users: chat.users,
        messages: messages.map(message => ({
          sender: message.sender,
          message: message.message,
          timeStamp: message.timeStamp,
        })),
      });
    }
    return chatDetails;
  }


  async sendMessageAsUser(userEmail: string, chatId: string, messageContent: string): Promise<Message> {
    const user = await this.findUserByEmail(userEmail);
    if (!user) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
    }
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if (!chat.users.includes(userEmail)) {
      throw new ConflictException('El correo no pertenece a este chat');
    }
    const messageHash = crypto.createHash('sha256').update(`${userEmail}-${messageContent}-${Date.now()}`).digest('hex');
    const existingMessage = await this.messageModel.findOne({ hash: messageHash }).exec();
    if (existingMessage) {
      throw new ConflictException('Duplicate message detected');
    }
    const newMessage = new this.messageModel({
      sender: userEmail,
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


  async sendMessage(senderEmail: string, chatId: string, messageContent: string): Promise<Message> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if (!chat.users.includes(senderEmail)) {
      throw new ConflictException('El correo no pertenece a este chat');
    }
    const messageHash = crypto.createHash('sha256').update(`${senderEmail}-${messageContent}-${Date.now()}`).digest('hex');
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
    return this.messageModel.find({ chatId }).sort({ timeStamp: 1 }).exec();
  }


  async getChatDetailsByEmail(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const chats = await this.chatModel.find({ users: email }).sort({ timeStamp: -1 }).exec();
    if (chats.length === 0) {
      return [];
    }
    return chats.map(chat => ({
      chatName: chat.chatName,
      chatId: chat._id.toString(),
      users: chat.users,
      latestMessage: chat.latestMessage,
      photo: chat.photo,
      timeStamp: chat.timeStamp,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      __v: chat.__v,
    }));
  }
}