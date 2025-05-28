import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { AuthContext } from './hooks/AuthContext';
import useFindUser from './hooks/useFindUser';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Container, CssBaseline } from '@mui/material';
import PublicRoute from './components/route-control/PublicRoute';
import PrivateRoute from './components/route-control/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Wallets from './pages/Wallets';
import Wallet from './pages/Wallet';
import Settings from './components/settings/Settings';
import VerifyToken from './components/2FA/verify-token';
import { LanguageProvider } from './hooks/LanguageContext';
import './i18n';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    secondary: {
      main: '#FF4081',
      light: '#FF80AB',
      dark: '#F50057',
    },
    background: {
      default: '#F5F7FF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default function App() {
  const { auth, setAuth, loading } = useFindUser();

  return (
    <Router>
      <AuthContext.Provider value={{ auth, setAuth, loading }}>
        <LanguageProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
              <CssBaseline />
              {auth && <Navbar />}
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  pt: auth ? 8 : 0,
                  pb: 4,
                  overflow: 'auto',
                  width: '100%',
                }}
              >
                <Container maxWidth={false}>
                  <Switch>
                    <PrivateRoute exact path="/" component={Dashboard} />
                    <PrivateRoute exact path="/wallets" component={Wallets} />
                    <PrivateRoute exact path="/wallet/:walletId" component={Wallet} />
                    <PrivateRoute exact path="/settings" component={Settings} />
                    <PublicRoute exact path="/login" component={Login} />
                    <PublicRoute exact path="/register" component={Register} />
                    <PublicRoute exact path="/verifytoken" component={VerifyToken} />
                  </Switch>
                </Container>
              </Box>
            </Box>
          </ThemeProvider>
        </LanguageProvider>
      </AuthContext.Provider>
    </Router>
  );
}