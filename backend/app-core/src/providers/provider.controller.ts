import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/provider.dto';
import { AuthenticatedGuard } from '../guard/auth/authenticated.guard';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @UseGuards(AuthenticatedGuard)
  @Post('create')
  createProvider(@Request() req, @Body() createProviderDto: CreateProviderDto) {
    createProviderDto.email = req.user.email;
    return this.providerService.createProvider(createProviderDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  findAllProviders() {
    return this.providerService.findAllProviders();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('findProviderByEmail/:email')
  findProviderByEmail(@Param('email') email: string) {
    return this.providerService.findProviderByEmail(email);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('user/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.providerService.findUserByEmail(email);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('chat/open')
  openChat(@Body() { userEmail, providerEmail }: { userEmail: string; providerEmail: string }) {
    return this.providerService.openChat(userEmail, providerEmail);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('messages/chat/:chatId')
  getMessages(@Param('chatId') chatId: string) {
    return this.providerService.getMessages(chatId);
  }


  @UseGuards(AuthenticatedGuard)
  @Post('message/send')
  sendMessage(
    @Body() { senderEmail, chatId, messageContent }: { senderEmail: string; chatId: string; messageContent: string }
  ) {
    return this.providerService.sendMessage(senderEmail, chatId, messageContent);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('message/sendAsProvider')
  sendMessageAsProvider(
    @Body() { providerEmail, chatId, messageContent }: { providerEmail: string; chatId: string; messageContent: string;  }
  ) {
    return this.providerService.sendMessageAsProvider(providerEmail, chatId, messageContent);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('chat/detailsbyemail/:email')
  async getChatDetailsByEmail(@Param('email') email: string) {
    return this.providerService.getChatDetailsByEmail(email);
  }
}