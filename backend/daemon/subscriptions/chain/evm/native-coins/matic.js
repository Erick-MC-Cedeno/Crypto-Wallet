const {
    Queue,
    Wallet,
    uuidv4,
    connectDB,
    getWeb3WssInstance
} = require('./index')

const chainId = 80002
const coin = 'MATIC'

const transactionsQueue = new Queue('matic-transactions')

connectDB.then(() => {
    const web3 = getWeb3WssInstance(process.env.POLYGON_WSS)

    web3.eth.subscribe('logs', {
        topics: [
            web3.utils.sha3('DepositedOnBlockVault()')
        ]
    }, async function (error, result) {
        if (!error) {
            Wallet.find({ chainId, coin }, function (err, wallets) {
                if (wallets) {
                    const wallet = wallets.find(
                        wallet => wallet.address === result.address
                    )

                    if (wallet) {
                        transactionsQueue.add('transaction', {
                            walletAddress: wallet.address,
                            transactionHash: result.transactionHash,
                            chainId,
                            coin,
                            uuid: uuidv4()
                        }, {
                            attempts: 2,
                            backoff: {
                                type: 'exponential',
                                delay: 5000
                            }
                        })
                    }
                }
            })
        }
    })
})