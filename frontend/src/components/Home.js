import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import TotalBalance from './TotalBalance';
import MyWallets from './MyWallets';

const Dashboard = () => {
    const [displayText, setDisplayText] = useState('');
    const texts = [
        "La seguridad de tu cuenta es nuestra prioridad. Asegúrate de habilitar la autenticación de dos factores para proteger tus activos.",
        "Con las criptomonedas, puedes ahorrar y obtener más rendimientos. ¡Descubre el potencial de tu dinero!",
        "Utiliza nuestro servicio P2P para vender tus tokens por fiat de manera rápida y segura.",
        "La blockchain es una tecnología revolucionaria que permite transacciones seguras y transparentes. Aprende cómo aprovecharla para tus inversiones."
    ];
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < texts[textIndex].length) {
                setDisplayText(prev => prev + texts[textIndex].charAt(index));
                index++;
            } else {
                setTimeout(() => {
                    setTextIndex(prev => (prev + 1) % texts.length);
                    setDisplayText('');
                    index = 0;
                }, 2000);
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [textIndex]);

    return (
        <Grid container spacing={3} sx={{ padding: 2 }}>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5} lg={4}>
                        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 300, borderRadius: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0', bgcolor: '#ffffff' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Cuenta</Typography>
                            <TotalBalance />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={7} lg={8}>
                        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 300, borderRadius: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0', bgcolor: '#ffffff' }}>
                            <Typography variant="h6" sx={{ mb: 2, color: 'blue' }}>Bienvenido Crypto entusiasta</Typography>
                            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 'bold', color: '#333', transition: 'color 0.3s ease', '&:hover': { color: '#007bff' } }}>
                                {displayText}
                            </Typography>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 'auto' }}>
                                {['/wallets', '/wallets', '/settings'].map((link, index) => (
                                    <Link key={index} to={link} style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                mr: 1,
                                                bgcolor: 'blue',
                                                borderRadius: '12px', // Ajustar el borde redondeado aquí
                                                '&:hover': { bgcolor: 'darkblue' },
                                            }}
                                        >
                                            {index === 0 ? 'Depositar' : index === 1 ? 'Retirar' : '2FA auth'}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0', bgcolor: '#ffffff' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Mis Wallets</Typography>
                    <MyWallets />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Dashboard;
