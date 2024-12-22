import axios from 'axios'
axios.defaults.withCredentials = true

const baseApi = 'http://192.168.100.2:4000/secure/api'

// Endpoints usuario
const loginApi = `${baseApi}/user/login`
const logoutApi = `${baseApi}/user/logout`
const registerApi = `${baseApi}/user/register`
const userInfoApi = `${baseApi}/user/info`
const updateUserProfileApi = `${baseApi}/user/update-profile`
const changePasswordApi = `${baseApi}/user/change-password`;
const verifyTokenApi = `${baseApi}/user/verify-token`;
const updateTokenStatusApi = `${baseApi}/user/update-token-status`;
const resendTokenApi = `${baseApi}/user/resend-token`
const verifyEmailApi = `${baseApi}/user/verify-email`;
const sendVerificationEmailApi = `${baseApi}/user/send-verification-email`;
const isEmailVerifiedApi = `${baseApi}/user/is-email-verified`;

// Endpoints wallet
const walletInfoApi = `${baseApi}/wallet/info`
const allWalletInfoApi = `${baseApi}/wallet/all`
const walletCreateApi = `${baseApi}/wallet/create`
const withdrawApi = `${baseApi}/wallet/withdraw`

// Endpoints transacción
const transactionsApi = `${baseApi}/transaction/all`
const transactionApi = `${baseApi}/transaction/info`

// Endpoints provider
const providerApi = `${baseApi}/provider`;
const createProviderApi = `${providerApi}/create`;
const getAllProvidersApi = `${providerApi}/all`;
const findProviderByEmailApi = (email) => `${providerApi}/find/${email}`;
const openChatApi = `${providerApi}/chat/open`;
const sendMessageApi = `${providerApi}/chat/send`;
const getMessagesApi = (chatId) => `${providerApi}/chat/messages/${chatId}`;
const sendMessageAsProviderApi = `${providerApi}/chat/send-as-provider`;
const getChatDetailsByEmailApi = (email) => `${providerApi}/chat/details-by-email/${email}`;

const priceApi = 'https://min-api.cryptocompare.com/data/price?tsyms=USD&fsym='

async function get(url, body) {
    return await axios.get(url, {
        params: body || {}
    })
}

async function post(url, body) {
    return await axios.post(url, body)
}

async function patch(url, body) {
    return await axios.patch(url, body)
}

export {
    get,
    post,
    patch,
    priceApi,
    loginApi,
    logoutApi,
    registerApi,
    userInfoApi,
    withdrawApi,
    walletInfoApi,
    walletCreateApi,
    transactionsApi,
    allWalletInfoApi,
    transactionApi,
    providerApi,
    createProviderApi,
    getAllProvidersApi,
    findProviderByEmailApi,
    openChatApi,
    sendMessageApi,
    getMessagesApi,
    verifyTokenApi,
    changePasswordApi,
    updateTokenStatusApi,
    resendTokenApi,
    updateUserProfileApi,
    verifyEmailApi,
    sendVerificationEmailApi,
    isEmailVerifiedApi,
    sendMessageAsProviderApi,
    getChatDetailsByEmailApi,
};