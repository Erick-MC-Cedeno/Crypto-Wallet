const chains = require('./chains/get')

module.exports = {
    contracts_build_directory: `contracts/abis`,
    networks: chains,
    compilers: {
        solc: {
            version: '0.8.33',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    }
}