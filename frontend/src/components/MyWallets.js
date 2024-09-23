import * as React from 'react';
import useAllWallets from '../hooks/useAllWallets';
import {
    Typography,
    Link,
    Grid,
    Paper,
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { getCoinLogo } from './utils/Chains';
import { getDisplayableAddress } from './utils/Display';

export default function MyWallets() {
    const { allWalletInfo } = useAllWallets();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ width: '100%', padding: 1 }}>
            {isSmallScreen ? (
                <Grid container spacing={1}>
                    {allWalletInfo.map((wallet) => (
                        <Grid item xs={12} key={wallet.walletId}>
                            <Paper sx={{ padding: 1, marginBottom: 1 }}>
                                <Grid container spacing={1} direction='column'>
                                    <Grid item>
                                        <Typography variant='body2' fontWeight='bold'>
                                            Moneda:
                                        </Typography>
                                        <Grid container spacing={0.5} alignItems='center'>
                                            <Grid item>
                                                <img width={20} src={getCoinLogo(wallet.coin)} alt={wallet.coin} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='body2'>{wallet.coin}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant='body2' fontWeight='bold'>
                                            Dirección:
                                        </Typography>
                                        <Link underline='none' href={`/wallet/${wallet.coin.toLowerCase()}`}>
                                            <Typography variant='body2' color='primary'>
                                                {getDisplayableAddress(wallet.address)}
                                            </Typography>
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant='body2' fontWeight='bold'>
                                            Balance:
                                        </Typography>
                                        <Typography variant='body2'>{wallet.balance}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ overflowX: 'auto' }}>
                    <Grid container spacing={1}>
                        {allWalletInfo.map((wallet) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={wallet.walletId}>
                                <Paper sx={{ padding: 1 }}>
                                    <Grid container spacing={1} alignItems='center'>
                                        <Grid item>
                                            <img width={20} src={getCoinLogo(wallet.coin)} alt={wallet.coin} />
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant='body2' component='div'>
                                                {wallet.coin}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} direction='column' sx={{ marginTop: 0.5 }}>
                                        <Grid item>
                                            <Typography variant='body2' fontWeight='bold'>
                                                Dirección:
                                            </Typography>
                                            <Link underline='none' href={`/wallet/${wallet.coin.toLowerCase()}`}>
                                                <Typography variant='body2' color='primary'>
                                                    {getDisplayableAddress(wallet.address)}
                                                </Typography>
                                            </Link>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='body2' fontWeight='bold'>
                                                Balance:
                                            </Typography>
                                            <Typography variant='body2'>{wallet.balance}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
}
