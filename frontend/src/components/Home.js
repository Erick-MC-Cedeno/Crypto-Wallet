import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link
import TotalBalance from './TotalBalance';
import MyWallets from './MyWallets';

const Dashboard = () => {
    // Estado para el texto que se va a mostrar con efecto de escritura
    const [displayText, setDisplayText] = useState('');
    const fullText = "La seguridad de tu cuenta es nuestra prioridad. Asegúrate de habilitar la autenticación de dos factores para proteger tus activos.";

    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            if (index < fullText.length) {
                setDisplayText((prev) => prev + fullText.charAt(index));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 50); // Cambia la velocidad del efecto de escritura ajustando el valor

        return () => clearInterval(interval);
    }, []);

    return (
        <Grid container spacing={3} sx={{ padding: 2 }}> 
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5} lg={4}>
                        <Paper
                            sx={{
                                p: 3, 
                                display: 'flex',
                                flexDirection: 'column',
                                height: 300,
                                borderRadius: 2,
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e0e0e0',
                                bgcolor: '#ffffff',
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Cuenta
                            </Typography>
                            <TotalBalance />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={7} lg={8}>
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 300,
                                borderRadius: 2,
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e0e0e0',
                                bgcolor: '#ffffff',
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Resumen de Actividades
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {displayText} {/* Mostrar el texto con efecto de escritura */}
                            </Typography>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 'auto' }}>
                                <Link to="/wallets" style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" color="primary" sx={{ mr: 1, bgcolor: 'blue', '&:hover': { bgcolor: 'darkblue' } }}>
                                        Depositar
                                    </Button>
                                </Link>
                                <Link to="/wallets" style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" color="primary" sx={{ mr: 1, bgcolor: 'blue', '&:hover': { bgcolor: 'darkblue' } }}>
                                        Retirar
                                    </Button>
                                </Link>
                                <Link to="/settings" style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" color="primary" sx={{ bgcolor: 'blue', '&:hover': { bgcolor: 'darkblue' } }}>
                                        2FA auth
                                    </Button>
                                </Link>
                            </div>
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
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e0e0e0',
                        bgcolor: '#ffffff',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Mis Wallets
                    </Typography>
                    <MyWallets />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Dashboard;
