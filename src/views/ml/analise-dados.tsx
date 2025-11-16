import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    IconButton
} from '@mui/material';
import {
    ArrowBack,
    TrendingUp,
    AccessTime,
    AttachMoney,
    People
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function AnaliseDados() {
    const navigate = useNavigate();

    // Dados placeholder para métricas principais
    const metricas = {
        tempoMedioAlta: 45, // dias
        receitaPorPaciente: 1250.00,
        ticketMedio: 85.00,
        totalPacientes: 342
    };

    // Dados placeholder para duração média por diagnóstico
    const duracaoPorDiagnostico = [
        { diagnostico: 'M79.3 - Fibromialgia', dias: 60, pacientes: 85, cor: '#8884d8' },
        { diagnostico: 'M25.5 - Artrose', dias: 90, pacientes: 72, cor: '#82ca9d' },
        { diagnostico: 'S72.0 - Fraturas', dias: 120, pacientes: 45, cor: '#ffc658' },
        { diagnostico: 'M54.5 - Dor lombar', dias: 35, pacientes: 98, cor: '#ff7300' },
        { diagnostico: 'M17.9 - Gonartrose', dias: 75, pacientes: 42, cor: '#00ff88' }
    ];

    // Dados placeholder para evolução temporal da receita
    const evolucaoReceita = [
        { mes: 'Jan', receita: 45000, consultas: 520 },
        { mes: 'Fev', receita: 52000, consultas: 580 },
        { mes: 'Mar', receita: 48000, consultas: 560 },
        { mes: 'Abr', receita: 58000, consultas: 650 },
        { mes: 'Mai', receita: 62000, consultas: 690 },
        { mes: 'Jun', receita: 55000, consultas: 620 }
    ];

    // Dados placeholder para distribuição de receita por diagnóstico
    const receitaPorDiagnostico = [
        { name: 'M79.3', value: 28, color: '#0088FE' },
        { name: 'M25.5', value: 22, color: '#00C49F' },
        { name: 'S72.0', value: 18, color: '#FFBB28' },
        { name: 'M54.5', value: 20, color: '#FF8042' },
        { name: 'M17.9', value: 12, color: '#8884d8' }
    ];

    // Dados placeholder para tabela de performance
    const performanceData = [
        { 
            diagnostico: 'M79.3 - Fibromialgia', 
            pacientes: 85, 
            duracaoMedia: 60, 
            receitaTotal: 'R$ 106.250', 
            ticketMedio: 'R$ 1.250', 
            satisfacao: '4.2/5' 
        },
        { 
            diagnostico: 'M25.5 - Artrose', 
            pacientes: 72, 
            duracaoMedia: 90, 
            receitaTotal: 'R$ 90.000', 
            ticketMedio: 'R$ 1.250', 
            satisfacao: '4.5/5' 
        },
        { 
            diagnostico: 'S72.0 - Fraturas', 
            pacientes: 45, 
            duracaoMedia: 120, 
            receitaTotal: 'R$ 78.750', 
            ticketMedio: 'R$ 1.750', 
            satisfacao: '4.7/5' 
        },
        { 
            diagnostico: 'M54.5 - Dor lombar', 
            pacientes: 98, 
            duracaoMedia: 35, 
            receitaTotal: 'R$ 83.300', 
            ticketMedio: 'R$ 850', 
            satisfacao: '4.0/5' 
        },
        { 
            diagnostico: 'M17.9 - Gonartrose', 
            pacientes: 42, 
            duracaoMedia: 75, 
            receitaTotal: 'R$ 52.500', 
            ticketMedio: 'R$ 1.250', 
            satisfacao: '4.3/5' 
        }
    ];

    const handleVoltarClick = () => {
        navigate('/ml');
    };

    return (
        <Box margin={3}>
            {/* Header */}
            <Box display="flex" alignItems="center" marginBottom={4}>
                <IconButton onClick={handleVoltarClick} sx={{ marginRight: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography 
                    variant="h4" 
                    style={{ 
                        background: 'linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold'
                    }}
                >
                    📊 Análise de Dados
                </Typography>
                <Box flexGrow={1} />
                <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<TrendingUp />}
                >
                    ATUALIZAR
                </Button>
            </Box>

            {/* Cards de Métricas Principais */}
            <Grid container spacing={3} marginBottom={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <AccessTime color="primary" sx={{ fontSize: 40, marginRight: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Tempo Médio até Alta
                                    </Typography>
                                    <Typography variant="h4" component="div" color="primary">
                                        {metricas.tempoMedioAlta}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        dias
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <AttachMoney color="success" sx={{ fontSize: 40, marginRight: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Receita por Paciente
                                    </Typography>
                                    <Typography variant="h4" component="div" color="success.main">
                                        R$ {metricas.receitaPorPaciente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        média
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <TrendingUp color="warning" sx={{ fontSize: 40, marginRight: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Ticket Médio
                                    </Typography>
                                    <Typography variant="h4" component="div" color="warning.main">
                                        R$ {metricas.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        por consulta
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <People color="info" sx={{ fontSize: 40, marginRight: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total de Pacientes
                                    </Typography>
                                    <Typography variant="h4" component="div" color="info.main">
                                        {metricas.totalPacientes}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        ativos
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} marginBottom={4}>
                {/* Gráfico de Duração por Diagnóstico */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ padding: 3 }}>
                        <Typography variant="h6" gutterBottom color="textPrimary">
                            Duração Média de Tratamento por Diagnóstico
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={duracaoPorDiagnostico}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="diagnostico" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={100}
                                    fontSize={12}
                                />
                                <YAxis label={{ value: 'Dias', angle: -90, position: 'insideLeft' }} />
                                <Tooltip 
                                    formatter={(value, name) => [`${value} dias`, 'Duração Média']}
                                    labelFormatter={(label) => `Diagnóstico: ${label}`}
                                />
                                <Bar 
                                    dataKey="dias" 
                                    fill="#8884d8" 
                                    name="Duração (dias)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Gráfico de Pizza - Distribuição de Receita */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ padding: 3 }}>
                        <Typography variant="h6" gutterBottom color="textPrimary">
                            Distribuição de Receita por Diagnóstico
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={receitaPorDiagnostico}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {receitaPorDiagnostico.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Gráfico de Evolução Temporal */}
            <Grid container spacing={3} marginBottom={4}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 3 }}>
                        <Typography variant="h6" gutterBottom color="textPrimary">
                            Evolução Mensal da Receita e Consultas
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={evolucaoReceita}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis yAxisId="left" label={{ value: 'Receita (R$)', angle: -90, position: 'insideLeft' }} />
                                <YAxis yAxisId="right" orientation="right" label={{ value: 'Consultas', angle: 90, position: 'insideRight' }} />
                                <Tooltip 
                                    formatter={(value, name) => {
                                        if (name === 'receita') return [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita'];
                                        return [value, 'Consultas'];
                                    }}
                                />
                                <Line yAxisId="left" type="monotone" dataKey="receita" stroke="#8884d8" strokeWidth={3} name="receita" />
                                <Line yAxisId="right" type="monotone" dataKey="consultas" stroke="#82ca9d" strokeWidth={3} name="consultas" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabela de Performance Detalhada */}
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h6" gutterBottom color="textPrimary">
                    Performance Detalhada por Diagnóstico
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Diagnóstico</strong></TableCell>
                            <TableCell align="center"><strong>Pacientes</strong></TableCell>
                            <TableCell align="center"><strong>Duração Média (dias)</strong></TableCell>
                            <TableCell align="center"><strong>Receita Total</strong></TableCell>
                            <TableCell align="center"><strong>Ticket Médio</strong></TableCell>
                            <TableCell align="center"><strong>Satisfação</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {performanceData.map((row, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{row.diagnostico}</TableCell>
                                <TableCell align="center">{row.pacientes}</TableCell>
                                <TableCell align="center">{row.duracaoMedia}</TableCell>
                                <TableCell align="center" style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                    {row.receitaTotal}
                                </TableCell>
                                <TableCell align="center" style={{ color: '#ed6c02', fontWeight: 'bold' }}>
                                    {row.ticketMedio}
                                </TableCell>
                                <TableCell align="center" style={{ color: '#1976d2', fontWeight: 'bold' }}>
                                    {row.satisfacao}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
