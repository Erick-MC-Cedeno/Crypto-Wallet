import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import User from '../services/user';

export default function useAuth() {
    let history = useHistory();
    const { setAuth } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const setUserContext = async () => {
        try {
            const { data } = await User.getInfo();
            if (data && 'data' in data) {
                setAuth(data.data);
                history.push('/');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const logoutUser = async () => {
        try {
            await User.logout();
            localStorage.clear();
            history.push('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    const registerUser = async (body) => {
        try {
            const { data } = await User.register(body);
            if (data) {
                history.push('/login');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const loginUser = async (body) => {
        try {
            const { data } = await User.login(body);
            if (data && 'msg' in data) {
                if (data.msg === 'Código de verificación enviado a tu correo electrónico.') {
                    history.push('/verifytoken');
                } else if (data.msg === 'Logged in!') {
                    await setUserContext();
                    history.push('/');
                } else {
                    setError(data.error);
                }
            } else {
                setError('Credenciales incorrectas.');
            }
        } catch (err) {
            setError('Credenciales incorrectas.');
        }
    };

    const verifyToken = async (body) => {
        try {
            const { data } = await User.verifyToken(body);
            if (data && data.msg === 'Logged in!') {
                await setUserContext();
                history.push('/');
            } else if (data && data.msg === 'Código de verificación enviado a tu correo electrónico.') {
                return data;
            } else {
                setError(data.error || 'Código de verificación inválido.');
            }
        } catch (err) {
            setError('Token o User-Key incorrectos.');
            throw err;
        }
    };

    const resendToken = async (body) => {
        try {
            const { data } = await User.resendToken(body);
            if (data && data.message === 'Código de verificación reenviado a tu correo electrónico.') {
                setSuccessMessage(data.message);
            } else {
                setError(data.error || 'Error al reenviar el código de verificación.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const changePassword = async (body) => {
        try {
            const { data } = await User.changePassword(body);
            if (data && data.message === 'Contraseña actualizada con éxito') {
                setSuccessMessage('Contraseña actualizada con éxito');
            } else {
                setError(data.error || 'Error al cambiar la contraseña.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const updateTokenStatus = async (body) => {
        try {
            const { data } = await User.updateTokenStatus(body);
            if (data && data.msg === 'seguridad de la cuenta actualizada con éxito.') {
                setSuccessMessage('seguridad de la cuenta actualizada con éxito.');
            } else {
                setError(data.error || 'Error al actualizar el estado de seguridad.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        registerUser,
        loginUser,
        logoutUser,
        verifyToken,
        resendToken,  // Añadido aquí
        changePassword,
        updateTokenStatus,
        error,
        successMessage
    };
}
