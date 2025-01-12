import React from 'react';
import useProviders from '../hooks/useProviders';
import ProviderCard from '../components/providers/ProviderCard';
import { Typography, Box, Grid } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export default function ProvidersList() {
    const { providers, loading, error } = useProviders();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <Box display="flex" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" p={1} bgcolor="#333" borderRadius={2}>
                    <MonetizationOnIcon style={{ color: 'green', marginRight: '8px' }} />
                    <Typography variant="h6" style={{ color: 'white' }}>
                        Vender P2P
                    </Typography>
                </Box>
            </Box>
            <Grid container spacing={2} p={2}>
                {providers && providers.map(provider => (
                    <Grid item xs={12} sm={6} md={4} key={provider.idNumber}>
                        <ProviderCard provider={provider} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}