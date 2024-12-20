import React, { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, Paper } from '@mui/material';
import { AuthContext } from '../hooks/AuthContext';
import useProviders from '../hooks/useProviders';

const ChatComponent = () => {
  const [messageContent, setMessageContent] = useState('');
  const [chatId, setChatId] = useState(null);
  const { messages, sendMessage, getMessages } = useProviders();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchMessages = async (chatId) => {
      await getMessages(chatId);
    };

    const chatData = JSON.parse(localStorage.getItem('chatData'));
    if (chatData) {
      setChatId(chatData.chat.chatId);
      fetchMessages(chatData.chat.chatId);
    }
  }, [getMessages]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    await sendMessage(auth.email, chatId, messageContent);
    setMessageContent('');
    await getMessages(chatId);
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Chat
      </Typography>
      <Paper sx={{ maxHeight: 400, overflow: 'auto', marginBottom: 2, padding: 2 }}>
        <List>
          {messages.map((message, index) => (
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
          ))}
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

export default ChatComponent;