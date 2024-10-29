import { ArrowBack } from "@mui/icons-material";
import { Grid, Typography, FormControl, InputLabel, TextField, Select, MenuItem, Button, Box, Paper, IconButton, CircularProgress } from "@mui/material";
import api from "../../api";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

interface Paciente {
    id: number
    nome: string
    data_nascimento: string
    telefone: string
    sexo: string
    cidade: string
    bairro: string
    profissao: string
    endereco_residencial: string
    endereco_comercial: any
    naturalidade: string
    estado_civil: string
    cpf: string
    email: string
}

export default function PacientesCreate() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [pacienteData, setPacienteData] = useState<Paciente | null>(null);

    useEffect(() => {
        if (id) {
            api.get(`pacientes/${id}`).then(response => {
                setPacienteData(response.data.paciente);
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
            api.put(`pacientes/${id}`, { FormData: data }).then(response => {
                navigate('/pacientes');
            }).catch(error => {
                console.log(error);
                setLoading(false);
            });
            return;
        }
        api.post('pacientes', { FormData: data }).then(response => {
            navigate('/pacientes');
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    };
    if(id && pacienteData === null) return (<Box display='flex' justifyContent='center' alignItems='center' height='100vh'><CircularProgress size={100} /></Box>)

    return (
        <Box margin={5}>
            <NavLink to='/pacientes'>
                <Button variant='text' color='info' startIcon={<ArrowBack />} >
                    Voltar
                </Button>
            </NavLink>
            <Typography variant="h4" align="center" marginTop={0}>Formulário de Pacientes</Typography>

            <Paper elevation={3} sx={{ backgroundColor: '#f5f0f0', '& > *': { padding: 2, marginTop: 2, } }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>

                                <TextField id="nome" name="nome" label={'Nome:'} defaultValue={pacienteData?.nome} required />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                            <TextField id="cpf" name="cpf" label={"CPF:"} defaultValue={pacienteData?.cpf} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                            <TextField id="estado_civil" name="estado_civil" label={"Estado Civil:"} defaultValue={pacienteData?.estado_civil} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                            <TextField id="email" name="email" type="email" required label={"Email:"} defaultValue={pacienteData?.email} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="telefone" name="telefone" required label={"Telefone:"} defaultValue={pacienteData?.telefone}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <TextField id="data_nascimento" name="data_nascimento" type="date" required label={"data de Nascimento:"} defaultValue={pacienteData?.data_nascimento}  />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="sexo">Sexo:</InputLabel>
                                <Select id="sexo" name="sexo" defaultValue={pacienteData?.sexo || 'M'} required>
                                    <MenuItem value="M">Masculino</MenuItem>
                                    <MenuItem value="F">Feminino</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <TextField id="profissao" name="profissao" label={"Profissão:"} defaultValue={pacienteData?.profissao}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <TextField id="cidade" name="cidade" required label={"Cidade:"} defaultValue={pacienteData?.cidade}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <TextField id="bairro" name="bairro" label={"Bairro:"} defaultValue={pacienteData?.bairro}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <TextField id="naturalidade" name="naturalidade" label={"Naturalidade:"} defaultValue={pacienteData?.naturalidade} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="endereco_residencial" name="endereco_residencial" label={"Endereço Residencial:"} defaultValue={pacienteData?.endereco_residencial}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="endereco_comercial" name="endereco_comercial" label={"Endereço Comercial:"} defaultValue={pacienteData?.endereco_comercial}/>
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