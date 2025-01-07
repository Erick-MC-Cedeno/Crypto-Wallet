import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    let data = await this.userModel.aggregate([
      { $match: { email: createProviderDto.email } },
      { $unwind: '$providers' },
      { $project: { _id: 0 } },
      {
        $lookup: {
          from: 'providers',
          localField: 'providers',
          foreignField: '_id',
          as: 'providersData',
          pipeline: [
            {
              $match: {
                email: createProviderDto.email
              }
            }
          ]
        }
      }
    ]).exec();

    let exists = true;
    if (!data || data.length === 0) exists = false;

    let provider = exists ? data.find(p => p.providersData.length > 0) : undefined;
    if (provider) {
      provider = provider.providersData[0];
      return provider;
    } else {
      const createdProvider = new this.providerModel(createProviderDto);
      const savedProvider = await createdProvider.save();

      if (savedProvider) {
        await this.userModel.updateOne(
          { email: createProviderDto.email },
          { $push: { providers: savedProvider } }
        );

        await this.openChat(createProviderDto.email, createProviderDto.email);
        return savedProvider;
      }
    }
  }



  async findAllProviders(): Promise<Provider[]> {
    const data = await this.providerModel.aggregate([
      { $match: { isValid: true } },
      {
        $lookup: {
          from: 'users', 
          localField: 'email',
          foreignField: 'email',
          as: 'userDetails'
        }
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } }, 
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          isValid: 1,
          photo: 1,
          'userDetails.someAdditionalField': 1 
        }
      }
    ]).exec();
  
    return data;
  }



  async findProviderByEmail(email: string): Promise<Provider> {
    const data = await this.providerModel.aggregate([
      { $match: { email } },
      {
        $lookup: {
          from: 'users', 
          localField: 'email',
          foreignField: 'email',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' }, 
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          isValid: 1,
          photo: 1,
          'userDetails.additionalField': 1 
        }
      }
    ]).exec();
    if (data.length === 0) {
      throw new NotFoundException(`Provider with email ${email} not found`);
    }
    return data[0];
  }


  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  

  async openChat(userEmail: string, providerEmail: string): Promise<{ chat: any }> {
    const data = await this.chatModel.aggregate([
      { $match: { users: { $all: [userEmail, providerEmail] } } },
      {
        $lookup: {
          from: 'users', 
          localField: 'users',
          foreignField: 'email',
          as: 'userDetails',
          pipeline: [
            { $project: { _id: 0, email: 1, firstName: 1, lastName: 1 } } 
          ]
        }
      },
      { $unwind: '$userDetails' }, 
      {
        $project: {
          chatName: 1,
          users: 1,
          latestMessage: 1,
          photo: 1,
          timeStamp: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1
        }
      }
    ]).exec();
    if (data && data.length > 0) {
      const existingChat = data[0];
      return {
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

  

  async sendMessageAsProvider(providerEmail: string, chatId: string, messageContent: string): Promise<Message> {
    const data = await this.chatModel.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: 'email',
          as: 'userData'
      }},
      { $project: { _id: 1, users: 1, latestMessage: 1, userData: 1 } }
    ]).exec();
    if (data.length === 0) {
      throw new NotFoundException('Chat not found');
    }
    const chat = data[0];
    if (!chat.users.includes(providerEmail)) {
      throw new ConflictException('Provider not part of this chat');
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
    await this.chatModel.updateOne(
      { _id: chat._id },
      { $set: { latestMessage: newMessage._id } }
    ).exec();
    return newMessage;
  }


  async sendMessage(senderEmail: string, chatId: string, messageContent: string): Promise<Message> {
    let objectId;
    try {
      objectId = new Types.ObjectId(chatId);
    } catch (error) {
      throw new NotFoundException('Invalid chat ID format');
    }
    const data = await this.chatModel.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: 'email',
          as: 'userData'
        }
      },
      { $project: { _id: 1, users: 1, latestMessage: 1, userData: 1 } }
    ]).exec();
    if (data.length === 0 || !data[0]) {
      throw new NotFoundException('Chat not found');
    }
    const chat = data[0];
    if (!chat.users.includes(senderEmail)) {
      throw new ConflictException('Sender not part of this chat');
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
    await this.chatModel.updateOne(
      { _id: chat._id },
      { $set: { latestMessage: newMessage._id } }
    ).exec();
    return newMessage;
  }



 async getMessages(chatId: string): Promise<any> {
  const chat = await this.chatModel.findById(chatId).exec();
  if (!chat) {
    throw new NotFoundException('Chat not found');
  }
  const messages = await this.messageModel.find({ chatId }).sort({ timeStamp: 1 }).exec();
  return {
    chatId: chat._id.toString(),
    chatName: chat.chatName,
    users: chat.users,
    messages: messages.map(message => ({
      sender: message.sender,
      message: message.message,
      timeStamp: message.timeStamp,
    })),
  };
}

async getChatDetailsByEmail(email: string): Promise<any> {
  if (!email) {
    return { message: 'Email is required to find user and chats', data: null };
  }
  const user = await this.userModel.findOne({ email }).exec();
  if (!user) {
    return { message: `User with email ${email} not found`, data: null };
  }
  const chats = await this.chatModel.find({ users: email }).sort({ timeStamp: -1 }).exec();
  if (chats.length === 0) {
    return { message: 'No chats found for this user', data: [] };
  }
  const chatDetails = chats.map(chat => ({
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

  return { message: 'Chats retrieved successfully', data: chatDetails };
}

} 