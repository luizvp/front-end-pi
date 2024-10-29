import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        api.post('usuarios/login',{usuario:username,senha:password}).then(r=>{
            navigate('/home')
            localStorage.setItem('usuario',username)
            localStorage.setItem('admin',r.data.user.admin)
        }).catch(err=>{
            alert('Credenciais inválidas');
        })
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <Box
                width={300}
                padding={3}
                boxShadow={3}
                borderRadius={5}
                bgcolor="background.paper"
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Login Clínica
                </Typography>
                <TextField
                    label="Usuario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Senha"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </Box>
        </Box>
    );
}
