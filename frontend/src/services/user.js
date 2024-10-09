import {
    get,
    post,
    patch,
    registerApi,
    loginApi,
    logoutApi,
    userInfoApi,
    verifyTokenApi,
    changePasswordApi,
    updateTokenStatusApi,
    resendTokenApi,
    updateUserProfileApi,
    
} from '../api/http';

export default class User {
    static async register(body) {
        return await post(registerApi, body);
    }

    static async login(body) {
        return await post(loginApi, body);
    }

    static async verifyToken(body) {
        return await post(verifyTokenApi, body);
    }

    static async logout() {
        return await post(logoutApi, {});
    }

    static async getInfo() {
        return await get(userInfoApi, {});
    }

    static async changePassword(body) {
        return await post(changePasswordApi, body);
    }

    static async updateTokenStatus(body) { 
        return await patch(updateTokenStatusApi, body);
    }

    static async resendToken(body) {
        return await post(resendTokenApi, body);
    }

    static async updateProfile(body) {
        return await post(updateUserProfileApi, body);
    }
}
