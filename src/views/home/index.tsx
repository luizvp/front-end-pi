import { Edit, Delete } from "@mui/icons-material";
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { formatDate } from "../../utilities/helperFunctions";
import agendamentos from "../agendamentos";
import { blue,  } from "@mui/material/colors";
import api from "../../api";
import { useEffect, useState } from "react";

interface Agendamento {
    id: number
    data: string
    hora: string
    id_paciente: number
    nome_paciente: string
    status: string
}

export default function Home() {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [proximoAtendimento, setProximoAtendimento] = useState<Agendamento>();
    const usuarioLogado = localStorage.getItem('usuario')

    useEffect(() => {
        getData();
    }, []);

    const getData = ()=>{
        api.get('home').then(response => {
            console.log(response.data)
            setAgendamentos(response.data[1]);
            setProximoAtendimento(response.data[0]);
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <Box margin={4}>
            <Typography variant="h4" align="center">Bem vindo {usuarioLogado}!</Typography>
            <Typography variant="h5"> Agendamentos do dia atual: </Typography>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Paciente</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Hora</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {agendamentos.map((agendamento) => (
                            <TableRow key={agendamento.id}>
                                <TableCell>{agendamento.nome_paciente}</TableCell>
                                <TableCell>{formatDate(agendamento.data)}</TableCell>
                                <TableCell>{agendamento.hora}</TableCell>
                                <TableCell sx={{color:agendamento.status === 'Realizado' ? 'green' : 'orange' }}> {agendamento.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table></TableContainer>
                <Typography variant="h5"> Proximo atendimento: </Typography>
             {proximoAtendimento && <Typography variant="h6" color={"GrayText"}>{`${proximoAtendimento?.nome_paciente} - ${formatDate(proximoAtendimento?.data!)} ${proximoAtendimento?.hora}`}</Typography>}
        </Box>
    );
}