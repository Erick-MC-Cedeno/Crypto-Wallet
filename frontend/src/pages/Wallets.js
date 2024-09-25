import React, { useState } from 'react';
import useAllWallets from '../hooks/useAllWallets';
import {
    Typography,
    Paper,
    Box,
    Grid,
    Button,
    Divider,
    Select,
    FormControl,
    InputLabel,
    MenuItem
} from '@mui/material';
import {
    getCoinList,
    getDefaultCoin,
    getCoinLogo,
    getDefaultNetworkId,
    getNetworkName
} from '../components/utils/Chains';
import { useHistory } from 'react-router-dom';
import MyWallets from '../components/MyWallets';

const Wallets = () => {
    const history = useHistory();
    const { walletBalance } = useAllWallets();
    const defaultCoin = getDefaultCoin();
    const [selectedCoin, setSelectedCoin] = useState(defaultCoin);

    const handleCoinChange = (e) => setSelectedCoin(e.target.value);
    const handleCreateWallet = () => history.push(`/wallet/${selectedCoin}`);

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, mb: 2, borderRadius: 2, boxShadow: 3, border: '2px solid #FFFFFFFF' }}>
                    <Box textAlign="center" mb={2}>
                        <Typography variant="body2" color="text.secondary">
                            Balance Total
                        </Typography>
                        <Typography variant="h5" fontWeight={500}>
                            {'$'}{parseFloat(walletBalance).toFixed(2)}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                    </Box>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <FormControl size="small" sx={{ maxWidth: 300 }}>
                            <InputLabel id="select-coin-label">Selecciona una moneda</InputLabel>
                            <Select
                                labelId="select-coin-label"
                                id="select-coin"
                                value={selectedCoin}
                                onChange={handleCoinChange}
                                label="Selecciona una moneda"
                            >
                                {getCoinList().map((coin) => (
                                    <MenuItem key={coin} value={coin}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                width={20}
                                                src={getCoinLogo(coin)}
                                                alt={`${coin} logo`}
                                                style={{ marginRight: 8 }}
                                            />
                                            <span>{coin.toUpperCase()} • {getNetworkName(getDefaultNetworkId(coin))}</span>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box textAlign="center">
                        <Button
                            onClick={handleCreateWallet}
                            color="info"
                            variant="contained"
                            fullWidth
                            sx={{ maxWidth: 300, mx: 'auto' }}
                        >
                            RETIRAR DE ({selectedCoin.toUpperCase()})
                        </Button>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, border: '2px solid #FFFFFFFF' }}>
                    <MyWallets />
                </Paper>
            </Grid>
            <Box m={3} />
        </Grid>
    );
};

export default Wallets;
