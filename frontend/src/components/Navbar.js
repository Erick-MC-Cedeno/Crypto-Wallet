import React, { useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    AppBar as MuiAppBar,
    Toolbar,
    Box,
    Typography,
    IconButton,
    Link,
    MenuItem,
    Menu,
    Avatar,
    Tooltip,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import {
    Atm as AtmIcon,
    SupportAgent as SupportAgentIcon,
    SwapHoriz as SwapHorizIcon,
    QrCode as QrCodeIcon,
    Menu as MenuIcon,
    AccountBalanceWallet as WalletIcon,
    Settings as SettingsIcon,
    ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import { AuthContext } from '../hooks/AuthContext';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar)(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    mx: 2,
    '&:hover': {
        textDecoration: 'underline',
    },
};

const navLinkItemStyle = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    py: 1,
    px: 2,
};

function DashboardContent() {
    const { auth } = useContext(AuthContext);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { logoutUser } = useAuth();
    const history = useHistory();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleCloseUserMenu = () => setAnchorElUser(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

    const handleClickUserMenu = async (e) => {
        e.stopPropagation();
        const action = e.target.innerHTML;
        if (action === 'Logout') {
            await logoutUser();
            window.location.reload();
        } else if (action === 'Mis billeteras') {
            history.push('/wallets');
        } else if (action === 'Settings') {
            history.push('/settings');
        }
        setAnchorElUser(null);
    };

    const getAvatarColor = (name) => {
        const colors = ['#F6851B', '#3C3C3B', '#E8E8E8'];
        return colors[name.charCodeAt(0) % colors.length];
    };

    if (!auth) return null;

    const settings = [
        { label: `Hi, ${auth.firstName}`, icon: null },
        { label: 'Mis billeteras', icon: <WalletIcon sx={{ mr: 1 }} /> },
        { label: 'Settings', icon: <SettingsIcon sx={{ mr: 1 }} /> },
        { label: 'Logout', icon: <LogoutIcon sx={{ mr: 1 }} /> },
    ];

    const navItems = [
        { href: '/welcome', label: 'Crypto Soporte', Icon: SupportAgentIcon },
        { href: 'https://portfolio.metamask.io/swap?_gl=1*6qza6d*_gcl_au*MTMzNjQ0NzQwNi4xNzIzNTk2MTA5', label: 'Swap Coin', Icon: SwapHorizIcon },
        { href: '/providers', label: 'Vender P2P', Icon: QrCodeIcon  },
        { href: '/create', label: 'Proveedor P2P', Icon: QrCodeIcon  },
    ];

    const renderNavLinks = () => (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {navItems.map(({ href, label, Icon }) => (
                <Link key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} sx={navLinksStyle}>
                    <Icon sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{label}</Typography>
                </Link>
            ))}
        </Box>
    );

    return (
        <>
            <AppBar position="absolute">
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: '24px' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Link href='/' sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                                NextCryptoATM
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
                                    }}
                                >
                                    <AtmIcon sx={{ color: 'white' }} />
                                </Box>
                            </Typography>
                        </Link>
                    </Box>

                    {isMobile ? (
                        <>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                                <Box
                                    sx={{ width: drawerWidth, paddingTop: 8 }}
                                    role="presentation"
                                    onClick={() => setDrawerOpen(false)}
                                    onKeyDown={() => setDrawerOpen(false)}
                                >
                                    <List>
                                        {navItems.map(({ href, label, Icon }) => (
                                            <ListItem button component={Link} key={label} href={href} sx={navLinkItemStyle}>
                                                <Icon sx={{ mr: 1 }} />
                                                <ListItemText primary={label} />
                                            </ListItem>
                                        ))}
                                        <Divider />
                                        {settings.map(({ label, icon }) => (
                                            <ListItem button key={label} onClick={handleClickUserMenu} sx={navLinkItemStyle}>
                                                {icon}
                                                <ListItemText primary={label} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        renderNavLinks()
                    )}

                    <Box>
                        <Tooltip title="Open settings">
                            <IconButton onClick={(e) => { e.stopPropagation(); handleOpenUserMenu(e); }} sx={{ p: 0 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: getAvatarColor(auth.firstName),
                                        width: 35,
                                        height: 35,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#fff',
                                    }}
                                >
                                    {auth.firstName.charAt(0)}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            anchorEl={anchorElUser}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map(({ label, icon }) => (
                                <MenuItem key={label} onClick={handleClickUserMenu}>
                                    {icon}
                                    <Typography textAlign="center">{label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default function Navbar() {
    return <DashboardContent />;
}
