import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import WalletIcon from '@mui/icons-material/Wallet';
import Title from './utils/Title';
import useAllWallets from '../hooks/useAllWallets';

export default function TotalBalance() {
    const { walletBalance } = useAllWallets();

    return (
        <React.Fragment>
            <Title>Balance Total</Title>
            <Typography component="p" variant="h4">
                ${parseFloat(walletBalance).toFixed(2)}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                de todas tus criptomonedas
            </Typography>
            <div>
                <Link
                    color="primary"
                    href="/wallets"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0',
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                        },
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
            </div>
        </React.Fragment>
    );
}
