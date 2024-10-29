import { ArrowBack } from "@mui/icons-material";
import { Grid, Typography, FormControl, InputLabel, TextField, Select, MenuItem, Button, Box, Paper, IconButton, CircularProgress } from "@mui/material";
import api from "../../api";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

interface Usuario {
    id: number
    usuario: string
    senha:string
    admin:number
}

export default function UsuariosCreate() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [usuarioData, setUsuarioData] = useState<Usuario | null>(null);

    useEffect(() => {
        if (id) {
            api.get(`usuarios/${id}`).then(response => {
                setUsuarioData(response.data.usuario);
            }).catch(error => {
                console.log(error);
            });
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });
        setLoading(true);
        if(id){
            api.put(`usuarios/${id}`, { FormData: data }).then(response => {
                navigate('/usuarios');
            }).catch(error => {
                console.log(error);
                setLoading(false);
            });
            return;
        }
        api.post('usuarios', { FormData: data }).then(response => {
            navigate('/usuarios');
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    };
    if(id && usuarioData === null) return (<Box display='flex' justifyContent='center' alignItems='center' height='100vh'><CircularProgress size={100} /></Box>)

    return (
        <Box margin={5}>
            <NavLink to='/usuarios'>
                <Button variant='text' color='info' startIcon={<ArrowBack />} >
                    Voltar
                </Button>
            </NavLink>
            <Typography variant="h4" align="center" marginTop={0}>Formulário de Usuarios</Typography>

            <Paper elevation={3} sx={{ backgroundColor: '#f5f0f0', '& > *': { padding: 2, marginTop: 2, } }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>

                                <TextField id="usuario" name="usuario" label={'Usuário:'} defaultValue={usuarioData?.usuario} required />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>

                                <TextField type="password" id="senha" name="senha" label={'Senha:'} defaultValue={usuarioData?.senha} required />
                            </FormControl>
                        </Grid>
                   

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : id ?  'Editar' : 'Cadastrar'}
                            </Button>
                        </Grid>
                    </Grid>  </form> </Paper></Box>
    );
}