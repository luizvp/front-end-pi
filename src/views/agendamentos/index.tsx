import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import api from "../../api";
import { SetStateAction, useEffect, useState } from "react";
import { formatDate } from "../../utilities/helperFunctions";

interface Paciente {
    id: number
    nome: string
}

interface Agendamento {
    id: number
    data: string
    hora: string
    id_paciente: number
    nome_paciente: string
    status: string
}

export default function Agendamentos() {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [dataAgendamento, setDataAgendamento] = useState('')
    const [horaAgendamento, setHoraAgendamento] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const getAgendamentos = () => {
        api.get('agendamentos').then(response => {
            console.log(response.data)
            setAgendamentos(response.data);
        }).catch(error => {
            console.log(error);
        });
    }
    const fetchPacientes = async () => {
        try {
            const response = await api.get('pacientes')
            setPacientes(response.data);
        } catch (error) {
            console.error('Error fetching pacientes:', error);
        }
    };

    useEffect(() => {
        getAgendamentos()
        fetchPacientes()
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSelectChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedPaciente(event.target.value);
    };
    const createAgendamento = () => {
        api.post('agendamentos', {
            FormData: {
                data: dataAgendamento, hora: horaAgendamento, id_paciente: selectedPaciente
            }
        }).then(response => {
            console.log(response.data)
            getAgendamentos()
            handleCloseModal()
        }).catch(error => {
            console.log(error)
        })
    }

    const filteredAgendamentos = agendamentos.filter((agendamento) => {
        const matchesSearch = agendamento.nome_paciente.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = filterDate ? agendamento.data === filterDate : true;
        console.log(agendamento.data)
        console.log(filterDate)
        return matchesSearch && matchesDate;
    });

    return (
        <Box margin={5}>
            <Typography variant="h4" align="center">Agendamentos:</Typography>
           
            <Button variant='contained' color='info' endIcon={<Add />} onClick={handleOpenModal}>
                Novo
            </Button>
            <Box display="flex" justifyContent="flex-end" marginBottom={2}>
            <TextField
                label="Buscar por Paciente"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginRight: 10 }}
            />
            <TextField
                label="Filtrar por Data"
                type="date"
                variant="outlined"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button onClick={() => { setSearchTerm(''); setFilterDate(''); }} color="secondary">
    Limpar Filtros
</Button>
</Box>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Paciente</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Hora</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {filteredAgendamentos.map((agendamento) => (
                    <TableRow key={agendamento.id}>
                        <TableCell>{agendamento.nome_paciente}</TableCell>
                        <TableCell>{formatDate(agendamento.data)}</TableCell>
                        <TableCell>{agendamento.hora}</TableCell>
                        <TableCell sx={{color:agendamento.status === 'Realizado' ? 'green' : 'orange' }}> {agendamento.status}</TableCell>
                        <TableCell>
                            <IconButton color="primary">
                                <Edit />
                            </IconButton>
                            <IconButton color="error">
                                <Delete />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
                <DialogTitle>Novo agendamento</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel id="idPaciente-label">Paciente</InputLabel>
                        <Select
                            labelId="idPaciente-label"
                            id="idPaciente"
                            value={selectedPaciente}
                            onChange={handleSelectChange}
                            required
                        >
                            {pacientes.map((paciente) => (
                                <MenuItem key={paciente.id} value={paciente.id}>{paciente.nome}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography>Data Evolução:</Typography>
                    <TextField id="data_nascimento" name="data_nascimento" type="date" required value={dataAgendamento}
                        onChange={(e) => setDataAgendamento(e.target.value)} />
                    <Typography>Hora:</Typography>
                    <TextField id="hora" name="hora" type="time" required value={horaAgendamento} onChange={(e) => setHoraAgendamento(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancelar</Button>
                    <Button onClick={createAgendamento} color="primary">Adicionar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}