import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import WalletIcon from '@mui/icons-material/Wallet';
import Title from './utils/Title';
import useAllWallets from '../hooks/useAllWallets';

const TotalBalance = () => {
    const { walletBalance } = useAllWallets();

    return (
        <React.Fragment>
            <Title>Balance Total</Title>
            <Typography component="p" variant="h4" sx={{ mb: 1 }}>
                ${parseFloat(walletBalance).toFixed(2)}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                de todas tus criptomonedas
            </Typography>
            <Link
                color="primary"
                href="/wallets"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#f0f0f0',
                    transition: 'background-color 0.3s ease',
                    boxShadow: 1,
                    '&:hover': {
                        backgroundColor: '#e0e0e0',
                    },
                    mt: 8,
                }}
            >
                <Typography variant="body1" sx={{ mr: 1 }}>
                    Tus billeteras
                </Typography>
                <WalletIcon
                    sx={{
                        color: '#2186EB',
                        fontSize: '1.8rem',
                    }}
                />
            </Link>
        </React.Fragment>
    );
};

export default TotalBalance;
