import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, Button, CircularProgress, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../../api';

interface FormaPagamentoTotal {
    forma_pagamento: string;
    total_pago: number;
}

const RelatorioFinanceiro = () => {
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [totais, setTotais] = useState<FormaPagamentoTotal[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchRelatorio = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (inicio) params.append('inicio', inicio);
            if (fim) params.append('fim', fim);
    
            const response = await api.get(`/relatorios/pagamentos?${params.toString()}`);
    
            const parsed = (response.data.totais || []).map((t: any) => ({
                forma_pagamento: t.forma_pagamento,
                total_pago: parseFloat(t.total_pago) || 0
            }));
    
            setTotais(parsed);
            setInicio(response.data.inicio);
            setFim(response.data.fim);
        } catch (error) {
            console.error('Erro ao buscar relatório:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text(`Relatório Financeiro (${inicio} a ${fim})`, 10, 10);
        autoTable(doc, {
            startY: 20,
            head: [['Forma de Pagamento', 'Valor Total']],
            body: totais.map(t => [
                formatForma(t.forma_pagamento),
                `R$ ${t.total_pago.toFixed(2)}`
            ])
        });
        doc.save('relatorio_financeiro.pdf');
    };

    const formatForma = (forma: string) => {
        switch (forma) {
            case 'dinheiro': return 'Dinheiro';
            case 'pix': return 'PIX';
            case 'cartao_credito': return 'Cartão de Crédito';
            case 'cartao_debito': return 'Cartão de Débito';
            default: return forma;
        }
    };

    useEffect(() => {
        fetchRelatorio();
    }, []);

    return (
        <Box p={3}>
            <Typography variant="h4">Relatório Financeiro</Typography>

            <Box display="flex" gap={2} mt={2} flexWrap="wrap">
                <TextField
                    label="Data Início"
                    type="date"
                    value={inicio}
                    onChange={(e) => setInicio(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Data Fim"
                    type="date"
                    value={fim}
                    onChange={(e) => setFim(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" onClick={fetchRelatorio}>Buscar</Button>
            </Box>

            {loading ? (
                <CircularProgress sx={{ mt: 3 }} />
            ) : (
                <>
                    <Table sx={{ mt: 3 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Forma de Pagamento</TableCell>
                                <TableCell>Valor Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {totais.map((t, i) => (
                                <TableRow key={i}>
                                    <TableCell>{formatForma(t.forma_pagamento)}</TableCell>
                                    <TableCell>R$ {t.total_pago.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button variant="contained" color="secondary" onClick={exportToPDF} sx={{ mt: 2 }}>
                        Exportar para PDF
                    </Button>
                </>
            )}
        </Box>
    );
};

export default RelatorioFinanceiro;
