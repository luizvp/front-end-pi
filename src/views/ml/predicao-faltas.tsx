import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Alert,
    CircularProgress,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Psychology,
    Warning,
    CheckCircle,
    Error,
    TrendingUp,
    People,
    Assessment,
    Refresh,
    ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

interface MLPrediction {
    paciente_id: number;
    paciente_nome: string;
    probabilidade_falta: number;
    confianca: number;
    nivel_risco: 'baixo' | 'medio' | 'alto';
    acao_recomendada: string;
    data_previsao: string;
}

interface MLStatistics {
    total_predictions: number;
    risk_distribution: {
        baixo: number;
        medio: number;
        alto: number;
    };
    actions_executed: number;
    execution_rate: number;
}

interface MLDashboard {
    ml_api_status: string;
    statistics: {
        total_previsoes_mes: number;
        alto_risco_count: number;
        agendamentos_amanha: number;
        acoes_pendentes: number;
    };
    high_risk_patients: MLPrediction[];
    tomorrow_predictions: any[];
}

export default function PredicaoFaltas() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState<MLDashboard | null>(null);
    const [statistics, setStatistics] = useState<MLStatistics | null>(null);
    const [highRiskPatients, setHighRiskPatients] = useState<MLPrediction[]>([]);
    const [loading, setLoading] = useState(true);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedPrediction, setSelectedPrediction] = useState<MLPrediction | null>(null);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await api.get('/ml/dashboard');
            setDashboard(response.data);
        } catch (error) {
            console.error('Erro ao carregar dashboard ML:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await api.get('/ml/statistics');
            setStatistics(response.data.statistics);
        } catch (error) {
            console.error('Erro ao carregar estatísticas ML:', error);
        }
    };

    const fetchHighRiskPatients = async () => {
        try {
            const response = await api.get('/ml/high-risk-patients?limite=0.5');
            setHighRiskPatients(response.data.patients || []);
        } catch (error) {
            console.error('Erro ao carregar pacientes de alto risco:', error);
        }
    };

    const refreshAllData = () => {
        fetchDashboard();
        fetchStatistics();
        fetchHighRiskPatients();
    };

    useEffect(() => {
        fetchDashboard();
        fetchStatistics();
        fetchHighRiskPatients();
    }, []);

    const getRiskColor = (nivel: string) => {
        switch (nivel) {
            case 'alto': return '#f44336';
            case 'medio': return '#ff9800';
            case 'baixo': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    const getRiskIcon = (nivel: string) => {
        switch (nivel) {
            case 'alto': return <Error style={{ color: '#f44336' }} />;
            case 'medio': return <Warning style={{ color: '#ff9800' }} />;
            case 'baixo': return <CheckCircle style={{ color: '#4caf50' }} />;
            default: return <CheckCircle style={{ color: '#9e9e9e' }} />;
        }
    };

    const handleShowDetails = (prediction: MLPrediction) => {
        setSelectedPrediction(prediction);
        setDetailsOpen(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        if (isToday) {
            return { text: 'HOJE', color: '#f44336', weight: 'bold' };
        } else if (isTomorrow) {
            return { text: 'AMANHÃ', color: '#ff9800', weight: 'bold' };
        } else {
            return { 
                text: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 
                color: '#666', 
                weight: 'normal' 
            };
        }
    };

    const sortPatientsByDate = (patients: MLPrediction[]) => {
        return [...patients].sort((a, b) => {
            const dateA = new Date(a.data_previsao);
            const dateB = new Date(b.data_previsao);
            
            return dateA.getTime() - dateB.getTime();
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box margin={5}>
            <Box display="flex" alignItems="center" marginBottom={3}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/ml')}
                    style={{ marginRight: 2 }}
                >
                    Voltar
                </Button>
                <Psychology style={{ marginRight: 1, fontSize: '2rem', color: '#1976d2' }} />
                <Typography variant="h4">Predição de Faltas</Typography>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={refreshAllData}
                    style={{ marginLeft: 'auto' }}
                >
                    Atualizar
                </Button>
            </Box>

            {/* Cards de Estatísticas */}
            <Grid container spacing={3} marginBottom={4}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Assessment style={{ color: '#1976d2', marginRight: 1 }} />
                                <Box>
                                    <Typography variant="h4" color="primary">
                                        {dashboard?.statistics.total_previsoes_mes || 0}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Previsões este mês
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Warning style={{ color: '#f44336', marginRight: 1 }} />
                                <Box>
                                    <Typography variant="h4" style={{ color: '#f44336' }}>
                                        {dashboard?.statistics.alto_risco_count || 0}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Alto risco hoje
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <TrendingUp style={{ color: '#4caf50', marginRight: 1 }} />
                                <Box>
                                    <Typography variant="h4" style={{ color: '#4caf50' }}>
                                        {dashboard?.statistics.agendamentos_amanha || 0}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Agendamentos amanhã
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <People style={{ color: '#ff9800', marginRight: 1 }} />
                                <Box>
                                    <Typography variant="h4" style={{ color: '#ff9800' }}>
                                        {dashboard?.statistics.acoes_pendentes || 0}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Ações pendentes
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Distribuição de Risco */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Distribuição por Nível de Risco (30 dias)
                            </Typography>
                            {statistics && (
                                <Box>
                                    <Box marginBottom={2}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography>Baixo Risco</Typography>
                                            <Typography>{statistics.risk_distribution.baixo}</Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={(statistics.risk_distribution.baixo / statistics.total_predictions) * 100} 
                                            style={{ backgroundColor: '#e8f5e8', height: 8, borderRadius: 4 }}
                                            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' } }}
                                        />
                                    </Box>
                                    
                                    <Box marginBottom={2}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography>Risco Médio</Typography>
                                            <Typography>{statistics.risk_distribution.medio}</Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={(statistics.risk_distribution.medio / statistics.total_predictions) * 100} 
                                            style={{ backgroundColor: '#fff3e0', height: 8, borderRadius: 4 }}
                                            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' } }}
                                        />
                                    </Box>
                                    
                                    <Box marginBottom={2}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography>Alto Risco</Typography>
                                            <Typography>{statistics.risk_distribution.alto}</Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={(statistics.risk_distribution.alto / statistics.total_predictions) * 100} 
                                            style={{ backgroundColor: '#ffebee', height: 8, borderRadius: 4 }}
                                            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#f44336' } }}
                                        />
                                    </Box>

                                    <Box marginTop={2} padding={2} bgcolor="#f5f5f5" borderRadius={1}>
                                        <Typography variant="body2">
                                            Taxa de Execução: {statistics.execution_rate}%
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pacientes de Alto Risco */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Pacientes de Alto Risco
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Paciente</TableCell>
                                            <TableCell align="center">Data Agendamento</TableCell>
                                            <TableCell align="center">Probabilidade</TableCell>
                                            <TableCell align="center">Risco</TableCell>
                                            <TableCell align="center">Ação</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortPatientsByDate(highRiskPatients).slice(0, 5).map((prediction, index) => {
                                            const dateInfo = formatDate(prediction.data_previsao);
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{prediction.paciente_nome}</TableCell>
                                                    <TableCell align="center">
                                                        <Typography 
                                                            variant="body2" 
                                                            style={{ 
                                                                fontWeight: dateInfo.weight,
                                                                color: dateInfo.color,
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            {dateInfo.text}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography 
                                                            variant="body2" 
                                                            style={{ fontWeight: 'bold', color: getRiskColor(prediction.nivel_risco) }}
                                                        >
                                                            {(prediction.probabilidade_falta * 100).toFixed(0)}%
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            icon={getRiskIcon(prediction.nivel_risco)}
                                                            label={prediction.nivel_risco.toUpperCase()}
                                                            size="small"
                                                            style={{
                                                                backgroundColor: prediction.nivel_risco === 'alto' ? '#ffebee' : 
                                                                               prediction.nivel_risco === 'medio' ? '#fff3e0' : '#e8f5e8',
                                                                color: getRiskColor(prediction.nivel_risco)
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleShowDetails(prediction)}
                                                        >
                                                            Ver
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Modal de Detalhes */}
            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Detalhes da Predição ML</DialogTitle>
                <DialogContent>
                    {selectedPrediction && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6">
                                    {selectedPrediction.paciente_nome}
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={6}>
                                <Typography><strong>Probabilidade de Falta:</strong></Typography>
                                <Typography variant="h4" style={{ color: getRiskColor(selectedPrediction.nivel_risco) }}>
                                    {(selectedPrediction.probabilidade_falta * 100).toFixed(1)}%
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={6}>
                                <Typography><strong>Confiança do Modelo:</strong></Typography>
                                <Typography variant="h4">
                                    {(selectedPrediction.confianca * 100).toFixed(1)}%
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Typography><strong>Nível de Risco:</strong></Typography>
                                <Chip
                                    icon={getRiskIcon(selectedPrediction.nivel_risco)}
                                    label={selectedPrediction.nivel_risco.toUpperCase()}
                                    style={{
                                        backgroundColor: selectedPrediction.nivel_risco === 'alto' ? '#ffebee' : 
                                                       selectedPrediction.nivel_risco === 'medio' ? '#fff3e0' : '#e8f5e8',
                                        color: getRiskColor(selectedPrediction.nivel_risco),
                                        marginTop: 8
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Typography><strong>Ação Recomendada:</strong></Typography>
                                <Alert severity="info" style={{ marginTop: 8 }}>
                                    {selectedPrediction.acao_recomendada}
                                </Alert>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
