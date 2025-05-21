import { useState, useCallback } from 'react';
import Provider from '../services/providerService';

export default function useProvider() {
  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState(null);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const createNewProvider = async (body) => {
    setIsLoading(true);
    try {
      const res = await Provider.createProvider(body);
      setProvider(res);
      setError(null);
      return res;
    } catch (err) {
      setError(err.response?.data || err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await Provider.getAllProviders();
      if (Array.isArray(res)) {
        setProviders(res);
        setError(null);
        return res;
      }
      setError({ message: 'No se encontraron proveedores.' });
      return [];
    } catch (err) {
      setError(err.response?.data || err);
      setProviders([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const findByEMail = useCallback(async (email) => {
    setIsLoading(true);
    try {
      const res = await Provider.findByEMail(email);
      if (res) {
        setProvider(res);
        setError(null);
        return res;
      }
      setError({ message: 'Aún no eres un proveedor P2P, debes registrarte.' });
      return null;
    } catch (err) {
      setError(err.response?.data || err);
      setProvider(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createChat = async (body) => {
    setIsLoading(true);
    try {
      const res = await Provider.createChat(body);
      setChat(res);
      setError(null);
      return res;
    } catch (err) {
      setError(err.response?.data || err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageAsUser = async (body) => {
    setIsLoading(true);
    try {
      const res = await Provider.sendMessageAsUser({
        sender: body.sender,
        message: body.message,
        chatId: body.chatId
      });
      setChat(res);
      setError(null);
      return res;
    } catch (err) {
      setError(err.response?.data || err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageAsProvider = async (body) => {
    setIsLoading(true);
    try {
      const res = await Provider.sendMessageAsProvider({
        sender: body.sender,
        message: body.message,
        chatId: body.chatId
      });
      setChat(res);
      setError(null);
      return res;
    } catch (err) {
      setError(err.response?.data || err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getMessages = useCallback(async (chatId) => {
    setIsLoading(true);
    try {
      const res = await Provider.getMessages(chatId);
      if (Array.isArray(res)) {
        setMessages(res);
        setError(null);
        return res;
      }
      setMessages([]);
      setError({ message: 'No se encontraron mensajes.' });
      return [];
    } catch (err) {
      setError(err.response?.data || err);
      setMessages([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    providers,
    provider,
    chat,
    messages,
    error,
    isLoading,
    createNewProvider,
    findByEMail,
    getAllProviders,
    createChat,
    sendMessageAsUser,
    sendMessageAsProvider,
    getMessages,
  };
}