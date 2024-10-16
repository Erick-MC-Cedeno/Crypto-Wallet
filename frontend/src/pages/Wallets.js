import React, { useState, useEffect } from 'react';
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
import robotImage from '../assets/robot.png';

const Wallets = () => {
    const history = useHistory();
    const { walletBalance } = useAllWallets();
    const defaultCoin = getDefaultCoin();
    const [selectedCoin, setSelectedCoin] = useState(defaultCoin);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const handleCoinChange = (e) => setSelectedCoin(e.target.value);
    const handleCreateWallet = () => history.push(`/wallet/${selectedCoin}`);
    const handleBack = () => history.push('/');

    
    const texts = [
        "Utiliza nuestro servicio P2P para comprar y vender tokens directamente entre usuarios.",
        "El RPC (Remote Procedure Call) es el canal de comunicación entre tu wallet y la blockchain.",
        "Recuerda que mantener tus contraseñas seguras y únicas es fundamental.",
        "Nuestra crypto wallet basada en tecnología EVM está diseñada para brindarte seguridad, facilidad de uso."
    ];
    

    const [textIndex, setTextIndex] = useState(0);
    const [visibleText, setVisibleText] = useState(texts[0]);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeOutDuration = 1000;
        const displayDuration = textIndex === 1 ? 8000 : 5000;

        const timeout1 = setTimeout(() => {
            setFadeOut(true);
        }, displayDuration);

        const timeout2 = setTimeout(() => {
            setTextIndex((prev) => (prev + 1) % texts.length);
            setFadeOut(false);
        }, displayDuration + fadeOutDuration);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, [textIndex, texts]);

    useEffect(() => {
        setVisibleText(texts[textIndex]);
    }, [textIndex, texts]);

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={12}>
                <Paper sx={{ p: 5, borderRadius: 2, boxShadow: 3, border: '2px solid #3f51b5', height: 'auto', minHeight: '700px', width: '100%' }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box textAlign={isMobile ? 'center' : 'left'} p={3} border="1px solid #ddd" borderRadius={2}>
                                <Typography variant="h6" color="black">
                                    Balance Total
                                </Typography>
                                <Typography variant="h4" fontWeight={500}> 
                                    {'$'}{parseFloat(walletBalance).toFixed(2)}
                                </Typography>
                            </Box>
                            <Box textAlign={isMobile ? 'center' : 'left'} mt={3} p={3} border="1px solid #ddd" borderRadius={2}>
                            <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                                backgroundColor: '#3F51B5',
                                padding: '8px 16px',
                                borderRadius: 2,
                            }}
                        >
                            <img
                            src={robotImage}
                            alt="Robot"
                            width={110}
                            style={{ marginRight: 16 }}
                        />
                        <Typography
                        variant="body1"
                        color="white"
                        style={{ transition: 'opacity 1s', opacity: fadeOut ? 0 : 1 }}
                        >
                        {visibleText}
                        </Typography>
                         </Box>
                    </Box>

                   </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" flexDirection="column" alignItems={isMobile ? 'center' : 'flex-start'} p={3} border="1px solid #ddd" borderRadius={2}>
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