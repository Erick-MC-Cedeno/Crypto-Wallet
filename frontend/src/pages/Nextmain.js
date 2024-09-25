import React from 'react';
import {
    AppBar, Toolbar, Typography, Box, Link, Button, IconButton, Drawer,
    List, ListItem, ListItemText, Divider, Grid, Card, CardContent
} from '@mui/material';
import AtmIcon from '@mui/icons-material/Atm';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import heroBanner from '../assets/hero-banner.png';
import blockchainImg from '../assets/blockchain.png';
import web3Img from '../assets/web3.png';
import zetachainlogo from '../assets/zetachain.png';
import QrCodeIcon from '@mui/icons-material/QrCode';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const pairs = [
    { label: 'Bitcoin (BTC)', value: 'bitcoin', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { label: 'Ethereum (ETH)', value: 'ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { label: 'Polygon (MATIC)', value: 'matic-network', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
    { label: 'Binance (BNB)', value: 'binancecoin', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
    { label: 'Fantom (FTM)', value: 'fantom', logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.png' },
    { label: 'Avalanche (AVAX)', value: 'avalanche-2', logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
    { label: 'Optimism (OP)', value: 'BINANCE:OPUSDT', logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png' },
    { label: 'Zetachain (ZETA)', value: 'BINANCE:ZETAUSDT', logo: zetachainlogo }
];

const navItems = [
    { to: '/create', icon: <QrCodeIcon />, text: 'Proveedor P2P' },
    { to: '/providers', icon: <QrCodeIcon />, text: 'Vender P2P' },
    { to: '/servicios', icon: <RecentActorsIcon />, text: 'Servicios' },
    { to: '/contactanos', icon: <ContactMailIcon />, text: 'Contáctanos' }
];

const Nextmain = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <List>
                {navItems.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText>
                            <Link
                                component={RouterLink}
                                to={item.to}
                                sx={{
                                    textDecoration: 'none',
                                    color: 'text.primary',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem',
                                }}
                            >
                                {item.icon && <span style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>{item.icon}</span>}
                                {item.text}
                            </Link>
                        </ListItemText>
                    </ListItem>
                ))}
                <ListItem>
                    <ListItemText>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="outlined"
                            color="inherit"
                            sx={{
                                width: '100%',
                                mb: 1,
                                borderColor: 'text.primary',
                                fontSize: '0.75rem',
                                '&:hover': {
                                    borderColor: '#FFD700',
                                    color: '#FFD700',
                                },
                            }}
                        >
                            Iniciar sesión
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            color="primary"
                            sx={{
                                width: '100%',
                                fontSize: '0.75rem',
                            }}
                        >
                            Registrarse
                        </Button>
                    </ListItemText>
                </ListItem>
            </List>
        </Box>
    );
    return (
        <div>
            <AppBar position="fixed" sx={{ width: '100%', top: 0, bgcolor: '#1976d2' }}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { xs: 'block', sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
    
                    {/* Logo and Title */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                            NextCryptoATM
                        </Typography>
                        <Box
                            sx={{
                                m: 1,
                                width: 45,
                                height: 50,
                                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                                bgcolor: '#2186EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ml: 1,
                            }}
                        >
                            <AtmIcon sx={{ color: 'white' }} />
                        </Box>
                    </Box>
    
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                        <Link
                            component={RouterLink}
                            to="/create"
                            sx={{ color: 'white', textDecoration: 'none', marginLeft: 4, fontWeight: 'bold', fontSize: '0.9rem', '&:hover': { textDecoration: 'underline', color: '#FFD700' } }}
                        >
                            <QrCodeIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            Proveedor P2P
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/providers"
                            sx={{ color: 'white', textDecoration: 'none', marginLeft: 4, fontWeight: 'bold', fontSize: '0.9rem', '&:hover': { textDecoration: 'underline', color: '#FFD700' } }}
                        >
                            <QrCodeIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            Vender P2P
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/servicios"
                            sx={{ color: 'white', textDecoration: 'none', marginLeft: 4, fontWeight: 'bold', fontSize: '0.9rem', '&:hover': { textDecoration: 'underline', color: '#FFD700' } }}
                        >
                            <RecentActorsIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            Servicios
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/contactanos"
                            sx={{ color: 'white', textDecoration: 'none', marginLeft: 4, fontWeight: 'bold', fontSize: '0.9rem', '&:hover': { textDecoration: 'underline', color: '#FFD700' } }}
                        >
                            <ContactMailIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            Contáctanos
                        </Link>
                    </Box>

                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="outlined"
                            color="inherit"
                            sx={{
                                marginLeft: 2,
                                fontWeight: 'bold',
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    borderColor: '#FFD700',
                                    color: '#FFD700',
                                },
                            }}
                        >
                            Iniciar sesión
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            color="primary"
                            sx={{
                                marginLeft: 2,
                                fontWeight: 'bold',
                                '&:hover': {
                                    bgcolor: '#004ba0',
                                },
                            }}
                        >
                            Registrarse
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {drawer}
            </Drawer>

            <main style={{ marginTop: '64px', padding: '16px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography variant="h4" sx={{ flexShrink: 0, mb: 2 }}>
                            Welcome to NextCryptoATM
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                            Your gateway to the future of crypto transactions.
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/"
                            variant="contained"
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                        >
                                                       Get Started
                        </Button>
                    </Box>
                    <img
                        src={heroBanner}
                        alt="Hero Banner"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            flexShrink: 0,
                        }}
                    />
                </Box>
                <Divider sx={{ my: 10, bgcolor: '#ddd', height: 2 }} />
                <Box
    sx={{
        padding: 4,
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e0e5e8 100%)',
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
    }}
>


<Typography variant="h4" sx={{ textAlign: 'center', mb: 2, color: '#333', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'Roboto, sans-serif' }}>
    We Offer These Networks
</Typography>

<Typography variant="h6" sx={{ textAlign: 'center', mb: 4, color: '#555', fontWeight: 'normal', fontFamily: 'Roboto, sans-serif', fontStyle: 'italic' }}>
    Bridging the Gap in Digital Finance
</Typography>

<Box
    sx={{
        display: 'flex',
        overflowX: 'auto',
        scrollBehavior: 'smooth',
        width: '100%',
        '&::-webkit-scrollbar': {
            display: 'none', 
        },
        '&:hover': {
            '& .logos-container': {
                transform: 'translateX(-20%)', 
            }
        }
    }}
>
    <Box
        className="logos-container"
        sx={{
            display: 'flex',
            transition: 'transform 0.5s ease-in-out',
            width: 'max-content',
        }}
    >
        {pairs.map((pair) => (
            <Box
                key={pair.value}
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 2, 
                    borderRadius: '50%', 
                    background: 'transparent', 
                    boxShadow: '0 0 20px rgba(0, 255, 200, 0.8)', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease', 
                    '&:hover': { 
                        transform: 'scale(1.1)', 
                        boxShadow: '0 0 30px rgba(0, 255, 200, 1)', 
                        background: 'transparent' 
                    },
                    mx: 1 
                }}
            >
                <img
                    src={pair.logo}
                    alt={pair.label}
                    style={{
                        maxWidth: '80px',
                        height: 'auto',
                        objectFit: 'contain',
                    }}
                />
            </Box>
        ))}
    </Box>
</Box>
</Box>


<Divider sx={{ my: 10, bgcolor: '#ddd', height: 2 }} />

<Box
    sx={{
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.15) 100%)',
        padding: 4,
        borderRadius: 4,
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    }}
>
    <Typography variant="h4" sx={{ mb: 4, color: '#000', fontWeight: 'bold' }}>
        Our Core Values
    </Typography>

    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 4,
        }}
    >
        {[
            {
                title: 'Who We Are',
                content: 'We are a dynamic team dedicated to transforming electronic payments with innovative cryptocurrency solutions. Our expertise in blockchain technology allows us to offer secure, efficient, and cutting-edge payment systems.',
                details: 'Our team combines finance and technology skills to stay at the forefront of industry advancements.'
            },
            {
                title: 'Our Mission',
                content: 'To create a financial ecosystem where cryptocurrency transactions are seamless and accessible. We aim to break down entry barriers and empower users with advanced tools for global adoption of digital currencies.',
                details: 'We develop user-friendly platforms that make cryptocurrency transactions intuitive and reliable for all.'
            },
            {
                title: 'Our Vision',
                content: 'A future where cryptocurrency is integral to everyday transactions, driving financial inclusion and innovation. We strive to make digital currencies commonplace in daily life.',
                details: 'Our focus is on creating practical solutions that facilitate widespread use of digital currencies.'
            },
            {
                title: 'Our Passion',
                content: 'Passionate about technology and blockchain, we are committed to revolutionizing payments with advanced solutions. Our drive for progress ensures exceptional products and service.',
                details: 'We explore new ideas and technologies to enhance our offerings and maintain industry leadership.'
            }
        ].map((card, index) => (
            <Card
                key={index}
                sx={{
                    maxWidth: 345,
                    textAlign: 'center',
                    borderRadius: 4,
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                    bgcolor: '#ffffff',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#000', fontWeight: 'bold' }}>
                        {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#444', mb: 2 }}>
                        {card.content}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        {card.details}
                    </Typography>
                </CardContent>
            </Card>
        ))}
    </Box>
</Box>

                <Divider sx={{ my: 10, bgcolor: '#ddd', height: 2 }} />
<Box sx={{ padding: 4, backgroundColor: '#ffffff', borderRadius: 4, boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)' }}>
    <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: '#000', fontWeight: 'bold', letterSpacing: '1px' }}>
        Nuestra Tecnología
    </Typography>
    
    <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src={web3Img}
                    alt="Web 3.0"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 255, 200, 0.3)', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
                />
            </Box>
        </Grid>
        <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2196F3', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                Sistema de Pagos Descentralizado
            </Typography>
            <Typography variant="body1" sx={{ color: '#000', fontFamily: 'Roboto, sans-serif' }}>
                Nuestra tecnología se basa en la blockchain para ofrecer un sistema de pagos descentralizado que garantiza transparencia, seguridad y eficiencia. Utilizamos contratos inteligentes y la infraestructura de Web 3.0 para permitir transacciones directas entre usuarios sin intermediarios, reduciendo costos y aumentando la velocidad de las transacciones.
            </Typography>
        </Grid>
    </Grid>
    
    <Divider sx={{ my: 4, bgcolor: '#333', height: 2 }} />
    
    <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2196F3', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                Cómo Funciona una Wallet Crypto Basada en RPC
            </Typography>
            <Typography variant="body1" sx={{ color: '#000', fontFamily: 'Roboto, sans-serif' }}>
                Una wallet crypto basada en RPC (Remote Procedure Call) permite interactuar con la blockchain de manera segura. Al usar RPC, la wallet se comunica con un nodo de la blockchain para realizar operaciones como consultar el saldo, enviar transacciones o recibir notificaciones de eventos. Este enfoque ofrece una capa adicional de seguridad y descentralización, asegurando que las transacciones se realicen de manera eficiente y confiable.
            </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src={require('../assets/wallet.png')}
                    alt="Wallet Crypto RPC"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 255, 200, 0.3)', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
                />
            </Box>
        </Grid>
    </Grid>
    
    <Divider sx={{ my: 4, bgcolor: '#333', height: 2 }} />
    
    
    <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src={blockchainImg}
                    alt="Blockchain Technology"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 255, 200, 0.3)', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
                />
            </Box>
        </Grid>
        <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2196F3', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                Por qué usar Blockchain
            </Typography>
            <Typography variant="body1" sx={{ color: '#000', fontFamily: 'Roboto, sans-serif' }}>
                La tecnología blockchain asegura que todas las transacciones sean inmutables y accesibles públicamente, ofreciendo un registro confiable y auditable de todas las actividades. Esto no solo proporciona una capa adicional de seguridad, sino que también fomenta una mayor confianza entre los participantes del sistema.
            </Typography>
        </Grid>
    </Grid>
</Box>

<Divider sx={{ my: 10, bgcolor: '#ddd', height: 2 }} />
<Box
    sx={{
        padding: 4,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    }}
>
    <Typography
        variant="h4"
        sx={{
            textAlign: 'center',
            mb: 4,
            color: '#000',
            fontWeight: 'bold',
            letterSpacing: '1px',
        }}
    >
        Trading View
    </Typography>

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <iframe
            src="https://www.tradingview.com/widgetembed/?frameElementId=tradingview_12345&symbol=BTCUSD"
            width="100%"
            height="600"
            frameBorder="0"
            allowTransparency
            scrolling="no"
            allow="encrypted-media"
            title="Trading View"
            sx={{ borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)' }}
        ></iframe>
    </Box>
</Box>

</main>
</div>
);
};

export default Nextmain;
