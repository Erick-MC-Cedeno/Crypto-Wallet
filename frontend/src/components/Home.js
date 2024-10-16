import React, { useEffect, useState, useContext } from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import TotalBalance from './TotalBalance';
import MyWallets from './MyWallets';
import { AuthContext } from '../hooks/AuthContext';

const Dashboard = () => {
    const { auth } = useContext(AuthContext);
    const texts = [
        "La seguridad de tu cuenta es nuestra prioridad. Asegúrate de habilitar la autenticación de dos factores.",
        "Con las criptomonedas, puedes ahorrar y obtener más rendimientos. ¡Descubre el potencial de tu dinero!",
        "Utiliza nuestro servicio P2P para vender tus tokens por fiat de manera rápida y segura.",
        "La blockchain es una tecnología revolucionaria que permite transacciones seguras y transparentes.",
        "Recuerda que mantener tus contraseñas seguras y únicas es fundamental.",
        "Nuestros servicios de crypto wallet están diseñados para ofrecerte la máxima seguridad y facilidad de uso. ",
        "Nuestro servicio de intercambio P2P te permite realizar transacciones directamente con otros usuarios."
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
        <Grid container spacing={3} sx={{ padding: 2 }}>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5} lg={4}>
                        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 300, borderRadius: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0', bgcolor: '#ffffff' }}>
                            <Typography variant="h6" sx={{ mb: 2, color: 'black', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                                Cuenta
                            </Typography>
                            <TotalBalance />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={7} lg={8}>
                        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 300, borderRadius: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0', bgcolor: '#ffffff' }}>
                            <Typography variant="h6" sx={{ mb: 2, color: 'black', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                                Bienvenido, {auth?.firstName} {auth?.lastName}
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    mb: 2, 
                                    fontSize: '1.1rem', 
                                    fontWeight: 'bold', 
                                    color: 'blue', 
                                    transition: 'opacity 0.5s ease', 
                                    opacity: fadeOut ? 0 : 1 
                                }}>
                                {visibleText}
                            </Typography>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 'auto', flexWrap: 'wrap' }}>
                                {['/wallets', '/wallets', '/settings'].map((link, index) => (
                                    <Link key={index} to={link} style={{ textDecoration: 'none', marginBottom: '8px' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                mr: 1,
                                                bgcolor: '#3F51B5',
                                                borderRadius: '12px',
                                                '&:hover': { bgcolor: '#303F9F' },
                                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                                minWidth: '100px',
                                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                                padding: { xs: '8px', sm: '10px' } 
                                            }}
                                        >
                                            {index === 0 ? 'Depositar' : index === 1 ? 'Retirar' : 'Seguridad'}
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
                    <Typography variant="h6" sx={{ mb: 2, color: 'black', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                        Mis Wallets
                    </Typography>
                    <MyWallets />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Dashboard;
