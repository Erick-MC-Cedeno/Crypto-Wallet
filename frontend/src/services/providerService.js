import {
    get,
    post,
    createProviderApi,
    getAllProvidersApi,
    findProviderByEmailApi,
    openChatApi,
    sendMessageApi,
    getMessagesApi,
} from '../api/http';

export default class ProviderService {
  
    static async createProvider(body) {
        return await post(createProviderApi, body);
    }

   
    static async getAllProviders() {
        return await get(getAllProvidersApi, {});
    }

    
    static async findProviderByEmail(email) {
        return await get(findProviderByEmailApi(email), {});
    }

    
    static async openChat(userEmail, providerEmail) {
        return await post(openChatApi, { userEmail, providerEmail });
    }
    
    

    static async sendMessage(senderEmail, chatId, messageContent) {
        return await post(sendMessageApi, { senderEmail, chatId, messageContent });
    }

    
    static async getMessages(chatId) {
        return await get(getMessagesApi(chatId), {});
    }
}