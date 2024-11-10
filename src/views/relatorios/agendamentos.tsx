import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button, TextField } from '@mui/material';
import api from "../../api";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '../../utilities/helperFunctions';

interface Paciente {
    id: number;
    nome: string;
}

interface Agendamento {
    id: number;
    data: string;
    hora: string;
    status: string;
    nome_paciente: string;
}

const Agendamentos = () => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [status, setStatus] = useState("Todos");


    useEffect(() => {
        fetchPacientes();
    }, []);

    const fetchPacientes = async () => {
        try {
            const response = await api.get('pacientes');
            setPacientes(response.data);
        } catch (error) {
            console.error('Error fetching pacientes:', error);
        }
    };

    const fetchAgendamentos = async () => {
        try {
            const response = await api.get(`agendamentos?paciente_id=${selectedPaciente}&status=${status}`);
            setAgendamentos(response.data);
        } catch (error) {
            console.error('Error fetching agendamentos:', error);
        }
    };

    const handlePacienteChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedPaciente(event.target.value as string);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Relatório de Agendamentos", 10, 10);
        autoTable(doc, {
            head: [['Paciente', 'Data', 'Hora', 'Status']],
            body: agendamentos.map(a => [a.nome_paciente, formatDate(a.data), a.hora, a.status]), // Formatação da data no PDF
        });
        doc.save('relatorio_agendamentos.pdf');
    };

    return (
        <Box p={3}>
            <Typography variant="h4">Relatórios de Agendamentos</Typography>
            <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="paciente-select-label">Selecionar Paciente</InputLabel>
                <Select
                    labelId="paciente-select-label"
                    value={selectedPaciente}
                    onChange={(event)=>handlePacienteChange(event as any)}
                >
                    <MenuItem value="">Todos os Pacientes</MenuItem>
                    {pacientes.map((paciente) => (
                        <MenuItem key={paciente.id} value={paciente.id}>{paciente.nome}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 3 }}>
    <InputLabel id="status-select-label">Status do Agendamento</InputLabel>
    <Select
        labelId="status-select-label"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
    >
        <MenuItem value="Todos">Todos</MenuItem>
        <MenuItem value="Realizado">Realizado</MenuItem>
        <MenuItem value="Em aberto">Em aberto</MenuItem>
    </Select>
</FormControl>

            <Button variant="contained" color="primary" onClick={fetchAgendamentos} sx={{ mt: 2 }}>
                Buscar Agendamentos
            </Button>

            <Box mt={3}>
                <Typography variant="h6">Agendamentos:</Typography>
                {agendamentos.length > 0 ? (
                    agendamentos.map((agendamento) => (
                        <Typography key={agendamento.id}>
                            {`${agendamento.nome_paciente} - ${formatDate(agendamento.data)} - ${agendamento.hora} - ${agendamento.status}`}
                        </Typography>
                    ))
                ) : (
                    <Typography>Nenhum agendamento encontrado.</Typography>
                )}
            </Box>

            <Button variant="contained" color="secondary" onClick={exportToPDF} sx={{ mt: 3 }}>
                Exportar para PDF
            </Button>
        </Box>
    );
};

export default Agendamentos;
