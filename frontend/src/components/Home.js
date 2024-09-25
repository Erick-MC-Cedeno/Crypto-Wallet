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
    { label: 'Optimism (OP)', value: 'BINANCE:OPUSDT', logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png' }
];

function Dashboard() {
    const [selectedSymbol, setSelectedSymbol] = useState(pairs[0].value);

    const handleSymbolChange = (event) => {
        setSelectedSymbol(event.target.value);
    };

    const tradingViewUrl = `https://s.tradingview.com/widgetembed/?symbol=${selectedSymbol}`;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormControl
                    variant="outlined"
                    sx={{
                        mb: 1,
                        width: 250,
                        alignSelf: 'flex-end',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#f5f5f5',
                            '& fieldset': {
                                border: 'none',
                            },
                            '&:hover fieldset': {
                                border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                                border: 'none',
                            },
                        },
                    }}
                >
                    <InputLabel sx={{ backgroundColor: 'background.paper', paddingX: 1 }}>Choose Crypto</InputLabel>
                    <Select
                        value={selectedSymbol}
                        onChange={handleSymbolChange}
                        label="Choose Crypto"
                        sx={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: 2,
                            '& .MuiSelect-select': {
                                padding: '10px 14px',
                            },
                        }}
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
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={9}>
                        <Paper
                            sx={{
                                p: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 500,
                                borderRadius: 2,
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e0e0e0',
                                bgcolor: '#ffffff',
                            }}
                        >
                            <Box
                                component="iframe"
                                src={tradingViewUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowtransparency="true" // Cambiado aquí
                                scrolling="no"
                                allowFullScreen
                                sx={{
                                    border: 'none',
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
                                p: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 300,
                                borderRadius: 2,
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e0e0e0',
                                bgcolor: '#ffffff',
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 1 }}>
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
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e0e0e0',
                        bgcolor: '#ffffff',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        My Wallets
                    </Typography>
                    <MyWallets />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Dashboard;
