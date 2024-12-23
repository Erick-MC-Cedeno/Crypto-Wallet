import React, { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, Paper } from '@mui/material';
import { AuthContext } from '../hooks/AuthContext';
import useProviders from '../hooks/useProviders';

const ProviderChatComponent = () => {
    const { auth } = useContext(AuthContext);
    const { getChatDetailsByEmail, getMessages, sendMessageAsProvider, error, messages } = useProviders();
    const [chatId, setChatId] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchMessages = async (chatId) => {
            if (!chatId) return;
            try {
                await getMessages(chatId);
            } catch (err) {
                setFetchError(err.message);
            }
        };

        const fetchChatDetails = async () => {
            try {
                const chatDetails = await getChatDetailsByEmail(auth.email);
                if (chatDetails && chatDetails.chatId) {
                    if (chatId !== chatDetails.chatId) {
                        setChatId(chatDetails.chatId);
                        localStorage.setItem('chatData', JSON.stringify({ chat: chatDetails }));
                    }
                    fetchMessages(chatDetails.chatId);
                }
            } catch (err) {
                setFetchError(err.message);
            }
        };

        fetchChatDetails();

        const intervalId = setInterval(() => {
            if (chatId && messages.length > 0) {
                fetchMessages(chatId);
            }
        }, 2000); // Ejecutar cada 5 segundos

        return () => clearInterval(intervalId);
        
    }, [auth.email, chatId, messages.length]); 

    const handleSendMessage = async () => {
        try {
            if (!messageContent.trim() || !chatId) return;
            await sendMessageAsProvider(auth.email, chatId, messageContent);
            setMessageContent('');
            await getMessages(chatId);
        } catch (err) {
            setFetchError(err.message);
        }
    };

    return (
        <Box sx={{ padding: 3, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Chat Room
            </Typography>
            {error && <Typography color="error">{error.message}</Typography>}
            {fetchError && <Typography color="error">{fetchError}</Typography>}
            <Paper sx={{ maxHeight: 400, overflow: 'auto', marginBottom: 2, padding: 2 }}>
                <List>
                    {messages.length === 0 ? (
                        <Typography variant="body1">Aún no hay mensajes</Typography>
                    ) : (
                        messages.map((message, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.sender === auth.email ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: message.sender === auth.email ? '#e0f7fa' : '#f1f8e9',
                                        color: message.sender === auth.email ? '#00796b' : '#33691e',
                                        borderRadius: 2,
                                        padding: 1,
                                        maxWidth: '70%',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {message.sender === auth.email ? 'You' : message.sender}
                                    </Typography>
                                    <Typography variant="body2">{message.message}</Typography>
                                </Box>
                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>
            <TextField
                fullWidth
                variant="outlined"
                label="Escribe tu mensaje"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage();
                    }
                }}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginTop: 2 }}>
                Enviar
            </Button>
        </Box>
    );
};

export default ProviderChatComponent;