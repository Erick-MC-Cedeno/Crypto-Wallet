import { get, post, providerApi } from '../api/http';

export default class ProviderService {
    static async createProvider(providerData) {
        return await post(`${providerApi}/create`, providerData);
    }

    static async getAllProviders() {
        return await get(`${providerApi}/all`);
    }

    static async getProviderById(providerId) {
        return await get(`${providerApi}/find/${providerId}`);
    }
}
