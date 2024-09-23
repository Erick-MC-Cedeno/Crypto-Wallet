const {
    Worker,
    connectDB,
    createTransaction,
    processDeposit,
    processWithdraw
} = require('./index')

connectDB.then(() => {
    new Worker('op-transactions', async (job) => {
        return await createTransaction(job.data)
    })

    new Worker('op-deposits', async (job) => {
        return await processDeposit(job.data)
    })

    new Worker('op-withdraws', async (job) => {
        return await processWithdraw(job.data)
    })

})