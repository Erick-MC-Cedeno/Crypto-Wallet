import {
    get,
    post,
    createProviderApi,
    getAllProvidersApi,
    findProviderByEmailApi,
    openChatApi,
    sendMessageApi,
    getMessagesApi,
    sendMessageAsProviderApi,
    getChatDetailsByEmailApi
} from '../api/http';

export default class Provider {
    static async createProvider(body) {
        return await post(createProviderApi, body);
    }

    static async getAllProviders() {
        return await get(getAllProvidersApi, {});
    }

    static async findProviderByEmail(email) {
        return await get(findProviderByEmailApi.replace(':email', email), {});
    }

    static async openChat(body) {
        return await post(openChatApi, body);
    }

    static async sendMessage(body) {
        return await post(sendMessageApi, body);
    }

    static async sendMessageAsProvider(body) {
        return await post(sendMessageAsProviderApi, body);
    }

    static async getMessages(chatId) {
        return await get(getMessagesApi.replace(':chatId', chatId), {});
    }

    static async getChatDetailsByEmail(email) {
        return await get(getChatDetailsByEmailApi.replace(':email', email), {});
    }

}