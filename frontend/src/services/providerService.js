import {
    get,
    post,
    createProvider,
    getAllProviders,
    createChatApi,
    sendMessageAsUserApi,
    sendMessageAsProviderApi,
    getMessagesApi

} from '../api/http';

export default class Provider {
    static async createProvider(body) {
        const { data } = await post(createProvider, body)
        return data
    }

    static async getAllProviders() {
        const { data } = await get(getAllProviders)
        return data
    }

    static async createChat(body) {
        const { data } = await post(createChatApi, body)
        return data
    }

    static async sendMessageAsUser(body) {
        const { data } = await post(sendMessageAsUserApi, body)
        return data
    }

    static async sendMessageAsProvider(body) {
        const { data } = await post(sendMessageAsProviderApi, body)
        return data
    }

    static async getMessages(chatId) {
        const { data } = await get(getMessagesApi.replace(':chatId', chatId))
        return data
    }

}