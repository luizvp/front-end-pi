import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import api from "../../api";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Paciente {
    id: number;
    nome: string;
    data_nascimento: string;
    telefone: string;
    sexo: string;
    cidade: string;
    bairro: string;
    profissao: string;
    endereco_residencial: string;
    endereco_comercial: string;
    naturalidade: string;
    estado_civil: string;
    cpf: string;
    email: string;
}

interface Prontuario {
    id: number;
    historia_clinica: string;
    queixa_principal: string;
    habitos_vida: string;
    hma: string;
    hmp: string;
    antecedentes_pessoais: string;
    antecedentes_familiares: string;
    tratamentos_realizados: string;
    deambulando: boolean;
    internado: boolean;
    deambulando_apoio: boolean;
    orientado: boolean;
    cadeira_rodas: boolean;
    exames_complementares: string;
    usa_medicamentos: string;
    realizou_cirurgia: string;
    inspecao_palpacao: string;
    semiotica: string;
    testes_especificos: string;
    avaliacao_dor: string;
    objetivos_tratamento: string;
    recursos_terapeuticos: string;
    plano_tratamento: string;
    diagnostico_clinico: string;
    diagnostico_fisioterapeutico: string;
    nome_paciente: string;
    data_criacao: string;
    quantidade_evolucoes: string;
}

interface Evolucao {
    id: number;
    descricao_evolucao: string;
    data_atendimento: string;
    id_prontuario: number;
}

// Função para formatar data no estilo brasileiro
const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
};

const Paciente = () => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
    const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);

    useEffect(() => {
        fetchPacientes();
    }, []);

    const fetchPacientes = async () => {
        try {
            const response = await api.get('pacientes');
            setPacientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
        }
    };

    const fetchProntuarios = async (pacienteId: number) => {
        try {
            const response = await api.get(`prontuarios?paciente_id=${pacienteId}`);
            setProntuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar prontuários:', error);
        }
    };

    const handlePacienteChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const pacienteId = event.target.value as number;
        const paciente = pacientes.find((p) => p.id === pacienteId) || null;
        setSelectedPaciente(paciente);
        if (paciente) {
            fetchProntuarios(paciente.id);
        }
    };

  // Modifique apenas a seção de exportação para PDF
const exportToPDF = () => {
    if (!selectedPaciente) return;
    
    const doc = new jsPDF();
    doc.text("Relatório do Paciente", 10, 10);

    // Adiciona as informações do Paciente
    autoTable(doc, {
        head: [['Informações do Paciente', '']],
        body: [
            ['Nome', selectedPaciente.nome],
            ['Data de Nascimento', formatarData(selectedPaciente.data_nascimento)],
            ['Telefone', selectedPaciente.telefone],
            ['Sexo', selectedPaciente.sexo],
            ['Cidade', selectedPaciente.cidade],
            ['Bairro', selectedPaciente.bairro],
            ['Profissão', selectedPaciente.profissao],
            ['Endereço Residencial', selectedPaciente.endereco_residencial],
            ['Endereço Comercial', selectedPaciente.endereco_comercial],
            ['Naturalidade', selectedPaciente.naturalidade],
            ['Estado Civil', selectedPaciente.estado_civil],
            ['CPF', selectedPaciente.cpf],
            ['Email', selectedPaciente.email],
        ],
        startY: 20,
    });

    // Prontuários e Evoluções
    prontuarios.forEach((prontuario) => {
        doc.addPage();
        doc.text(`Prontuário ID: ${prontuario.id}`, 10, 10);
        autoTable(doc, {
            head: [['Detalhes do Prontuário', '']],
            body: [
                ['História Clínica', prontuario.historia_clinica],
                ['Queixa Principal', prontuario.queixa_principal],
                ['Hábitos de Vida', prontuario.habitos_vida],
                ['HMA', prontuario.hma],
                ['HMP', prontuario.hmp],
                ['Antecedentes Pessoais', prontuario.antecedentes_pessoais],
                ['Antecedentes Familiares', prontuario.antecedentes_familiares],
                ['Tratamentos Realizados', prontuario.tratamentos_realizados],
                ['Deambulando', prontuario.deambulando ? 'Sim' : 'Não'],
                ['Internado', prontuario.internado ? 'Sim' : 'Não'],
                ['Apoio para Deambular', prontuario.deambulando_apoio ? 'Sim' : 'Não'],
                ['Orientado', prontuario.orientado ? 'Sim' : 'Não'],
                ['Cadeira de Rodas', prontuario.cadeira_rodas ? 'Sim' : 'Não'],
                ['Exames Complementares', prontuario.exames_complementares],
                ['Usa Medicamentos', prontuario.usa_medicamentos],
                ['Cirurgias Realizadas', prontuario.realizou_cirurgia],
                ['Data de Criação', formatarData(prontuario.data_criacao)],
            ],
        });

    });

    doc.save(`relatorio_paciente_${selectedPaciente.nome}.pdf`);
};


    return (
        <Box p={3}>
            <Typography variant="h4">Relatório do Paciente</Typography>
            <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="paciente-select-label">Selecionar Paciente</InputLabel>
                <Select
                    labelId="paciente-select-label"
                    value={selectedPaciente?.id || ''}
                    onChange={(event) => handlePacienteChange(event as any)}
                >
                    <MenuItem value="">Selecione um Paciente</MenuItem>
                    {pacientes.map((paciente) => (
                        <MenuItem key={paciente.id} value={paciente.id}>{paciente.nome}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedPaciente && (
                <Box mt={3}>
                    <Typography variant="h6">Informações do Paciente:</Typography>
                    <Typography>{`Nome: ${selectedPaciente.nome}`}</Typography>
                    <Typography>{`Data de Nascimento: ${formatarData(selectedPaciente.data_nascimento)}`}</Typography>
                    <Typography>{`Telefone: ${selectedPaciente.telefone}`}</Typography>
                    <Typography>{`Cidade: ${selectedPaciente.cidade}`}</Typography>
                    {/* Adicione outras informações conforme necessário */}
                </Box>
            )}

            <Button variant="contained" color="secondary" onClick={exportToPDF} sx={{ mt: 3 }}>
                Exportar para PDF
            </Button>
        </Box>
    );
};

export default Paciente;
