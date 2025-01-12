import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress } from '@mui/material';
import useProvider from '../../hooks/useProviders';

const ProviderCard = () => {
    const { getAllProviders, openChat, error, successMessage, isLoading } = useProvider();
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
    }, [getAllProviders]);

    const handleOpenChat = async (provider) => {
        console.log("Opening chat for provider:", provider);
        setSelectedProvider(provider);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        console.log("Closing chat dialog");
        setOpenDialog(false);
        setSelectedProvider(null);
    };

    const handleStartChat = async () => {
        if (selectedProvider) {
            console.log("Starting chat with provider:", selectedProvider);
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
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    providers.map((provider) => (
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
                    ))
                )}
            </Box>

            {/* Dialog for chat */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Start Chat with {selectedProvider?.name}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to start a chat with this provider?</Typography>
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
            {error && <Typography color="error">{error}</Typography>}
            {successMessage && <Typography color="success">{successMessage}</Typography>}
        </Box>
    );
};

export default ProviderCard;
