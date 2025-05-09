import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import useProvider from '../../hooks/useProviders';

const ProviderCard = () => {
    const {
        getAllProviders,
        openChat,
        error,
        successMessage,
        isLoading
    } = useProvider();

    const [providers, setProviders] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);

    useEffect(() => {
        const fetchProviders = async () => {
            console.log("Fetching providers...");
            const providersData = await getAllProviders();
            console.log("Providers fetched:", providersData);
            setProviders(providersData);
        };

        fetchProviders();
    }, []); // Eliminamos getAllProviders de las dependencias

    const handleOpenChat = (provider) => {
        setSelectedProvider(provider);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProvider(null);
    };

    const handleStartChat = async () => {
        if (selectedProvider) {
            const body = { providerId: selectedProvider.id };
            await openChat(body);
            handleCloseDialog();
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Providers
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <CircularProgress />
                </Box>
            ) : providers.length === 0 ? (
                <Typography>No providers available.</Typography>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    {providers.map((provider) => (
                        <Card key={provider.id}>
                            <CardContent>
                                <Typography variant="h6">{provider.name}</Typography>
                                <Typography variant="body2">{provider.email}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleOpenChat(provider)}
                                    sx={{ marginTop: 2 }}
                                >
                                    Open Chat
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Dialog for chat */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Start Chat with {selectedProvider?.name}</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to start a chat with this provider?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleStartChat} color="primary">
                        Start Chat
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error and Success Messages */}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
        </Box>
    );
};

export default ProviderCard;
