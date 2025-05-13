import React, { useState } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Button, 
    CircularProgress, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    Snackbar,
    Alert
} from '@mui/material';
import api from '../../api';

interface VirtualTerminalProps {
    valor: number;
    onComplete: (result: any) => void;
    onCancel: () => void;
}

const VirtualTerminal: React.FC<VirtualTerminalProps> = ({ valor, onComplete, onCancel }) => {
    const [status, setStatus] = useState<'idle'|'connecting'|'processing'|'completed'|'failed'>('idle');
    const [formaPagamento, setFormaPagamento] = useState('credito');
    const [parcelas, setParcelas] = useState(1);
    const [message, setMessage] = useState('');
    
    const connectTerminal = async () => {
        setStatus('connecting');
        try {
            const response = await api.post('/terminal/connect');
            setStatus('idle');
            setMessage('Terminal conectado com sucesso!');
        } catch (error) {
            setStatus('failed');
            setMessage('Falha ao conectar terminal');
        }
    };
    
    const processPayment = async () => {
        setStatus('processing');
        try {
            const response = await api.post('/terminal/process', {
                valor,
                forma_pagamento: formaPagamento,
                parcelas: formaPagamento === 'credito' ? parcelas : 1
            });
            
            setStatus(response.data.status === 'approved' ? 'completed' : 'failed');
            setMessage(response.data.message);
            onComplete(response.data);
        } catch (error) {
            setStatus('failed');
            setMessage('Erro ao processar pagamento');
        }
    };
    
    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 3, 
                maxWidth: 400, 
                mx: 'auto',
                borderRadius: 2,
                background: 'linear-gradient(145deg, #f0f0f0, #e6e6e6)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }}
        >
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                Terminal de Pagamento Virtual
            </Typography>
            
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                my: 3,
                p: 2,
                bgcolor: '#000',
                color: '#0f0',
                borderRadius: 1,
                fontFamily: 'monospace'
            }}>
                {status === 'connecting' ? (
                    <Typography variant="h5">Conectando...</Typography>
                ) : status === 'processing' ? (
                    <Typography variant="h5">Processando...</Typography>
                ) : (
                    <Typography variant="h4">R$ {valor.toFixed(2)}</Typography>
                )}
            </Box>
            
            {status !== 'processing' && status !== 'connecting' && (
                <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Forma de Pagamento</InputLabel>
                        <Select
                            value={formaPagamento}
                            onChange={(e) => setFormaPagamento(e.target.value as string)}
                            label="Forma de Pagamento"
                        >
                            <MenuItem value="credito">Cartão de Crédito</MenuItem>
                            <MenuItem value="debito">Cartão de Débito</MenuItem>
                            <MenuItem value="pix">PIX</MenuItem>
                        </Select>
                    </FormControl>
                    
                    {formaPagamento === 'credito' && (
                        <FormControl fullWidth>
                            <InputLabel>Parcelas</InputLabel>
                            <Select
                                value={parcelas}
                                onChange={(e) => setParcelas(e.target.value as number)}
                                label="Parcelas"
                            >
                                {[...Array(12)].map((_, i) => (
                                    <MenuItem key={i+1} value={i+1}>{i+1}x</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={onCancel}
                    disabled={status === 'processing' || status === 'connecting'}
                >
                    Cancelar
                </Button>
                
                {status === 'idle' ? (
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={connectTerminal}
                    >
                        Conectar Terminal
                    </Button>
                ) : status === 'connecting' || status === 'processing' ? (
                    <Button 
                        variant="contained" 
                        color="primary" 
                        disabled
                    >
                        <CircularProgress size={24} color="inherit" />
                    </Button>
                ) : status === 'completed' ? (
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={onCancel}
                    >
                        Concluído
                    </Button>
                ) : (
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={processPayment}
                    >
                        Processar Pagamento
                    </Button>
                )}
            </Box>
            
            {status === 'completed' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                    <Typography color="success.main" variant="body1" align="center">
                        Pagamento Aprovado!
                    </Typography>
                </Box>
            )}
            
            {status === 'failed' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
                    <Typography color="error" variant="body1" align="center">
                        Falha no Pagamento
                    </Typography>
                </Box>
            )}
            
            <Snackbar 
                open={!!message} 
                autoHideDuration={3000} 
                onClose={() => setMessage('')}
            >
                <Alert 
                    severity={status === 'completed' ? 'success' : status === 'failed' ? 'error' : 'info'} 
                    onClose={() => setMessage('')}
                >
                    {message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default VirtualTerminal;
