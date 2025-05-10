import { useState } from 'react';
import Provider from '../services/providerService';

export default function useProvider() {
  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState(null);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const createNewProvider = async (body) => {
    try {
      const res = await Provider.createProvider(body);
      setProvider(res);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const getAllProviders = async () => {
    try {
      const res = await Provider.getAllProviders();
      if (res) {
        setProviders(res);
        setError(null);
        return res;  
      } else {
        setError({ message: 'No se encontraron proveedores.' });
        return [];  
      }
    } catch (err) {
      console.log("Error en getAllProviders:", err);
      setError(err);
      return []; 
    }
  };

  const createChat = async (body) => {
    try {
      const res = await Provider.createChat(body);
      setChat(res);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const sendMessageAsUser = async (body) => {
    try {
      const res = await Provider.sendMessageAsUser(body);
      setChat(res);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const sendMessageAsProvider = async (body) => {
    try {
      const res = await Provider.sendMessageAsProvider(body);
      setChat(res);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const getMessages = async (chatId) => {
    try {
      const res = await Provider.getMessages(chatId);
      setMessages(res);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  return {
    providers,
    provider,
    chat,
    messages,
    error,
    createNewProvider,
    getAllProviders,
    createChat,
    sendMessageAsUser,
    sendMessageAsProvider,
    getMessages,
  };
}
