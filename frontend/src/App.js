import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { AuthContext } from './hooks/AuthContext'
import useFindUser from './hooks/useFindUser'

import Login from "./pages/Login"
import { Box, Container, CssBaseline, Toolbar } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PublicRoute from './components/route-control/PublicRoute'
import PrivateRoute from './components/route-control/PrivateRoute'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Wallets from './pages/Wallets'
import Wallet from './pages/Wallet'
import WelcomeTemplate from './pages/welcometemplate'
import ProviderCard from './components/providers/ProviderCard'
import CreateProvider from './pages/Create';
import Nextmain from './pages/Nextmain'
import VerifyToken from './components/2FA/verify-token'
import Settings from './components/settings/Settings'
import ResendTokenForm from './components/2FA/ResendTokenForm'
import EmailVerificationComponent from './components/settings/verify'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { LanguageProvider } from './hooks/LanguageContext';
import './i18n'; 
import Chatcomponent from './components/providers/Chat';
import ProviderChatComponent from './components/providers/ProviderChatComponent';

// APLICACION CLIENTE
export default function App() {
    const { auth, setAuth, loading } = useFindUser();
    const mdTheme = createTheme();

    return (
        <Router>
            <AuthContext.Provider value={{ auth, setAuth, loading }}>
                <LanguageProvider>
                <ThemeProvider theme={mdTheme}>
                    <Box sx={{ display: 'flex' }}>
                        <CssBaseline />
                        <Navbar />
                        <Box
                            component="main"
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? theme.palette.grey[100]
                                        : theme.palette.grey[900],
                                flexGrow: 1,
                                height: '100vh',
                                overflow: 'auto',
                            }}
                        >
                            <Toolbar />
                            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                                <Switch>
                                    <PrivateRoute exact path='/' component={Home} />
                                    <PrivateRoute exact path="/wallets" component={Wallets} />
                                    <PrivateRoute exact path="/wallet/:walletId" component={Wallet} />
                                    <PrivateRoute exact path="/providers" component={ProviderCard} />
                                    <PrivateRoute exact path="/create" component={CreateProvider} />
                                    <PrivateRoute exact path='/welcome' component={WelcomeTemplate}/>
                                    <PrivateRoute exact path='/settings' component={Settings}/>
                                    <PrivateRoute exact path='/verifyemail' component={EmailVerificationComponent}/>
                                    <PrivateRoute exact path='/chat' component={Chatcomponent}/>
                                    <PrivateRoute exact path='/providerchat' component={ProviderChatComponent}/>
                                    <PublicRoute exact path='/login' component={Login} />
                                    <PublicRoute exact path='/register' component={Register} />
                                    <PublicRoute exact path='/forgot-password' component={ForgotPassword} />
                                    <PublicRoute exact path='/reset-password' component={ResetPassword} />
                                    <PublicRoute exact path='/nextmain' component={Nextmain}/>
                                    <PublicRoute exact path='/verifytoken' component={VerifyToken} />
                                    <PublicRoute exact path='/resendtoken' component={ResendTokenForm}/>
                                </Switch>
                                
                            </Container>
                        </Box>
                    </Box>
                </ThemeProvider>
                </LanguageProvider>
            </AuthContext.Provider>
        </Router>
    )
}