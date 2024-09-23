import React, { useState } from 'react';
import { Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import TotalBalance from './TotalBalance';
import MyWallets from './MyWallets';


const pairs = [
    { label: 'Bitcoin (BTC)', value: 'BINANCE:BTCUSDT', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { label: 'Ethereum (ETH)', value: 'BINANCE:ETHUSDT', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { label: 'Polygon (MATIC)', value: 'BINANCE:MATICUSDT', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
    { label: 'Binance (BNB)', value: 'BINANCE:BNBUSDT', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
    { label: 'Fantom (FTM)', value: 'BINANCE:FTMUSDT', logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.png' },
    { label: 'Avalanche (AVAX)', value: 'BINANCE:AVAXUSDT', logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
     {label: 'Optimism (OP)', value: 'BINANCE:OPUSDT', logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png'}
];

function Dashboard() {
    
    const [selectedSymbol, setSelectedSymbol] = useState(pairs[0].value);

    const handleSymbolChange = (event) => {
        setSelectedSymbol(event.target.value);
    };

    const tradingViewUrl = `https://s.tradingview.com/widgetembed/?symbol=${selectedSymbol}`;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={9}> 
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 500, 
                                borderRadius: 2,
                                boxShadow: 3,
                                position: 'relative',
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                TradingView Chart
                            </Typography>
                            <FormControl
                                variant="outlined"
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    width: 250, 
                                    '& .MuiSelect-select': {
                                        padding: '8px 16px',
                                    },
                                }}
                            >
                                <InputLabel>Choose Crypto</InputLabel>
                                <Select
                                    value={selectedSymbol}
                                    onChange={handleSymbolChange}
                                    label="Choose Crypto"
                                    sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
                                >
                                    {pairs.map((pair) => (
                                        <MenuItem key={pair.value} value={pair.value}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img
                                                    src={pair.logo}
                                                    alt={pair.label}
                                                    style={{ width: 24, height: 24, marginRight: 8 }}
                                                />
                                                {pair.label}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box
                                component="iframe"
                                src={tradingViewUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowtransparency="true"
                                scrolling="no"
                                allowFullScreen
                                sx={{
                                    border: '1px solid #ddd', 
                                    borderRadius: 1, 
                                    backgroundColor: '#fff',
                                }}
                                title="TradingView Chart"
                            />
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={3}> 
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 300,
                                borderRadius: 2,
                                boxShadow: 3,
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Total Balance
                            </Typography>
                            <TotalBalance />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        My Wallets
                    </Typography>
                    <MyWallets />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Dashboard;
