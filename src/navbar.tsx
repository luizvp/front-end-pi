import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate, useLocation } from 'react-router-dom';

const pages = ['Dashboard', 'Home', 'Pacientes', 'Prontuarios', 'Agendamentos', 'Pagamentos', 'Relatórios', 'ANÁLISES'];
if (localStorage.getItem('admin') === '1') pages.push('Usuarios');

function ResponsiveAppBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    // Verificação de autenticação
    React.useEffect(() => {
        if (!localStorage.getItem('usuario')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = (page: string) => {
        setAnchorElNav(null);
        // Mapear ANÁLISES para ml (rota existente)
        const route = page === 'ANÁLISES' ? 'ml' : page.toLowerCase();
        navigate(`/${route}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    if (location.pathname === '/login' || location.pathname === '/') return <></>;

    return (
        <header>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters component="nav" aria-label="Barra de navegação principal">
                        <IconButton 
                            aria-label="Menu da clínica" 
                            color="inherit" 
                            edge="start"
                            sx={{ display: { xs: 'none', md: 'block' }, mr: 1 }} 
                        >
                            <AdbIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="h1"
                            aria-label="Nome da clínica"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Clínica
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="Abrir menu de navegação"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={() => setAnchorElNav(null)}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => handleCloseNavMenu(page)}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        display: 'block',
                                        bgcolor: location.pathname.includes(page.toLowerCase()) ? 'rgba(252, 254, 223, 0.4)' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.08)',
                                        },
                                    }}
                                    aria-label={`Navegar para ${page}`}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>
                        <Button
                            onClick={handleLogout}
                            aria-label="Sair da conta"
                            sx={{
                                my: 2,
                                color: 'black',
                                display: 'block',
                                bgcolor: 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                                },
                            }}
                        >
                            Sair
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </header>
    );
}

export default ResponsiveAppBar;
