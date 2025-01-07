import React, { useState, useEffect, useContext, useRef, memo } from 'react';
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
});

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
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const mountedRef = useRef(true);
    const intervalIdRef = useRef(null);

    useEffect(() => {
        fetchChatDetails();

        return () => {
            mountedRef.current = false;
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, []);

    const fetchChatDetails = async () => {
        try {
            setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    const loadMessages = async (currentChatId) => {
        if (!currentChatId || isLoadingMessages) {
            return;
        }

        try {
            setIsLoadingMessages(true);
            const fetchedMessages = await getMessages(currentChatId);
            setMessages(fetchedMessages.messages);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageContent.trim() || isSending || !chatId) {
            return;
        }

        try {
            setIsSending(true);
            await sendMessageAsProvider({
                providerEmail: auth.email,  
                chatId,                    
                messageContent: messageContent,  
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
                            {Array.isArray(messages) && messages.map((msg, idx) => (
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
