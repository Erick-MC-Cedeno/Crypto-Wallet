import React, { useContext } from 'react';
import { Grid, Paper, Typography, Avatar } from '@mui/material';
import TotalBalance from './TotalBalance';
import MyWallets from './MyWallets';
import useTransactions from '../hooks/useTransactions'; 
import { AuthContext } from '../hooks/AuthContext'; 


function Dashboard() {
    const { user } = useContext(AuthContext); 
    const { totalTransactions, loading } = useTransactions(user?.coin);

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
                            {loading ? (
                                <Typography variant="body1">Cargando...</Typography>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center' }}> 
                                    <Avatar 
                                        sx={{
                                            bgcolor: '#1976d2', 
                                            color: '#fff', 
                                            width: 40, 
                                            height: 40, 
                                            marginLeft: 1 
                                        }}
                                    >
                                        {totalTransactions} 
                                    </Avatar>
                                    <Typography variant="body1" sx={{ marginLeft: 1 }}> 
                                        Transacciones en Total
                                    </Typography>
                                </div>
                            )}
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
