import * as React from 'react';
import {
    Typography,
    Box,
    Paper,
    Grid,
    IconButton,
    Divider,
    Stack,
    TextField,
    Tooltip,
    Zoom,
    Button,
    FormControl,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "../assets/receiveCopyIcon.svg";
import QRCode from "react-qr-code";
import useWalletInfo from '../hooks/useWalletInfo';
import useCoinPrice from '../hooks/useCoinPrice';
import { useParams } from 'react-router-dom';
import {
    getCoinDecimalsPlace,
    getCoinFee,
    getDefaultNetworkId,
    getNetworkName
} from '../components/utils/Chains';
import useWithdraw from '../hooks/useWithdraw';
import createWallet from '../hooks/createWallet';
import CoinTransactions from '../components/CoinTransactions';
import useTransitions from '../hooks/useTransactions';

export default function Wallet() {
    const [copied, setCopied] = React.useState(false);
    const [withdrawAmount, setWithdrawAmount] = React.useState('');
    const [withdrawAddress, setWithdrawAddress] = React.useState('');
    const [error, setError] = React.useState('');

    const { walletId } = useParams();
    const defaultNetworkId = getDefaultNetworkId(walletId);

    const { walletInfo, isWalletLoading, setWalletInfo } = useWalletInfo(walletId);
    const { coinPrice } = useCoinPrice(walletId);
    const { withdraw } = useWithdraw(walletId);
    const { transactions, getTransactions } = useTransitions(walletId);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleWithdraw = async () => {
        if (parseFloat(withdrawAmount) > parseFloat(walletInfo.balance)) {
            setError('Fondos insuficientes');
            return;
        }
        const result = await withdraw(withdrawAmount, withdrawAddress);
        if (result === 'success') {
            getTransactions();
            setError('');
            setWithdrawAmount('');
            setWithdrawAddress('');
        }
    };

    const handleInputAddress = (e) => {
        setWithdrawAddress(e.target.value);
        setError('');
    };

    const handleInputAmount = (e) => {
        setWithdrawAmount(e.target.value);
        setError('');
    };

    const setMaxAmount = () => {
        setWithdrawAmount(walletInfo.balance);
        setError('');
    };

    const truncateToDecimals = (num, dec) => {
        const calcDec = Math.pow(10, dec);
        return Math.trunc(num * calcDec) / calcDec;
    };

    const handleCreateWallet = async () => {
        const wallet = await createWallet({
            coin: walletId,
            chainId: defaultNetworkId
        });
        if (wallet) {
            setWalletInfo(wallet);
        }
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#e0f7fa' }}> 
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, mb: 3, bgcolor: '#ffffff' }}>
                <Box>
                    {!isWalletLoading ? (
                        walletInfo ? (
                            <>
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                    Balance
                                </Typography>
                                <Typography variant="h4" fontWeight={700} mb={1} sx={{ color: '#0000FF' }}> {/* Color azul puro */}
                                    {truncateToDecimals(walletInfo.balance, getCoinDecimalsPlace(walletInfo.coin))}
                                    <Typography component="span" variant="h4" fontWeight={700}>
                                        {` ${walletInfo.coin}`}
                                    </Typography>
                                </Typography>
                                <Typography variant="body1" color="text.secondary" mb={2}>
                                    {coinPrice ? `$${(parseFloat(walletInfo.balance) * parseFloat(coinPrice)).toFixed(2)}` : ''}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <FormControl fullWidth disabled sx={{ mb: 2 }}>
                                </FormControl>
                                <Typography variant="caption" color="text.secondary" mb={2}>
                                    {`Tu dirección de ${walletInfo.coin} (${getNetworkName(walletInfo.chainId)})`}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={2}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Box sx={{ p: 1, bgcolor: "#e0f7fa", borderRadius: "8px", border: '1px solid #0000FF', flexGrow: 1 }}> 
                                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                        <TextField
                                                            variant="outlined"
                                                            value={walletInfo.address}
                                                            InputProps={{ readOnly: true }}
                                                            fullWidth
                                                            sx={{ fontSize: '14px', fontWeight: 500 }}
                                                        />
                                                        <CopyToClipboard
                                                            text={walletInfo.address}
                                                            onCopy={() => {
                                                                setCopied(true);
                                                                setTimeout(() => setCopied(false), 2000);
                                                            }}
                                                        >
                                                            <Tooltip
                                                                title={copied ? <Typography variant="caption" color="success">Dirección copiada!</Typography> : "Copiar"}
                                                                TransitionComponent={Zoom}
                                                            >
                                                                <IconButton>
                                                                    <img src={CopyIcon} alt="Copiar" style={{ width: "24px", height: "24px" }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CopyToClipboard>
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                            <Stack direction={isSmallScreen ? "column" : "row"} spacing={1} sx={{ mt: 2 }}>
                                                <Grid item xs={12} sm={6} sx={{ textAlign: isSmallScreen ? 'center' : 'right' }}>
                                                    <QRCode value={walletInfo.address} size={200} />
                                                </Grid>
                                            </Stack>

                                            <Stack spacing={2}>
                                                <Stack direction={isSmallScreen ? "column" : "row"} spacing={1}>
                                                    <TextField
                                                        value={withdrawAddress}
                                                        onChange={handleInputAddress}
                                                        placeholder={`Dirección ${getNetworkName(walletInfo.chainId)}...`}
                                                        fullWidth
                                                        variant="outlined"
                                                        sx={{ border: '1px solid #0000FF', borderRadius: 2 }} 
                                                    />
                                                    <TextField
                                                        type='number'
                                                        onChange={handleInputAmount}
                                                        value={withdrawAmount || ''}
                                                        placeholder="Monto a retirar..."
                                                        fullWidth
                                                        variant="outlined"
                                                        sx={{ border: '1px solid #0000FF', borderRadius: 2 }} 
                                                        InputProps={{
                                                            endAdornment: (
                                                                <Button variant="outlined" onClick={setMaxAmount} sx={{ height: '40%', color: '#0000FF' }}>
                                                                    Max
                                                                </Button>
                                                            ),
                                                        }}
                                                    />
                                                </Stack>
                                                <Button
                                                    disabled={!(withdrawAmount > 0 && withdrawAddress && parseFloat(withdrawAmount) <= parseFloat(walletInfo.balance))}
                                                    onClick={handleWithdraw}
                                                    variant="contained"
                                                    color="primary" 
                                                    fullWidth
                                                    sx={{
                                                        borderRadius: 2,
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                        border: '1px solid transparent',
                                                        bgcolor: '#0000FF', // Color azul puro
                                                        '&:hover': {
                                                            bgcolor: '#0033CC', // Azul más oscuro al pasar el ratón
                                                        },
                                                    }}
                                                >
                                                    RETIRAR
                                                </Button>
                                                {error && <Typography variant="caption" color="error">{error}</Typography>}
                                                <Typography variant="caption" color="text.secondary" mt={1}>
                                                    Comisión: {getCoinFee(walletInfo.coin)} {walletInfo.coin}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <Button
                                onClick={handleCreateWallet}
                                color="info"
                                fullWidth
                                sx={{ borderRadius: 2, padding: '10px', fontSize: '16px', border: '1px solid #0000FF' }} // Color azul puro en el borde
                            >
                                {`CREAR BILLETERA PARA ${walletId.toUpperCase()} AHORA`}
                            </Button>
                        )
                    ) : (
                        <Typography variant="body1" color="text.secondary">Cargando...</Typography>
                    )}
                </Box>
            </Paper>
            <CoinTransactions transactions={transactions} chainId={defaultNetworkId} coin={walletId} />
        </Box>
    );
}
