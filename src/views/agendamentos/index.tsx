import { Add, Delete, Edit, AttachMoney } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, CircularProgress } from "@mui/material";
import api from "../../api";
import { SetStateAction, useEffect, useState } from "react";
import { formatDate } from "../../utilities/helperFunctions";

interface Paciente {
    id: number
    nome: string
}

interface Pagamento {
    id?: number;
    agendamento_id: number;
    valor_consulta: number;
    forma_pagamento: string;
    status_pagamento: 'pendente' | 'pago';
    data_pagamento?: string;
    observacao?: string;
}

interface Agendamento {
    id: number;
    data: string;
    hora: string;
    id_paciente: number;
    nome_paciente: string;
    status: string;
    pagamento_id?: number;
    valor_consulta?: number;
    valor_pago?: number;
    forma_pagamento?: string;
    status_pagamento?: 'pendente' | 'pago' | 'cancelado';
    data_pagamento?: string;
    observacao?: string;
}

export default function Agendamentos() {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [loading, setLoading] = useState(false);
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [dataAgendamento, setDataAgendamento] = useState('')
    const [horaAgendamento, setHoraAgendamento] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const getAgendamentos = () => {
        setLoading(true);
        api.get('agendamentos').then(response => {
            setAgendamentos(response.data);
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
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
    const [editingAgendamento, setEditingAgendamento] = useState<Agendamento | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [agendamentoToDelete, setAgendamentoToDelete] = useState<number | null>(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
    const [paymentForm, setPaymentForm] = useState<Pagamento>({
        agendamento_id: 0,
        valor_consulta: 100,
        forma_pagamento: '',
        status_pagamento: 'pendente',
        observacao: ''
    });

    const handlePaymentClick = (agendamento: Agendamento) => {
        setSelectedAgendamento(agendamento);
        if (agendamento.pagamento_id) {
            setPaymentForm({
                id: agendamento.pagamento_id,
                agendamento_id: agendamento.id,
                valor_consulta: agendamento.valor_consulta || 100,
                forma_pagamento: agendamento.forma_pagamento || '',
                status_pagamento: agendamento.status_pagamento === 'pago' ? 'pago' : 'pendente',
                data_pagamento: agendamento.data_pagamento,
                observacao: agendamento.observacao || ''
            });
        } else {
            setPaymentForm({
                agendamento_id: agendamento.id,
                valor_consulta: 100,
                forma_pagamento: '',
                status_pagamento: 'pendente',
                observacao: ''
            });
        }
        setPaymentModalOpen(true);
    };

    const handlePaymentSubmit = async () => {
        if (!selectedAgendamento) return;
        
        try {
            setLoading(true);
            const endpoint = paymentForm.id
                ? `pagamentos/${paymentForm.id}`
                : 'pagamentos';
            
            const method = paymentForm.id ? 'put' : 'post';
            
            // Wrap the payment data in FormData object as expected by the API
            const requestData = {
                FormData: {
                    ...paymentForm,
                    agendamento_id: selectedAgendamento.id // Use agendamento_id instead of consulta_id
                }
            };
            
            await api[method](endpoint, requestData);
            
            getAgendamentos(); // Refresh to get updated payment status
            setPaymentModalOpen(false);
            alert('Pagamento salvo com sucesso!');
        } catch (error) {
            console.error('Payment error:', error);
            alert('Erro ao salvar pagamento');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentFormChange = (field: keyof Pagamento, value: any) => {
        setPaymentForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditClick = (agendamento: Agendamento) => {
        setEditingAgendamento(agendamento);
        setSelectedPaciente(agendamento.id_paciente.toString());
        setDataAgendamento(agendamento.data);
        setHoraAgendamento(agendamento.hora);
        setOpenModal(true);
    };

    const handleDeleteClick = (id: number) => {
        setAgendamentoToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (agendamentoToDelete) {
            setLoading(true);
            api.delete(`agendamentos/${agendamentoToDelete}`)
                .then(() => {
                    getAgendamentos();
                    setDeleteConfirmOpen(false);
                })
                .catch(error => {
                    console.error('Delete error:', error);
                    alert('Falha ao excluir agendamento');
                })
                .finally(() => setLoading(false));
        }
    };

    const saveAgendamento = () => {
        setLoading(true);
        const payload = {
            data: dataAgendamento,
            hora: horaAgendamento,
            id_paciente: selectedPaciente
        };

        const request = editingAgendamento
            ? api.put(`agendamentos/${editingAgendamento.id}`, payload)
            : api.post('agendamentos', payload);

        request.then(() => {
                getAgendamentos();
                handleCloseModal();
                resetForm();
            })
            .catch(error => {
                console.error('Save error:', error);
                alert(`Falha ao ${editingAgendamento ? 'atualizar' : 'criar'} agendamento`);
            })
            .finally(() => setLoading(false));
    };

    const resetForm = () => {
        setEditingAgendamento(null);
        setSelectedPaciente('');
        setDataAgendamento('');
        setHoraAgendamento('');
    };

    const filteredAgendamentos = agendamentos.filter((agendamento) => {
        const matchesSearch = agendamento.nome_paciente.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = filterDate ? agendamento.data === filterDate : true;
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
                            <TableCell>Pagamento</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <Box
                                position="fixed"
                                top="50%"
                                left="50%"
                                style={{ transform: 'translate(-50%, -50%)' }}
                                zIndex="modal"
                            >
                                <CircularProgress />
                            </Box>
                        )}
                        {filteredAgendamentos.map((agendamento) => (
                    <TableRow key={agendamento.id}>
                        <TableCell>{agendamento.nome_paciente}</TableCell>
                        <TableCell>{formatDate(agendamento.data)}</TableCell>
                        <TableCell>{agendamento.hora}</TableCell>
                        <TableCell sx={{color:agendamento.status === 'Realizado' ? 'green' : 'orange' }}> {agendamento.status}</TableCell>
                        <TableCell sx={{
                            color: agendamento.status_pagamento === 'pago' ? 'green' : 'orange'
                        }}>
                            {agendamento.status_pagamento
                                ? agendamento.status_pagamento.charAt(0).toUpperCase() +
                                  agendamento.status_pagamento.slice(1)
                                : 'Não registrado'}
                        </TableCell>
                        <TableCell>
                            <IconButton
                                color={agendamento.status_pagamento === 'pago' ? 'success' : 'warning'}
                                onClick={() => handlePaymentClick(agendamento)}
                                title={agendamento.status_pagamento === 'pago' ? 'Pagamento Registrado' : 'Registrar Pagamento'}
                            >
                                <AttachMoney />
                            </IconButton>
                            <IconButton
                                color="primary"
                                onClick={() => handleEditClick(agendamento)}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(agendamento.id)}
                            >
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
                    <Button onClick={saveAgendamento} color="primary">{editingAgendamento ? 'Salvar' : 'Adicionar'}</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    Tem certeza que deseja excluir este agendamento?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error">Excluir</Button>
                </DialogActions>
            </Dialog>

            {/* Payment Modal */}
            <Dialog open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} fullWidth>
                <DialogTitle>
                    {paymentForm.id ? 'Editar Pagamento' : 'Registrar Pagamento'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Valor da Consulta"
                            type="number"
                            value={paymentForm.valor_consulta}
                            onChange={(e) => handlePaymentFormChange('valor_consulta', parseFloat(e.target.value))}
                            required
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Forma de Pagamento</InputLabel>
                            <Select
                                value={paymentForm.forma_pagamento}
                                onChange={(e) => handlePaymentFormChange('forma_pagamento', e.target.value)}
                                required
                            >
                                <MenuItem value="dinheiro">Dinheiro</MenuItem>
                                <MenuItem value="cartao_credito">Cartão de Crédito</MenuItem>
                                <MenuItem value="cartao_debito">Cartão de Débito</MenuItem>
                                <MenuItem value="pix">PIX</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Status do Pagamento</InputLabel>
                            <Select
                                value={paymentForm.status_pagamento}
                                onChange={(e) => handlePaymentFormChange('status_pagamento', e.target.value)}
                                required
                            >
                                <MenuItem value="pendente">Pendente</MenuItem>
                                <MenuItem value="pago">Pago</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Data do Pagamento"
                            type="date"
                            value={paymentForm.data_pagamento || ''}
                            onChange={(e) => handlePaymentFormChange('data_pagamento', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            label="Observações"
                            multiline
                            rows={4}
                            value={paymentForm.observacao || ''}
                            onChange={(e) => handlePaymentFormChange('observacao', e.target.value)}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPaymentModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handlePaymentSubmit} color="primary">
                        {paymentForm.id ? 'Atualizar' : 'Registrar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}