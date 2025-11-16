import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Alert,
    CircularProgress,
    Button
} from '@mui/material';
import {
    Timeline,
    TrendingUp,
    Assessment,
    Warning,
    Schedule,
    Refresh,
    ArrowBack
} from '@mui/icons-material';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Area,
    AreaChart
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { 
    DemandPrediction, 
    DemandTrends, 
    DemandByDiagnosis, 
    SeasonalAnalysis,
    DemandFilters 
} from '../../types/analytics';

export default function PrevisaoDemanda() {
    const navigate = useNavigate();
    const [demandPrediction, setDemandPrediction] = useState<DemandPrediction | null>(null);
    const [demandTrends, setDemandTrends] = useState<DemandTrends | null>(null);
    const [demandByDiagnosis, setDemandByDiagnosis] = useState<DemandByDiagnosis | null>(null);
    const [seasonalAnalysis, setSeasonalAnalysis] = useState<SeasonalAnalysis | null>(null);
    const [demandLoading, setDemandLoading] = useState(false);
    const [demandFilters, setDemandFilters] = useState<DemandFilters>({
        period: '30d',
        show_confidence_interval: true,
        show_historical: true
    });

    // Cores para gráficos
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    // Funções para buscar dados de demanda
    const fetchDemandData = async () => {
        try {
            setDemandLoading(true);
            
            const periodDays = demandFilters.period === '7d' ? 7 : demandFilters.period === '30d' ? 30 : 90;
            
            // Buscar dados de demanda em paralelo
            const [predictionRes, trendsRes, diagnosisRes, seasonalRes] = await Promise.all([
                api.post('/ml/predict-demand', {
                    start_date: new Date().toISOString().split('T')[0],
                    end_date: new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    diagnostico: demandFilters.diagnostico
                }),
                api.get(`/ml/demand-trends?days=${periodDays}`),
                api.get(`/ml/demand-by-diagnosis?days=${periodDays}`),
                api.get('/ml/seasonal-analysis')
            ]);

            setDemandPrediction(predictionRes.data);
            setDemandTrends(trendsRes.data);
            setDemandByDiagnosis(diagnosisRes.data);
            setSeasonalAnalysis(seasonalRes.data);

        } catch (error) {
            console.error('Erro ao carregar dados de demanda:', error);
        } finally {
            setDemandLoading(false);
        }
    };

    useEffect(() => {
        fetchDemandData();
    }, []);

    useEffect(() => {
        fetchDemandData();
    }, [demandFilters]);

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
                <Timeline style={{ marginRight: 1, fontSize: '2rem', color: '#ff9800' }} />
                <Typography variant="h4">Previsão de Demanda</Typography>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchDemandData}
                    style={{ marginLeft: 'auto' }}
                >
                    Atualizar
                </Button>
            </Box>

            {/* Cards de métricas de demanda */}
            <Grid container spacing={3} marginBottom={4}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Schedule style={{ color: '#1976d2', marginRight: 1 }} />
                                <Box>
                                    <Typography variant="h4" color="primary">
                                        {demandPrediction?.predicted_appointments || 0}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Demanda Prevista ({demandFilters.period})
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
                                        {demandPrediction?.daily_average?.toFixed(1) || '0.0'}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Média Diária
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
                                <Assessment style={{ color: '#ff9800', marginRight: 1 }} />
                                <Box>
                                    <Typography variant="h4" style={{ color: '#ff9800' }}>
                                        {((demandPrediction?.model_confidence ?? 0) * 100).toFixed(0)}%
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Confiança do Modelo
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
                                        {demandPrediction?.holiday_impact || 0}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Impacto Feriados
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {demandLoading ? (
                <Box display="flex" justifyContent="center" marginBottom={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3} marginBottom={4}>
                    {/* Gráfico de Tendências de Demanda */}
                    <Grid item xs={12} lg={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Tendência de Demanda
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={demandPrediction?.forecast_data || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="date" 
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                        />
                                        <YAxis />
                                        <Tooltip 
                                            labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                                            formatter={(value: number, name: string) => [
                                                value,
                                                name === 'predicted' ? 'Previsão' : 
                                                name === 'confidence_upper' ? 'Limite Superior' : 
                                                name === 'confidence_lower' ? 'Limite Inferior' : name
                                            ]}
                                        />
                                        <Legend />
                                        
                                        {demandFilters.show_confidence_interval && (
                                            <>
                                                <Area 
                                                    dataKey="confidence_upper" 
                                                    stroke="none" 
                                                    fill="#e3f2fd" 
                                                    stackId="1"
                                                />
                                                <Area 
                                                    dataKey="confidence_lower" 
                                                    stroke="none" 
                                                    fill="#ffffff" 
                                                    stackId="1"
                                                />
                                            </>
                                        )}
                                        
                                        <Line 
                                            type="monotone" 
                                            dataKey="predicted" 
                                            stroke="#1976d2" 
                                            strokeWidth={2}
                                            dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                                            name="Previsão"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Gráfico de Pizza - Demanda por Diagnóstico */}
                    <Grid item xs={12} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Demanda por Diagnóstico
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={demandByDiagnosis?.pie_data || []}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }) => `${name} (${percentage}%)`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {demandByDiagnosis?.pie_data?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value: number, name: string) => [`${value} agendamentos`, name]}
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Insights de Sazonalidade */}
            {seasonalAnalysis?.success && (
                <Grid container spacing={3} marginBottom={4}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Fatores Sazonais - Semanal
                                </Typography>
                                <Box>
                                    {Object.entries(seasonalAnalysis.seasonal_factors.weekly).map(([day, factor]) => (
                                        <Box key={day} marginBottom={1}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography>{day}</Typography>
                                                <Typography fontWeight="bold">
                                                    {((factor - 1) * 100).toFixed(0)}%
                                                </Typography>
                                            </Box>
                                            <Box 
                                                width="100%" 
                                                height={6} 
                                                bgcolor="#f0f0f0" 
                                                borderRadius={3}
                                                overflow="hidden"
                                            >
                                                <Box
                                                    width={`${Math.min(factor * 50, 100)}%`}
                                                    height="100%"
                                                    bgcolor={factor > 1 ? '#4caf50' : '#ff9800'}
                                                />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Insights Sazonais
                                </Typography>
                                <Box>
                                    {seasonalAnalysis.insights.map((insight, index) => (
                                        <Alert 
                                            key={index} 
                                            severity="info" 
                                            style={{ marginBottom: 8 }}
                                            variant="outlined"
                                        >
                                            {insight}
                                        </Alert>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
