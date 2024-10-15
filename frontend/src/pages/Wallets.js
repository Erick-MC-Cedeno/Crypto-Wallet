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
    MenuItem,
    useMediaQuery
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
    
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const handleCoinChange = (e) => setSelectedCoin(e.target.value);
    const handleCreateWallet = () => history.push(`/wallet/${selectedCoin}`);
    const handleBack = () => history.push('/');

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={12}>
                <Paper sx={{ p: 5, borderRadius: 2, boxShadow: 3, border: '2px solid #3f51b5', height: 'auto', minHeight: '700px', width: '100%' }}>
                    <Grid container spacing={4}>
                        {/* Contenedor para Balance */}
                        <Grid item xs={12} md={6}>
                            <Box textAlign={isMobile ? 'center' : 'left'} p={3} border="1px solid #ddd" borderRadius={2}>
                                <Typography variant="h6" color="black">
                                    Balance Total
                                </Typography>
                                <Typography variant="h4" fontWeight={500}> 
                                    {'$'}{parseFloat(walletBalance).toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Contenedor para Select y Botones */}
                        <Grid item xs={12} md={6}>
                            <Box display="flex" flexDirection="column" alignItems={isMobile ? 'center' : 'flex-start'} p={3} border="1px solid #ddd" borderRadius={2}>
                                {/* Selector de monedas */}
                                <FormControl size="medium" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>
                                    <InputLabel id="select-coin-label">Selecciona una wallet</InputLabel>
                                    <Select
                                        labelId="select-coin-label"
                                        id="select-coin"
                                        value={selectedCoin}
                                        onChange={handleCoinChange}
                                        label="Selecciona una wallet"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {getCoinList().map((coin) => (
                                            <MenuItem key={coin} value={coin}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <img
                                                        width={24}
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

                                {/* Botones: Ajustados hacia la izquierda y reordenados */}
                                <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="flex-start" gap={1} width="100%" ml={isMobile ? 0 : 1}>
                                    <Button
                                        onClick={handleCreateWallet} 
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            width: isMobile ? '100%' : '120px',
                                            height: 40,
                                            fontSize: '0.8rem',
                                            borderRadius: '8px',
                                            bgcolor: '#3F51B5',
                                            '&:hover': { bgcolor: '#303F9F' },
                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                        }}
                                    >
                                        DEPOSITAR
                                    </Button>
                                    <Button
                                        onClick={handleCreateWallet}
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            width: isMobile ? '100%' : '120px',
                                            height: 40,
                                            fontSize: '0.8rem',
                                            borderRadius: '8px',
                                            bgcolor: '#3F51B5',
                                            '&:hover': { bgcolor: '#303F9F' },
                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                        }}
                                    >
                                        RETIRAR
                                    </Button>
                                    <Button
                                        onClick={handleBack}
                                        variant="outlined"
                                        color="primary"
                                        sx={{
                                            width: isMobile ? '100%' : '100px',
                                            height: 40,
                                            fontSize: '0.8rem',
                                            borderRadius: '8px',
                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                        }}
                                    >
                                        REGRESAR
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />
                    <Box>
                        <Typography variant="h6" fontWeight={600} color="black" align="center" mb={2}>
                            Tus Billeteras
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: '300px' }}>
                            <MyWallets />
                        </Box>
                    </Box>
                </Paper>
            </Grid>
            <Box m={3} />
        </Grid>
    );
};

export default Wallets;
