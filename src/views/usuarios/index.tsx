import { useState, useEffect, SetStateAction } from "react";
import { Add,Edit,Delete } from "@mui/icons-material";
import { Box, Button, Typography, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import api from "../../api";
import { get } from "http";

interface Usuario {
    id: number
    usuario: string
    senha:string
    admin:number
}

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const getUsuario = () => {
        api.get('usuarios').then(response => {
            setUsuarios(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const deleteUsuario = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
        api.delete(`usuarios/${id}`).then(response => {
            getUsuario();
        }).catch(error => {
            console.log(error);
        }); 
    }}

    useEffect(() => {
        getUsuario();
    }, []);



    return (
        <Box margin={5}>
            <Typography variant="h4" align="center">Usuários:</Typography>
            <NavLink to='/usuarios/novo'>
                <Button variant='contained' color='info' endIcon={<Add />} >
                    Novo
                </Button>
            </NavLink>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Usuário</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.usuario}</TableCell>
                                <TableCell>{usuario.admin == 1 ? "Sim" : "Não"}</TableCell>
                                <TableCell>
                                <NavLink to={`/usuarios/${usuario.id}/editar`}>
                                    <IconButton color="primary" aria-label="editar">
                                        <Edit />
                                    </IconButton>
                                </NavLink>
                                    <IconButton color="error" aria-label="excluir" onClick={()=>deleteUsuario(usuario.id)}>
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
