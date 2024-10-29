import { useState, useEffect, SetStateAction } from "react";
import { Add,Edit,Delete } from "@mui/icons-material";
import { Box, Button, Typography, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import api from "../../api";
import { get } from "http";

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

export default function Pacientes() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Paciente[]>([]);

    const getPacientes = () => {
        api.get('pacientes').then(response => {
            setPacientes(response.data);
            setSearchResults(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const deletePaciente = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
        api.delete(`pacientes/${id}`).then(response => {
            getPacientes();
        }).catch(error => {
            console.log(error);
        }); 
    }}

    useEffect(() => {
        getPacientes();
    }, []);

    useEffect(() => {
        const results = pacientes.filter(paciente =>
            paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paciente.cpf.includes(searchTerm)
        );
        setSearchResults(results);
    }, [searchTerm, pacientes]);

    const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(e.target.value);
    };

    return (
        <Box margin={5}>
            <Typography variant="h4" align="center">Pacientes:</Typography>
            <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <TextField
                    label="Pesquisar"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleChange}
                />
            </Box>
            <NavLink to='/pacientes/novo'>
                <Button variant='contained' color='info' endIcon={<Add />} >
                    Novo
                </Button>
            </NavLink>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>CPF</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Cidade</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchResults.map((paciente) => (
                            <TableRow key={paciente.id}>
                                <TableCell>{paciente.nome}</TableCell>
                                <TableCell>{paciente.cpf}</TableCell>
                                <TableCell>{paciente.email}</TableCell>
                                <TableCell>{paciente.telefone}</TableCell>
                                <TableCell>{paciente.cidade}</TableCell>
                                <TableCell>
                                <NavLink to={`/pacientes/${paciente.id}/editar`}>
                                    <IconButton color="primary" aria-label="editar">
                                        <Edit />
                                    </IconButton>
                                </NavLink>
                                    <IconButton color="error" aria-label="excluir" onClick={()=>deletePaciente(paciente.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
