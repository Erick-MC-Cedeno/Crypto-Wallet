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
    const { getChatDetailsByEmail, getMessages, sendMessageAsProvider, error, messages, setMessages } = useProviders();
    const [chats, setChats] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const messagesEndRef = useRef(null);
    const lastFetchTime = useRef(0);

   
    useEffect(() => {
        const savedChats = localStorage.getItem('chats');
        const savedChatId = localStorage.getItem('chatId');
        const savedMessages = localStorage.getItem('messages');

        if (savedChats) {
            setChats(JSON.parse(savedChats));
        }
        if (savedChatId) {
            setChatId(savedChatId);
        }
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, [setMessages]);

    
    useEffect(() => {
        if (chats.length > 0) {
            localStorage.setItem('chats', JSON.stringify(chats));
        }
        if (chatId) {
            localStorage.setItem('chatId', chatId);
        }
        if (messages.length > 0) {
            localStorage.setItem('messages', JSON.stringify(messages));
        }
    }, [chats, chatId, messages]);

   
    useEffect(() => {
        if (!auth.email) return;

        const fetchChatDetails = async () => {
            try {
                const chatDetails = await getChatDetailsByEmail(auth.email);
                setChats(chatDetails);
                if (chatDetails.length > 0 && !chatId) {
                    setChatId(chatDetails[0].chatId); 
                }
            } catch (e) {
                console.error('Error fetching chat details:', e);
            }
        };

        fetchChatDetails();
    }, [auth.email, getChatDetailsByEmail, chatId]);

    useEffect(() => {
        if (!chatId || isLoadingMessages) return; 

        const fetchMessagesForChat = async () => {
            const now = Date.now();
            if (now - lastFetchTime.current > 5000) { 
                lastFetchTime.current = now;
                setIsLoadingMessages(true); 
                try {
                    const fetchedMessages = await getMessages(chatId);
                    if (JSON.stringify(fetchedMessages) !== JSON.stringify(messages)) {
                        setMessages(fetchedMessages);
                    }
                } catch (e) {
                    console.error(`Error fetching messages for chatId ${chatId}:`, e);
                } finally {
                    setIsLoadingMessages(false); 
                }
            }
        };

        fetchMessagesForChat();
        const interval = setInterval(fetchMessagesForChat, 10000); 
        return () => clearInterval(interval); 
    }, [chatId, isLoadingMessages, messages, getMessages, setMessages]);

    
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    
    const handleSendMessage = async () => {
        if (!messageContent.trim() || isSending || !chatId) return;
        setIsSending(true);
        try {
            await sendMessageAsProvider(auth.email, chatId, messageContent);
            setMessageContent(''); 
            await getMessages(chatId); 
        } catch (e) {
            console.error('Error sending message:', e);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(85vh - 40px)', width: '85%', maxWidth: 800, margin: 'auto', p: 2, bgcolor: '#f0f2f5' }}>
            {/* Lista de Chats */}
            <Paper elevation={3} sx={{ width: '25%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, mr: 2 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
                    <Typography variant="h6" align="center">Chats</Typography>
                </Box>
                <List sx={{ flex: 1, overflow: 'auto' }}>
                    {chats.map((chat) => (
                        <ListItem 
                            button 
                            key={chat.chatId} 
                            selected={chat.chatId === chatId} 
                            onClick={() => setChatId(chat.chatId)} 
                        >
                            <Typography variant="body1">{chat.chatName}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Paper elevation={3} sx={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
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