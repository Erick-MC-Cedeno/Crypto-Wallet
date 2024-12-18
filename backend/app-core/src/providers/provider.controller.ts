import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/provider.dto';
import { Provider } from './schemas/provider.schema';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Chat } from './schemas/chat-schema/chat.schema';
import { Message } from './schemas/chat-schema/message.schema';
import { AuthenticatedGuard } from '../guard/auth/authenticated.guard';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @UseGuards(AuthenticatedGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createProvider(
    @Body() createProviderDto: CreateProviderDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Provider> {
    console.log(file); 
    return this.providerService.createProvider(createProviderDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  async findAllProviders(): Promise<Provider[]> {
    return this.providerService.findAllProviders();
  }

  @Get('find/:email') 
  async findProviderByEmail(@Param('email') email: string): Promise<Provider> {
    return this.providerService.findProviderByEmail(email); 
  }

  @UseGuards(AuthenticatedGuard)
  @Post('chat/open')
  async openChat(
    @Body('userEmail') userEmail: string,  
    @Body('providerEmail') providerEmail: string, 
  ): Promise<{ chat: Chat }> { 
    return this.providerService.openChat(userEmail, providerEmail); 
  }

  @UseGuards(AuthenticatedGuard)
  @Post('chat/send')
  async sendMessage(
    @Body('senderId') senderId: string,
    @Body('chatId') chatId: string,
    @Body('messageContent') messageContent: string,
  ): Promise<Message> {
    return this.providerService.sendMessage(senderId, chatId, messageContent);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('chat/messages/:chatId')
  async getMessages(@Param('chatId') chatId: string): Promise<Message[]> {
    return this.providerService.getMessages(chatId);
  }
}
