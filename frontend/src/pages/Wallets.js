import * as React from 'react';
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
    getCoinList, getDefaultCoin,
    getCoinLogo, getDefaultNetworkId,
    getNetworkName
} from '../components/utils/Chains';
import { useHistory } from 'react-router-dom';
import MyWallets from '../components/MyWallets';

export default function Wallets() {
    const history = useHistory();
    const { walletBalance } = useAllWallets();
    const defaultCoin = getDefaultCoin();
    const [selectedCoin, setSelectedCoin] = React.useState(defaultCoin);

    const handleCoinChange = (e) => {
        setSelectedCoin(e.target.value);
    }

    const handleCreateWallet = () => {
        history.push(`/wallet/${selectedCoin}`);
    }

    return (
        <React.Fragment>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, mb: 2, maxWidth: 500, mx: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
                        <Box textAlign="center" mb={2}>
                            <Typography variant="body2" color="text.secondary" mb={0.5}>
                                Balance Total
                            </Typography>
                            <Typography variant="h5" fontWeight={500}>
                                {'$'}{parseFloat(walletBalance).toFixed(2)}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                        </Box>
                        <Box display="flex" justifyContent="center" mb={2}>
                            <FormControl size="small" sx={{ maxWidth: 300 }}>
                                <InputLabel id="select-coin-label">
                                    Selecciona una moneda
                                </InputLabel>
                                <Select
                                    labelId="select-coin-label"
                                    id="select-coin"
                                    value={selectedCoin}
                                    onChange={handleCoinChange}
                                    label="Selecciona una moneda"
                                    aria-label="Selecciona una moneda"
                                >
                                    {getCoinList().map((coin) => (
                                        <MenuItem sx={{ display: 'flex', alignItems: 'center' }} key={coin} value={coin}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img width={20} src={getCoinLogo(coin)} alt={`${coin} logo`} style={{ marginRight: 8 }} />
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
                                aria-label={`Ir a mi billetera (${selectedCoin.toUpperCase()})`}
                            >
                                RETIRAR DE  ({selectedCoin.toUpperCase()})
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, maxWidth: 1200, mx: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
                        <MyWallets />
                    </Paper>
                </Grid>
            </Grid>
            <Box m={3} />
        </React.Fragment>
    );
}
