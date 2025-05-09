import React, { useState, useEffect, useContext, useRef, memo, useCallback } from 'react';
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
import { AuthContext } from '../../hooks/AuthContext';
import useProviders from '../../hooks/useProviders';

const Message = memo(({ message, isOwnMessage }) => {
    return (
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
    );
}, (prev, next) => prev.message.id === next.message.id && prev.isOwnMessage === next.isOwnMessage);

const ProviderChatComponent = () => {
    const { auth } = useContext(AuthContext);
    const {
        getMessages,
        sendMessageAsProvider,
        getChatDetailsByEmail,
        error,
        clearError,
    } = useProviders();

    const [chats, setChats] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const intervalRef = useRef(null);

    const loadMessages = useCallback(async (currentChatId) => {
        if (!currentChatId || isLoadingMessages) return;

        try {
            setIsLoadingMessages(true);
            const fetchedMessages = await getMessages(currentChatId);
            setMessages(fetchedMessages.messages);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    }, [getMessages, isLoadingMessages]);

    const fetchChatDetails = useCallback(async () => {
        try {
            clearError();
            const chatDetails = await getChatDetailsByEmail(auth.email);
            setChats(chatDetails.data);

            if (chatDetails.data.length > 0) {
                const firstChatId = chatDetails.data[0].chatId;
                setChatId(firstChatId);
                await loadMessages(firstChatId);
            }
        } catch (error) {
            console.error('Error al obtener detalles del chat:', error);
        }
    }, [auth.email, clearError, getChatDetailsByEmail, loadMessages]);

    useEffect(() => {
        fetchChatDetails();
        return () => clearInterval(intervalRef.current);
    }, [fetchChatDetails]);

    useEffect(() => {
        if (!chatId) return;

        clearInterval(intervalRef.current); // Siempre limpia antes de crear uno nuevo
        intervalRef.current = setInterval(async () => {
            const fetchedMessages = await getMessages(chatId);
            setMessages(fetchedMessages.messages);

            if (fetchedMessages.status === 3) {
                clearInterval(intervalRef.current);
            }
        }, 5000);

        return () => clearInterval(intervalRef.current);
    }, [chatId, getMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!messageContent.trim() || isSending || !chatId) return;

        try {
            setIsSending(true);
            await sendMessageAsProvider({
                providerEmail: auth.email,
                chatId,
                messageContent,
            });
            setMessageContent('');
            await loadMessages(chatId);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleChatSelection = async (chat) => {
        setChatId(chat.chatId);
        await loadMessages(chat.chatId);
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(85vh - 40px)', width: '85%', maxWidth: 800, margin: 'auto', p: 2, bgcolor: '#f0f2f5' }}>
            {/* Lista de Chats */}
            <Paper elevation={3} sx={{ width: '25%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, mr: 2 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
                    <Typography variant="h6" align="center">Chats</Typography>
                </Box>
                <List sx={{ flex: 1, overflow: 'auto' }}>
                    {Array.isArray(chats) && chats.length > 0 ? (
                        chats.map((chat) => (
                            <ListItem
                                button
                                key={chat.chatId}
                                selected={chat.chatId === chatId}
                                onClick={() => handleChatSelection(chat)}
                            >
                                <Typography variant="body1">{chat.chatName}</Typography>
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body1" align="center" color="text.secondary">No se encontraron chats disponibles.</Typography>
                    )}
                </List>
            </Paper>

            {/* Ventana de Mensajes */}
            <Paper elevation={3} sx={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
                    <Typography variant="h6" align="center">Chat Room</Typography>
                </Box>

                {error && <Typography color="error" sx={{ p: 2 }}>{error.message}</Typography>}

                <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#fff' }}>
                    {Array.isArray(messages) && messages.length === 0 ? (
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
