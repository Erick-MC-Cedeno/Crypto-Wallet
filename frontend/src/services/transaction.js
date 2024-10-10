import { get, transactionsApi, transactionApi, totalTransactionsApi } from '../api/http'

export default class Transaction {
    static async getCoinTransactions(coin) {
        return await get(transactionsApi,
            {
                coin
            })
    }

    static async getTransaction(transactionId) {
        return await get(transactionApi,
            {
                transactionId
            })
    }

    static async getTotalTransactions() {
        return await get(totalTransactionsApi);
    }

}