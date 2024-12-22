import React, { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { AuthContext } from '../hooks/AuthContext';
import useProviders from '../hooks/useProviders';

const ProviderChatComponent = () => {
    const { auth } = useContext(AuthContext);
    const { getChatDetailsByEmail, getMessages, sendMessageAsProvider, loading, error } = useProviders();
    const [chatId, setChatId] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const fetchChatDetails = async () => {
            if (!chatId) {
                const chatDetails = await getChatDetailsByEmail(auth.email);
                if (chatDetails) {
                    setChatId(chatDetails.chatId);
                    const messages = await getMessages(chatDetails.chatId);
                    setChatMessages(messages.map(msg => msg.message));
                }
            }
        };
        fetchChatDetails();
    }, [auth.email, chatId, getChatDetailsByEmail, getMessages]);

    const handleSendMessage = async () => {
        if (chatId && messageContent) {
            await sendMessageAsProvider(auth.email, chatId, messageContent);
            const messages = await getMessages(chatId);
            setChatMessages(messages.map(msg => msg.message));
            setMessageContent('');
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4">Chat Room</Typography>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error.message}</Typography>}
            <Box sx={{ my: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px', height: '300px', overflowY: 'scroll' }}>
                {chatMessages.map((msg, index) => (
                    <Typography key={index} variant="body1">{msg}</Typography>
                ))}
            </Box>
            <TextField
                label="Type your message"
                variant="outlined"
                fullWidth
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={loading}>
                Send Message
            </Button>
        </Box>
    );
};

export default ProviderChatComponent;