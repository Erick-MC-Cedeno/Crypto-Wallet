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
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    useTheme
    
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
    getNetWorkList,
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
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, mb: 3 }}>
                <Box>
                    {!isWalletLoading ? (
                        walletInfo ? (
                            <>
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                    Balance
                                </Typography>
                                <Typography variant="h4" fontWeight={700} mb={1} sx={{ color: theme.palette.primary.main }}>
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
                                    <InputLabel id="select-network-label" sx={{ color: theme.palette.text.primary }}>
                                        {`Selecciona la red para ${walletId.toUpperCase()}`}
                                    </InputLabel>
                                    <Select
                                        labelId="select-network-label"
                                        id="select-network"
                                        value={defaultNetworkId}
                                        label={`Selecciona la red para ${walletId.toUpperCase()}`}
                                        sx={{ border: '1px solid #ccc', borderRadius: 2 }}
                                    >
                                        {getNetWorkList(walletId).map((network) => (
                                            <MenuItem key={network.id} value={network.id}>{network.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Typography variant="caption" color="text.secondary" mb={2}>
                                    Tu dirección de {walletInfo.coin} ({getNetworkName(walletInfo.chainId)})
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={2}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Box sx={{ p: 1, bgcolor: "#F5F5F5", borderRadius: "8px", border: '1px solid #ccc', flexGrow: 1 }}>
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
                                            <QRCode value={walletInfo.address} size={200} />
                                            <Stack direction="row" spacing={1}>
                                                <TextField
                                                    value={withdrawAddress}
                                                    onChange={handleInputAddress}
                                                    placeholder={`Dirección ${getNetworkName(walletInfo.chainId)}...`}
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{ border: '1px solid #ccc', borderRadius: 2 }}
                                                />
                                                <TextField
                                                    type='number'
                                                    onChange={handleInputAmount}
                                                    value={withdrawAmount || ''}
                                                    placeholder={`Monto a retirar...`}
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{ border: '1px solid #ccc', borderRadius: 2 }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <Button variant="outlined" onClick={setMaxAmount} sx={{ height: '100%' }}>
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
                                                color="error"
                                                fullWidth
                                                sx={{
                                                    borderRadius: 2,
                                                    padding: '8px',
                                                    fontSize: '14px',
                                                    border: '1px solid transparent',
                                                }}
                                            >
                                                RETIRAR
                                            </Button>
                                            {error && <Typography variant="caption" color="error">{error}</Typography>}
                                            <Typography variant="caption" color="text.secondary" mt={1}>
                                                Comisión: {getCoinFee(walletInfo.coin)} {walletInfo.coin}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6} textAlign="center" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: 1 }}>
                                        {/* Puedes agregar información adicional aquí si es necesario */}
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <Button
                                onClick={handleCreateWallet}
                                color="info"
                                fullWidth
                                sx={{ borderRadius: 2, padding: '10px', fontSize: '16px', border: '1px solid #ccc' }}
                            >
                                CREAR BILLETERA PARA {walletId.toUpperCase()} AHORA
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
