import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../../api';
import { formatDate } from '../../utilities/helperFunctions';

interface Pendencia {
    id: number;
    data: string;
    hora: string;
    nome_paciente: string;
    valor_consulta: number;
    valor_pago?: number;
    status_pagamento: string;
    valor_pendente: number;
}

const PagamentosPendentes = () => {
    const [pendencias, setPendencias] = useState<Pendencia[]>([]);
    const [loading, setLoading] = useState(false);
    const [mostrarAtrasados, setMostrarAtrasados] = useState(false);

    const fetchPendencias = async () => {
        setLoading(true);
        try {
            const response = await api.get('/pagamentos/pendentes');

            const parsed = (response.data.agendamentos_pendentes || []).map((p: any) => ({
                ...p,
                valor_consulta: parseFloat(p.valor_consulta) || 0,
                valor_pago: parseFloat(p.valor_pago) || 0,
                valor_pendente: parseFloat(p.valor_pendente) || 0,
            }));

            setPendencias(parsed);
        } catch (error) {
            console.error('Erro ao buscar pendências:', error);
        } finally {
            setLoading(false);
        }
    };

    const now = new Date();

    const pendenciasFiltradas = pendencias.filter((p) => {
        if (!mostrarAtrasados) return true;

        const dataHora = new Date(`${p.data}T${p.hora}`);
        return dataHora < now;
    });

    const totalFiltrado = pendenciasFiltradas.reduce(
        (sum, p) => sum + (p.valor_pendente ?? 0),
        0
    );

    const exportToPDF = () => {
        const doc = new jsPDF() as jsPDF & { lastAutoTable?: { finalY: number } };

        doc.text('Relatório de Pagamentos Pendentes', 10, 10);

        autoTable(doc, {
            startY: 20,
            head: [['Paciente', 'Data', 'Hora', 'Valor Consulta', 'Valor Pago', 'Valor Pendente']],
            body: pendenciasFiltradas.map(p => [
                p.nome_paciente,
                formatDate(p.data),
                p.hora,
                `R$ ${(p.valor_consulta ?? 0).toFixed(2)}`,
                `R$ ${(p.valor_pago ?? 0).toFixed(2)}`,
                `R$ ${(p.valor_pendente ?? 0).toFixed(2)}`
            ])
        });

        const finalY = doc.lastAutoTable?.finalY || 20;
        doc.text(`Total Pendente: R$ ${totalFiltrado.toFixed(2)}`, 10, finalY + 10);

        doc.save('relatorio_pagamentos_pendentes.pdf');
    };

    useEffect(() => {
        fetchPendencias();
    }, []);

    return (
        <Box p={3}>
            <Typography variant="h4">Relatório de Pagamentos Pendentes</Typography>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={mostrarAtrasados}
                        onChange={(e) => setMostrarAtrasados(e.target.checked)}
                    />
                }
                label="Mostrar apenas pagamentos atrasados"
                sx={{ mt: 2 }}
            />

            {loading ? (
                <CircularProgress sx={{ mt: 3 }} />
            ) : (
                <>
                    <Box mt={3}>
                        {pendenciasFiltradas.length === 0 ? (
                            <Typography>Nenhum pagamento pendente encontrado.</Typography>
                        ) : (
                            <>
                                {pendenciasFiltradas.map((p) => (
                                    <Typography key={p.id}>
                                        {`${p.nome_paciente} - ${formatDate(p.data)} ${p.hora} - Pendente: R$ ${(p.valor_pendente ?? 0).toFixed(2)}`}
                                    </Typography>
                                ))}
                                <Typography mt={2} fontWeight="bold">
                                    Total Pendências: R$ {totalFiltrado.toFixed(2)}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={exportToPDF}
                        sx={{ mt: 3 }}
                    >
                        Exportar para PDF
                    </Button>
                </>
            )}
        </Box>
    );
};

export default PagamentosPendentes;
