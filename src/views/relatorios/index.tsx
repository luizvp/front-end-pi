import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import api from "../../api";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const Relatorios = () => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

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
            if (selectedPaciente) {
                const response = await api.get(`agendamentos?paciente_id=${selectedPaciente}`);
                setAgendamentos(response.data);
            }
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
            body: agendamentos.map(a => [a.nome_paciente, a.data, a.hora, a.status]),
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
                   // onChange={handlePacienteChange}
                >
                    {pacientes.map((paciente) => (
                        <MenuItem key={paciente.id} value={paciente.id}>{paciente.nome}</MenuItem>
                    ))}
                </Select>
                <Button variant="contained" color="primary" onClick={fetchAgendamentos} sx={{ mt: 2 }}>
                    Buscar Agendamentos
                </Button>
            </FormControl>
            <Box mt={3}>
                <Typography variant="h6">Agendamentos:</Typography>
                {agendamentos.map((agendamento) => (
                    <Typography key={agendamento.id}>
                        {`${agendamento.data} - ${agendamento.hora} - ${agendamento.status}`}
                    </Typography>
                ))}
            </Box>
            <Button variant="contained" color="secondary" onClick={exportToPDF} sx={{ mt: 3 }}>
                Exportar para PDF
            </Button>
        </Box>
    );
};

export default Relatorios;