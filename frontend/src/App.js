import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { AuthContext } from './hooks/AuthContext'
import useFindUser from './hooks/useFindUser'

import Login from "./pages/Login"
import { Box, Container, CssBaseline, Toolbar } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Wallets from './pages/Wallets'
import Wallet from './pages/Wallet'
import WelcomeTemplate from './pages/welcometemplate'
import ProvidersList from './pages/List'
import CreateProvider from './pages/Create';
import Nextmain from './pages/Nextmain'
import VerifyToken from './components/verify-token'
import Settings from './components/Settings'
import ResendTokenForm from './components/ResendTokenForm'



export default function App() {
    const { auth, setAuth, loading } = useFindUser();
    const mdTheme = createTheme();

    return (
        <Router>
            <AuthContext.Provider value={{ auth, setAuth, loading }}>
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
                                    <PrivateRoute exact path="/providers" component={ProvidersList} />
                                    <PrivateRoute exact path="/create" component={CreateProvider} />
                                    <PrivateRoute exact path='/welcome' component={WelcomeTemplate}/>
                                    <PrivateRoute exact path='/settings' component={Settings}/>
                                    <PublicRoute exact path='/login' component={Login} />
                                    <PublicRoute exact path='/register' component={Register} />
                                    <PublicRoute exact path='/nextmain' component={Nextmain}/>
                                    <PublicRoute exact path='/verifytoken' component={VerifyToken} />
                                    <PublicRoute exact path='/resendtoken' component={ResendTokenForm}/>
                                </Switch>
                                
                            </Container>
                        </Box>
                    </Box>
                </ThemeProvider>
            </AuthContext.Provider>
        </Router>
    )
}