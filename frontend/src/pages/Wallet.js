import * as React from 'react';
import {
    Typography,
    Box,
    Paper,
    Grid,
    IconButton,
    Divider,
    Stack,
    Input,
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
    const [withdrawAmount, setWithdrawAmount] = React.useState(0);
    const [withdrawAddress, setWithdrawAddress] = React.useState(undefined);

    const { walletId } = useParams();
    const defaultNetworkId = getDefaultNetworkId(walletId);

    const { walletInfo, isWalletLoading, setWalletInfo } = useWalletInfo(walletId);
    const { coinPrice } = useCoinPrice(walletId);
    const { withdraw } = useWithdraw(walletId);
    const { transactions, getTransactions } = useTransitions(walletId);

    const theme = useTheme();

    const handleWithdraw = async () => {
        const result = await withdraw(withdrawAmount, withdrawAddress);
        if (result && result === 'success') {
            getTransactions();
        }
    };

    const handleInputAddress = (e) => {
        setWithdrawAddress(e.target.value);
    };

    const handleInputAmount = (e) => {
        setWithdrawAmount(e.target.value);
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
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <CoinTransactions
                    transactions={transactions}
                    chainId={defaultNetworkId}
                    coin={walletId} />
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                    <Box>
                        {!isWalletLoading ?
                            walletInfo ?
                                <>
                                    <Typography variant="body2" color="text.secondary" mb={1}>
                                        Balance
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} mb={1} sx={{ color: theme.palette.primary.main }}>
                                        {truncateToDecimals(walletInfo.balance, getCoinDecimalsPlace(walletInfo.coin))}
                                        <Typography
                                            component="span"
                                            variant="h4"
                                            fontWeight={700}
                                        >
                                            {` ${walletInfo.coin}`}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" mb={2}>
                                        {coinPrice ?
                                            `$${(parseFloat(walletInfo.balance) * parseFloat(coinPrice)).toFixed(2)}`
                                            : ''}
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
                                        >
                                            {
                                                getNetWorkList(walletId).map((network) => (
                                                    <MenuItem key={network.id} value={network.id}>{network.name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <Typography variant="caption" color="text.secondary" mb={2}>
                                        Tu dirección de {walletInfo.coin} ({getNetworkName(walletInfo.chainId)})
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                                        <Box
                                            sx={{ p: 1, bgcolor: "#F5F5F5", borderRadius: "8px", flexGrow: 1 }}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Input
                                                    disableUnderline
                                                    value={walletInfo.address}
                                                    readOnly
                                                    fullWidth
                                                    sx={{ fontSize: '14px', fontWeight: 500 }}
                                                />
                                                <CopyToClipboard
                                                    text={walletInfo.address}
                                                    onCopy={() => setCopied(true)}
                                                >
                                                    <Tooltip
                                                        title={
                                                            copied ? (
                                                                <Typography variant="caption" color="success">
                                                                    Dirección copiada!
                                                                </Typography>
                                                            ) : (
                                                                "Copiar"
                                                            )
                                                        }
                                                        TransitionComponent={Zoom}
                                                    >
                                                        <IconButton>
                                                            <img
                                                                src={CopyIcon}
                                                                alt="Copiar"
                                                                style={{ width: "24px", height: "24px" }}
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                </CopyToClipboard>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box mb={2} textAlign='center'>
                                        <QRCode value={walletInfo.address} />
                                    </Box>
                                    <Stack spacing={2} alignItems="center">
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Input
                                                    value={withdrawAddress || ''}
                                                    onChange={handleInputAddress}
                                                    placeholder={`Dirección ${getNetworkName(walletInfo.chainId)}...`}
                                                    fullWidth
                                                    sx={{ borderRadius: 1, bgcolor: "#FFFFFF" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Button
                                                    disabled={!(withdrawAmount > 0 && withdrawAmount <= walletInfo.balance && withdrawAddress)}
                                                    onClick={handleWithdraw}
                                                    variant="contained"
                                                    color="error"
                                                    fullWidth
                                                    sx={{ borderRadius: 2, padding: '10px', fontSize: '16px' }}
                                                >
                                                    RETIRAR
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Input
                                                    type='number'
                                                    onChange={handleInputAmount}
                                                    value={withdrawAmount || ''}
                                                    placeholder={`Monto a retirar...`}
                                                    fullWidth
                                                    sx={{ borderRadius: 1, bgcolor: "#FFFFFF" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Comisión: {getCoinFee(walletInfo.coin)} {walletInfo.coin}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </>
                                : <Button
                                    onClick={handleCreateWallet}
                                    color="info"
                                    fullWidth
                                    sx={{ borderRadius: 2, padding: '10px', fontSize: '16px' }}
                                >
                                    CREAR BILLETERA PARA {walletId.toUpperCase()} AHORA
                                </Button>
                            :
                            <Typography variant="body1" color="text.secondary">Cargando...</Typography>
                        }
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}
