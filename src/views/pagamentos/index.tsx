import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, TextField, MenuItem, FormControl, InputLabel,
    Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress,
    Select, SelectChangeEvent
} from '@mui/material';
import { Add, Edit, Delete, AttachMoney, CreditCard } from '@mui/icons-material';
import VirtualTerminal from '../../components/terminal/VirtualTerminal';
import api from '../../api';
import { formatDate } from '../../utilities/helperFunctions';

interface Paciente {
    id: number;
    nome: string;
}

interface Pagamento {
    id: number;
    agendamento_id: number | null;
    paciente_id: number;
    nome_paciente: string;
    descricao: string;
    tipo: 'consulta' | 'produto' | 'outro';
    valor_consulta: number;
    forma_pagamento: string | null;
    status_pagamento: 'pendente' | 'pago' | 'cancelado';
    data_pagamento: string | null;
    data_agendamento?: string;
    hora_agendamento?: string;
    observacao: string | null;
    criado_em: string;
}

export default function Pagamentos() {
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editingPagamento, setEditingPagamento] = useState<Pagamento | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoFilter, setTipoFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [terminalOpen, setTerminalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Pagamento | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
        paciente_id: '',
        descricao: '',
        tipo: 'produto',
        valor: 0,
        forma_pagamento: '',
        status_pagamento: 'pendente',
        data_pagamento: '',
        observacao: ''
    });
    
    // Load payments and patients
    useEffect(() => {
        fetchPagamentos();
        fetchPacientes();
    }, []);
    
    const fetchPagamentos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/pagamentos');
            // Ensure numeric values are properly parsed
            const parsedPagamentos = response.data.map((pagamento: any) => ({
                ...pagamento,
                valor_consulta: parseFloat(pagamento.valor_consulta) || 0
            }));
            setPagamentos(parsedPagamentos);
        } catch (error) {
            console.error('Erro ao buscar pagamentos:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchPacientes = async () => {
        try {
            const response = await api.get('/pacientes');
            setPacientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
        }
    };
    
    const handleOpenModal = (pagamento: Pagamento | null = null) => {
        if (pagamento) {
            setEditingPagamento(pagamento);
            setFormData({
                paciente_id: pagamento.paciente_id.toString(),
                descricao: pagamento.descricao,
                tipo: pagamento.tipo,
                valor: pagamento.valor_consulta,
                forma_pagamento: pagamento.forma_pagamento || '',
                status_pagamento: pagamento.status_pagamento,
                data_pagamento: pagamento.data_pagamento || '',
                observacao: pagamento.observacao || ''
            });
        } else {
            setEditingPagamento(null);
            setFormData({
                paciente_id: '',
                descricao: '',
                tipo: 'produto',
                valor: 0,
                forma_pagamento: '',
                status_pagamento: 'pendente',
                data_pagamento: '',
                observacao: ''
            });
        }
        setOpenModal(true);
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (name) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    
    // Separate handler for Select components
    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        if (name) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    
    // Handler for filter selects
    const handleFilterChange = (e: SelectChangeEvent<string>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.target.value);
    };
    
    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (editingPagamento) {
                // Update existing payment
                await api.put(`/pagamentos/${editingPagamento.id}`, {
                    FormData: {
                        paciente_id: parseInt(formData.paciente_id),
                        descricao: formData.descricao,
                        tipo: formData.tipo,
                        valor_consulta: formData.valor,
                        forma_pagamento: formData.forma_pagamento,
                        status_pagamento: formData.status_pagamento,
                        data_pagamento: formData.data_pagamento || null,
                        observacao: formData.observacao
                    }
                });
            } else {
                // Create new independent payment
                await api.post('/pagamentos/independente', {
                    paciente_id: parseInt(formData.paciente_id),
                    descricao: formData.descricao,
                    tipo: formData.tipo,
                    valor: formData.valor,
                    forma_pagamento: formData.forma_pagamento,
                    status_pagamento: formData.status_pagamento,
                    data_pagamento: formData.data_pagamento || null,
                    observacao: formData.observacao
                });
            }
            
            fetchPagamentos();
            handleCloseModal();
        } catch (error) {
            console.error('Erro ao salvar pagamento:', error);
            alert('Erro ao salvar pagamento');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este pagamento?')) {
            setLoading(true);
            try {
                await api.delete(`/pagamentos/${id}`);
                fetchPagamentos();
            } catch (error) {
                console.error('Erro ao excluir pagamento:', error);
                alert('Erro ao excluir pagamento');
            } finally {
                setLoading(false);
            }
        }
    };
    
    // Terminal payment functions
    const handleOpenTerminal = (pagamento: Pagamento) => {
        setSelectedPayment(pagamento);
        setTerminalOpen(true);
    };
    
    const handleTerminalComplete = (result: any) => {
        if (result.status === 'approved' && selectedPayment) {
            // Atualizar o pagamento para status "pago"
            const updatedPayment = {
                ...selectedPayment,
                status_pagamento: 'pago',
                forma_pagamento: result.forma_pagamento,
                data_pagamento: new Date().toISOString().split('T')[0]
            };
            
            // Chamar a API para atualizar o pagamento
            api.put(`/pagamentos/${selectedPayment.id}`, {
                FormData: updatedPayment
            }).then(() => {
                fetchPagamentos();
                setTerminalOpen(false);
                setSelectedPayment(null);
            }).catch(error => {
                console.error('Erro ao atualizar pagamento:', error);
            });
        } else {
            setTerminalOpen(false);
            setSelectedPayment(null);
        }
    };
    
    // Filter payments
    const filteredPagamentos = pagamentos.filter(pagamento => {
        const matchesSearch = pagamento.nome_paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             pagamento.descricao.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipo = tipoFilter ? pagamento.tipo === tipoFilter : true;
        const matchesStatus = statusFilter ? pagamento.status_pagamento === statusFilter : true;
        
        return matchesSearch && matchesTipo && matchesStatus;
    });
    
    // Format payment type for display
    const formatTipo = (tipo: string) => {
        switch (tipo) {
            case 'consulta': return 'Consulta';
            case 'produto': return 'Produto';
            case 'outro': return 'Outro';
            default: return tipo;
        }
    };
    
    // Format payment method for display
    const formatFormaPagamento = (forma: string | null) => {
        if (!forma) return '-';
        
        switch (forma) {
            case 'dinheiro': return 'Dinheiro';
            case 'cartao_credito': return 'Cartão de Crédito';
            case 'cartao_debito': return 'Cartão de Débito';
            case 'pix': return 'PIX';
            default: return forma;
        }
    };
    
    // Format payment status for display
    const formatStatus = (status: string) => {
        switch (status) {
            case 'pendente': return 'Pendente';
            case 'pago': return 'Pago';
            case 'cancelado': return 'Cancelado';
            default: return status;
        }
    };
    
    return (
        <Box margin={5}>
            <Typography variant="h4" align="center">Gerenciamento de Pagamentos</Typography>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" marginY={3}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Add />}
                    onClick={() => handleOpenModal()}
                >
                    Novo Pagamento
                </Button>
                
                <Box display="flex" gap={2}>
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            value={tipoFilter}
                            onChange={(e) => setTipoFilter(e.target.value as string)}
                            label="Tipo"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="consulta">Consulta</MenuItem>
                            <MenuItem value="produto">Produto</MenuItem>
                            <MenuItem value="outro">Outro</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as string)}
                            label="Status"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="pendente">Pendente</MenuItem>
                            <MenuItem value="pago">Pago</MenuItem>
                            <MenuItem value="cancelado">Cancelado</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Paciente</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Forma</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Data Pagamento</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        )}
                        
                        {!loading && filteredPagamentos.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Nenhum pagamento encontrado
                                </TableCell>
                            </TableRow>
                        )}
                        
                        {!loading && filteredPagamentos.map((pagamento) => (
                            <TableRow key={pagamento.id}>
                                <TableCell>{pagamento.nome_paciente}</TableCell>
                                <TableCell>{pagamento.descricao}</TableCell>
                                <TableCell>{formatTipo(pagamento.tipo)}</TableCell>
                                <TableCell>R$ {pagamento.valor_consulta.toFixed(2)}</TableCell>
                                <TableCell>{formatFormaPagamento(pagamento.forma_pagamento)}</TableCell>
                                <TableCell style={{ 
                                    color: pagamento.status_pagamento === 'pago' 
                                        ? 'green' 
                                        : pagamento.status_pagamento === 'pendente' 
                                            ? 'orange' 
                                            : 'red' 
                                }}>
                                    {formatStatus(pagamento.status_pagamento)}
                                </TableCell>
                                <TableCell>
                                    {pagamento.data_pagamento ? formatDate(pagamento.data_pagamento) : '-'}
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        color="primary" 
                                        onClick={() => handleOpenModal(pagamento)}
                                        title="Editar"
                                    >
                                        <Edit />
                                    </IconButton>
                                    
                                    {pagamento.status_pagamento === 'pendente' && (
                                        <IconButton 
                                            color="success" 
                                            onClick={() => handleOpenTerminal(pagamento)}
                                            title="Enviar para Terminal"
                                        >
                                            <CreditCard />
                                        </IconButton>
                                    )}
                                    
                                    {pagamento.agendamento_id === null && (
                                        <IconButton 
                                            color="error" 
                                            onClick={() => handleDelete(pagamento.id)}
                                            title="Excluir"
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* Modal for creating/editing payments */}
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle>
                    {editingPagamento ? 'Editar Pagamento' : 'Novo Pagamento'}
                </DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={2}>
                        <FormControl fullWidth>
                            <InputLabel>Paciente</InputLabel>
                            <Select
                                name="paciente_id"
                                value={formData.paciente_id}
                                onChange={handleSelectChange}
                                label="Paciente"
                                required
                            >
                                {pacientes.map((paciente) => (
                                    <MenuItem key={paciente.id} value={paciente.id}>
                                        {paciente.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <TextField
                            name="descricao"
                            label="Descrição"
                            value={formData.descricao}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleSelectChange}
                                label="Tipo"
                                required
                            >
                                <MenuItem value="produto">Produto</MenuItem>
                                <MenuItem value="outro">Outro</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <TextField
                            name="valor"
                            label="Valor"
                            type="number"
                            value={formData.valor}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            InputProps={{
                                startAdornment: <span>R$</span>,
                            }}
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel>Forma de Pagamento</InputLabel>
                            <Select
                                name="forma_pagamento"
                                value={formData.forma_pagamento}
                                onChange={handleSelectChange}
                                label="Forma de Pagamento"
                            >
                                <MenuItem value="">Selecione</MenuItem>
                                <MenuItem value="dinheiro">Dinheiro</MenuItem>
                                <MenuItem value="cartao_credito">Cartão de Crédito</MenuItem>
                                <MenuItem value="cartao_debito">Cartão de Débito</MenuItem>
                                <MenuItem value="pix">PIX</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status_pagamento"
                                value={formData.status_pagamento}
                                onChange={handleSelectChange}
                                label="Status"
                                required
                            >
                                <MenuItem value="pendente">Pendente</MenuItem>
                                <MenuItem value="pago">Pago</MenuItem>
                                <MenuItem value="cancelado">Cancelado</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <TextField
                            name="data_pagamento"
                            label="Data de Pagamento"
                            type="date"
                            value={formData.data_pagamento}
                            onChange={handleInputChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        
                        <TextField
                            name="observacao"
                            label="Observação"
                            value={formData.observacao}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        {editingPagamento ? 'Atualizar' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Terminal payment modal */}
            <Dialog 
                open={terminalOpen} 
                onClose={() => setTerminalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    {selectedPayment && (
                        <VirtualTerminal 
                            valor={selectedPayment.valor_consulta}
                            onComplete={handleTerminalComplete}
                            onCancel={() => setTerminalOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}
