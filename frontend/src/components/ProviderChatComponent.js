import React, { useState, useEffect, useContext, useRef, useCallback, memo } from 'react';
import { 
    Box, 
    TextField, 
    IconButton, 
    Typography, 
    List, 
    ListItem, 
    Paper, 
    InputAdornment,
    CircularProgress,
    Fade
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from '../hooks/AuthContext';
import useProviders from '../hooks/useProviders';

const Message = memo(({ message, isOwnMessage }) => (
    <ListItem sx={{ display: 'flex', justifyContent: isOwnMessage ? 'flex-end' : 'flex-start', padding: 1 }}>
        <Fade in timeout={500}>
            <Box
                sx={{
                    bgcolor: isOwnMessage ? '#1976d2' : '#f5f5f5',
                    color: isOwnMessage ? '#fff' : '#000',
                    borderRadius: 2,
                    padding: 1.5,
                    maxWidth: '70%',
                }}
            >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {isOwnMessage ? 'Tú' : message.sender}
                </Typography>
                <Typography variant="body1">{message.message}</Typography>
            </Box>
        </Fade>
    </ListItem>
));

const ProviderChatComponent = () => {
    const { auth } = useContext(AuthContext);
    const { getChatDetailsByEmail, getMessages, sendMessageAsProvider, error, messages } = useProviders();
    const [chatId, setChatId] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const fetchMessages = useCallback(async (id) => {
        if (id) await getMessages(id);
    }, [getMessages]);

    useEffect(() => {
        (async () => {
            if (!chatId) {
                try {
                    const { chatId: id } = await getChatDetailsByEmail(auth.email) || {};
                    if (id) setChatId(id);
                } catch {}
            }
        })();
    }, [auth.email, chatId, getChatDetailsByEmail]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (chatId && document.visibilityState === 'visible') fetchMessages(chatId);
        }, 2000);
        return () => clearInterval(interval);
    }, [chatId, fetchMessages]);

    useEffect(() => {
        if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!messageContent.trim() || isSending || !chatId) return;
        setIsSending(true);
        await sendMessageAsProvider(auth.email, chatId, messageContent);
        setMessageContent('');
        await fetchMessages(chatId);
        setIsSending(false);
    };

    return (
        <Box sx={{ height: 'calc(85vh - 40px)', width: '85%', maxWidth: 800, margin: 'auto', p: 2, bgcolor: '#f0f2f5' }}>
            <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
                    <Typography variant="h6" align="center">Chat Room</Typography>
                </Box>

                {error && <Typography color="error" sx={{ p: 2 }}>{error.message}</Typography>}

                <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#fff' }}>
                    {messages.length === 0 ? (
                        <Typography variant="body1" align="center" color="text.secondary">Aún no hay mensajes</Typography>
                    ) : (
                        <List>
                            {messages.map((msg, idx) => (
                                <Message key={msg.id || idx} message={msg} isOwnMessage={msg.sender === auth.email} />
                            ))}
                            <div ref={messagesEndRef} />
                        </List>
                    )}
                </Box>

                <Box sx={{ p: 2, bgcolor: '#fff', borderTop: 1, borderColor: 'divider' }}>
                    <TextField
                        fullWidth
                        placeholder="Escribe tu mensaje..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleSendMessage}
                                        disabled={isSending || !messageContent.trim()}
                                        sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
                                    >
                                        {isSending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default memo(ProviderChatComponent);
