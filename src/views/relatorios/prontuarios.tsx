import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import api from "../../api";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '../../utilities/helperFunctions';

interface Paciente {
    id: number;
    nome: string;
}

interface Prontuarios {
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
    data_criacao: string;
}

interface Evolucao {
    id: number;
    descricao_evolucao: string;
    data_atendimento: string;
    id_prontuario: number;
}

const Prontuarios = () => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [selectedPacienteId, setSelectedPacienteId] = useState<number | null>(null);
    const [prontuario, setProntuario] = useState<Prontuarios[] | null>(null);
    const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);

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

    const fetchProntuarioEvolucoes = async () => {
        if (selectedPacienteId === null) return;
    
        try {
            // Primeiro, obtenha o prontuário pelo `selectedPacienteId`
            const prontuarioResponse = await api.get(`prontuarios?paciente_id=${selectedPacienteId}`);
            const prontuarioData = prontuarioResponse.data;
            setProntuario(prontuarioData);
            console.log(prontuarioData)
            // Em seguida, obtenha as evoluções usando o `id` do prontuário
            if (prontuarioData[0] && prontuarioData[0].id) {
                const evolucoesResponse = await api.get(`evolucao/${prontuarioData[0].id}`);
                setEvolucoes(evolucoesResponse.data.evolucao); // Note que acessamos `evolucao` no corpo da resposta
            }
        } catch (error) {
            console.error('Erro ao buscar prontuário e evoluções:', error);
        }
    };


    const exportToPDF = () => {
        if (!prontuario) return;

        const doc = new jsPDF();
        doc.text("Relatório de Prontuário e Evoluções - " + pacientes.find(x => x.id === selectedPacienteId)?.nome , 10, 10);

        // Adiciona as informações do Prontuário
        const primeiroY = 20;
        autoTable(doc, {
            head: [['Prontuário do Paciente', '']],
            body: [
                ['História Clínica', prontuario[0].historia_clinica],
                ['Queixa Principal', prontuario[0].queixa_principal],
                ['Hábitos de Vida', prontuario[0].habitos_vida],
                ['HMA', prontuario[0].hma],
                ['HMP', prontuario[0].hmp],
                ['Antecedentes Pessoais', prontuario[0].antecedentes_pessoais],
                ['Antecedentes Familiares', prontuario[0].antecedentes_familiares],
                ['Tratamentos Realizados', prontuario[0].tratamentos_realizados],
                ['Deambulando', prontuario[0].deambulando ? 'Sim' : 'Não'],
                ['Internado', prontuario[0].internado ? 'Sim' : 'Não'],
                ['Apoio para Deambular', prontuario[0].deambulando_apoio ? 'Sim' : 'Não'],
                ['Orientado', prontuario[0].orientado ? 'Sim' : 'Não'],
                ['Cadeira de Rodas', prontuario[0].cadeira_rodas ? 'Sim' : 'Não'],
                ['Exames Complementares', prontuario[0].exames_complementares],
                ['Usa Medicamentos', prontuario[0].usa_medicamentos],
                ['Cirurgias Realizadas', prontuario[0].realizou_cirurgia],
                // ['Data de Criação', formatDate(prontuario[0].data_criacao)],
            ],
            startY: primeiroY,
        });

        // Captura a posição final da tabela de Prontuário para iniciar as evoluções abaixo
        const posicaoFinal = (doc as any).lastAutoTable.finalY || primeiroY + 10;

        // Adiciona as evoluções associadas ao prontuário
        console.log(evolucoes)
        if (evolucoes.length > 0) {
            autoTable(doc, {
                head: [['Data da Evolução', 'Descrição']],
                body: evolucoes.map(evolucao => [
                    formatDate(evolucao.data_atendimento),
                    evolucao.descricao_evolucao,
                ]),
                startY: posicaoFinal + 10,
            });
        } else {
            doc.text("Nenhuma evolução encontrada.", 10, posicaoFinal + 10);
        }

        doc.save(`relatorio_prontuario_paciente_${selectedPacienteId}.pdf`);
    };

    return (
        <Box p={3}>
            <Typography variant="h4">Relatório de Prontuário e Evoluções</Typography>
            <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="paciente-select-label">Selecionar Paciente</InputLabel>
                <Select
                    labelId="paciente-select-label"
                    value={selectedPacienteId || ''}
                    onChange={(event) => setSelectedPacienteId(event.target.value as number)}
                >
                    <MenuItem value="">Selecione um Paciente</MenuItem>
                    {pacientes.map((paciente) => (
                        <MenuItem key={paciente.id} value={paciente.id}>
                            {paciente.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button variant="contained" color="primary" onClick={fetchProntuarioEvolucoes} sx={{ mt: 2 }}>
                Buscar Prontuário e Evoluções
            </Button>

            <Button variant="contained" color="secondary" onClick={exportToPDF} sx={{ mt: 3 }}>
                Exportar para PDF
            </Button>
        </Box>
    );
};

export default Prontuarios;
