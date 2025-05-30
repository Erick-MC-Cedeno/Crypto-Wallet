import React from 'react';
import {
    Typography,
    Box,
    IconButton,
    Divider,
    Stack,
    TextField,
    Tooltip,
    Zoom,
    Button,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    CardHeader,
} from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopyIcon from '../assets/receiveCopyIcon.svg';
import QRCode from 'react-qr-code';
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
import { useTranslation } from 'react-i18next';

export default function Wallet() {
    const { t } = useTranslation();
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
            setError(t('insufficient_funds'));
            return;
        }
        const result = await withdraw(withdrawAmount, withdrawAddress);
        if (result === 'success') {
            getTransactions();
            resetWithdrawFields();
        }
    };

    const resetWithdrawFields = () => {
        setWithdrawAmount('');
        setWithdrawAddress('');
        setError('');
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
            chainId: defaultNetworkId,
        });
        if (wallet) {
            setWalletInfo(wallet);
        }
    };

    return (
        <Box sx={{ p: 2, maxWidth: '800px', margin: '0 auto', backgroundColor: theme.palette.background.default, borderRadius: 2, boxShadow: 3 }}>
            {!isWalletLoading ? (
                walletInfo ? (
                    <>
                        <Card sx={{ mb: 2 }}>
                            <CardHeader title={t('balance')} />
                            <CardContent>
                                <Typography variant="h4" fontWeight={700}>
                                    {truncateToDecimals(walletInfo.balance, getCoinDecimalsPlace(walletInfo.coin))}
                                    <Typography component="span" variant="h4" fontWeight={700}>
                                        {` ${walletInfo.coin}`}
                                    </Typography>
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {coinPrice ? `$${(parseFloat(walletInfo.balance) * parseFloat(coinPrice)).toFixed(2)}` : ''}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Divider sx={{ mb: 2 }} />

                        <Typography variant="h6" color="text.primary" mb={1}>{t('deposits')}</Typography>
                        <Typography variant="caption" color="text.secondary" mb={1}>
                            {t('your_address', { coin: walletInfo.coin, network: getNetworkName(walletInfo.chainId) })}
                        </Typography>
                        <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ maxWidth: '470px' }}>
                                <TextField
                                    variant="outlined"
                                    value={walletInfo.address}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <CopyToClipboard
                                                text={walletInfo.address}
                                                onCopy={() => {
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                            >
                                                <Tooltip
                                                    title={copied ? <Typography variant="caption" color="success">{t('address_copied')}</Typography> : t('copy')}
                                                    TransitionComponent={Zoom}
                                                >
                                                    <IconButton sx={{ padding: 0 }}>
                                                        <img src={CopyIcon} alt="Copiar" style={{ width: "24px", height: "24px" }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </CopyToClipboard>
                                        ),
                                    }}
                                    fullWidth
                                    sx={{ fontSize: '14px',fontWeight: 500 }}
                                />
                            </Stack>
                            <QRCode value={walletInfo.address} size={200} />
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" color="text.primary" mb={1}>{t('withdrawals')}</Typography>
                        <Stack spacing={2}>
                            <Stack direction={isSmallScreen ? "column" : "row"} spacing={1}>
                                <TextField
                                    value={withdrawAddress}
                                    onChange={handleInputAddress}
                                    placeholder={t('address_placeholder', { network: getNetworkName(walletInfo.chainId) })}
                                    variant="outlined"
                                    sx={{ flexGrow: 7, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    type='number'
                                    onChange={handleInputAmount}
                                    value={withdrawAmount || ''}
                                    placeholder={t("amount_to_withdraw")}
                                    variant="outlined"
                                    sx={{ flexGrow: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    InputProps={{
                                        endAdornment: (
                                            <Button
                                                variant="outlined"
                                                onClick={setMaxAmount}
                                                sx={{ height: '40%', color: '#000' }}
                                            >
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
                                sx={{
                                    borderRadius: 2,
                                    padding: '8px',
                                    fontSize: '14px',
                                    width: '150px',
                                }}
                            >
                                {t('withdraw')}
                            </Button>
                            {error && <Typography variant="caption" color="error">{error}</Typography>}
                            <Typography variant="caption" color="text.secondary" mt={1}>
                                {t('commission', { fee: getCoinFee(walletInfo.coin), coin: walletInfo.coin })}
                            </Typography>
                        </Stack>
                    </>
                ) : (
                    <Button
                        onClick={handleCreateWallet}
                        color="info"
                        fullWidth
                        sx={{ borderRadius: 2, padding: '10px', fontSize: '16px' }}
                    >
                        {t('create_wallet', { walletId: walletId.toUpperCase() })}
                    </Button>
                )
            ) : (
                <Typography variant="body1" color="text.secondary">Cargando...</Typography>
            )}
            <CoinTransactions transactions={transactions} chainId={defaultNetworkId} coin={walletId} />
        </Box>
    );
}