import * as React from 'react';
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
import AtmIcon from '@mui/icons-material/Atm';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import MenuIcon from '@mui/icons-material/Menu';
import useAuth from '../hooks/useAuth';
import { AuthContext } from '../hooks/AuthContext';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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
    const { auth } = React.useContext(AuthContext);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { logoutUser } = useAuth();
    const history = useHistory();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleCloseUserMenu = () => setAnchorElUser(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

    const handleClickUserMenu = async (e) => {
        e.stopPropagation(); // Evita la propagación del clic
        if (e.target.innerHTML === 'Logout') {
            await logoutUser();
            window.location.reload();
        } else if (e.target.innerHTML === 'Mis billeteras') {
            history.push('/wallets');

        } else if (e.target.innerHTML === 'Settings') {
            history.push('/settings');
        }
        setAnchorElUser(null);
    };
    

    const getAvatarColor = (name) => {
        const colors = ['#F6851B', '#3C3C3B', '#E8E8E8'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (!auth) return null;

    const settings = [`Hi, ${auth.firstName}`, 'Mis billeteras', 'Settings', 'Logout'];
    


    const navLinks = (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Link target="_blank" href='/welcome' sx={navLinksStyle}>
                <SupportAgentIcon sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Crypto Soporte
                </Typography>
            </Link>
            <Link target="_blank" href='https://portfolio.metamask.io/swap?_gl=1*6qza6d*_gcl_au*MTMzNjQ0NzQwNi4xNzIzNTk2MTA5' sx={navLinksStyle}>
                <SwapHorizIcon sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Swap Coin
                </Typography>
            </Link>
            <Link href='/providers' sx={navLinksStyle}>
                <MobileFriendlyIcon sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Vender P2P
                </Typography>
            </Link>
            <Link href='/create' sx={navLinksStyle}>
                <ArrowForwardIosIcon sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Proveedor P2P
                </Typography>
            </Link>
        </Box>
    );

    return (
        <>
            <AppBar position="absolute">
                <Toolbar sx={{ pr: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                    sx={{ 
                                        width: drawerWidth, 
                                        paddingTop: 8 
                                    }}
                                    role="presentation"
                                    onClick={() => setDrawerOpen(false)}
                                    onKeyDown={() => setDrawerOpen(false)}
                                >
                                    <List>
                                        <ListItem button component={Link} href='/welcome' sx={navLinkItemStyle}>
                                            <SupportAgentIcon sx={{ mr: 1 }} />
                                            <ListItemText primary="Crypto Soporte" />
                                        </ListItem>
                                        <ListItem button component={Link} href='https://portfolio.metamask.io/swap?_gl=1*6qza6d*_gcl_au*MTMzNjQ0NzQwNi4xNzIzNTk2MTA5' sx={navLinkItemStyle}>
                                            <SwapHorizIcon sx={{ mr: 1 }} />
                                            <ListItemText primary="Swap Coin" />
                                        </ListItem>
                                        <ListItem button component={Link} href='/providers' sx={navLinkItemStyle}>
                                            <MobileFriendlyIcon sx={{ mr: 1 }} />
                                            <ListItemText primary="Vender P2P" />
                                        </ListItem>
                                        <ListItem button component={Link} href='/create' sx={navLinkItemStyle}>
                                            <ArrowForwardIosIcon sx={{ mr: 1 }} />
                                            <ListItemText primary="Proveedor P2P" />
                                        </ListItem>
                                        <Divider />
                                        {settings.map((setting) => (
                                            <ListItem button key={setting} onClick={handleClickUserMenu} sx={navLinkItemStyle}>
                                                <ListItemText primary={setting} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        navLinks
                    )}

                    <Box>
                        <Tooltip title="Open settings">
                            <IconButton onClick={(e) => {
                                e.stopPropagation(); 
                                handleOpenUserMenu(e);
                            }} sx={{ p: 0 }}>
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
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={handleClickUserMenu}>
                                <Typography textAlign="center">{setting}</Typography>
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