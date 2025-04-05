import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Grid, 
    Typography, 
    CircularProgress, 
    Paper,
    Divider,
    Alert
} from '@mui/material';
import {
    AttachMoney,
    Person,
    EventNote,
    TrendingUp,
    Warning,
    CreditCard
} from '@mui/icons-material';
import api from '../../api';

// Import dashboard components
import KpiCard from '../../components/dashboard/KpiCard';
import ChartCard from '../../components/dashboard/ChartCard';
import PeriodSelector from '../../components/dashboard/PeriodSelector';
import LineChart from '../../components/dashboard/LineChart';
import PieChart from '../../components/dashboard/PieChart';

// Define types for API responses
interface KpiData {
    period: {
        start: string;
        end: string;
        previous_start: string;
        previous_end: string;
    };
    financial: {
        current_revenue: number;
        previous_revenue: number;
        revenue_change_percentage: number;
        revenue_by_method: Array<{forma_pagamento: string; total: number}>;
        revenue_by_type: Array<{tipo: string; total: number}>;
        pending_payments: number;
        default_rate: number;
        average_ticket: number;
    };
    patients: {
        total_patients: number;
        new_patients: number;
        previous_new_patients: number;
        patients_change_percentage: number;
    };
    appointments: {
        total_appointments: number;
        completed_appointments: number;
        completion_rate: number;
    };
}

interface TrendData {
    period: {
        start: string;
        end: string;
    };
    metric: string;
    group_by: string;
    data: Array<{date?: string; month?: number; value: number}>;
}

interface DistributionData {
    period: {
        start: string;
        end: string;
    };
    type: string;
    data: Array<{label: string; value: number}>;
}

const Dashboard: React.FC = () => {
    // State for period selection
    const [period, setPeriod] = useState<string>('month');
    
    // State for API data
    const [kpiData, setKpiData] = useState<KpiData | null>(null);
    const [revenueTrend, setRevenueTrend] = useState<TrendData | null>(null);
    const [appointmentsTrend, setAppointmentsTrend] = useState<TrendData | null>(null);
    const [paymentMethodDistribution, setPaymentMethodDistribution] = useState<DistributionData | null>(null);
    const [paymentTypeDistribution, setPaymentTypeDistribution] = useState<DistributionData | null>(null);
    
    // Loading states
    const [loadingKpis, setLoadingKpis] = useState<boolean>(true);
    const [loadingTrends, setLoadingTrends] = useState<boolean>(true);
    const [loadingDistributions, setLoadingDistributions] = useState<boolean>(true);
    
    // Error state
    const [error, setError] = useState<string | null>(null);
    
    // Fetch KPI data
    const fetchKpiData = async () => {
        setLoadingKpis(true);
        setError(null);
        try {
            const response = await api.get(`/dashboard/kpis?period=${period}`);
            setKpiData(response.data);
        } catch (err) {
            console.error('Error fetching KPI data:', err);
            setError('Erro ao carregar os KPIs. Por favor, tente novamente.');
        } finally {
            setLoadingKpis(false);
        }
    };
    
    // Fetch trend data
    const fetchTrendData = async () => {
        setLoadingTrends(true);
        try {
            // Fetch revenue trend
            const revenueResponse = await api.get(`/dashboard/trends?period=${period}&metric=revenue`);
            setRevenueTrend(revenueResponse.data);
            
            // Fetch appointments trend
            const appointmentsResponse = await api.get(`/dashboard/trends?period=${period}&metric=appointments`);
            setAppointmentsTrend(appointmentsResponse.data);
        } catch (err) {
            console.error('Error fetching trend data:', err);
            setError('Erro ao carregar os dados de tendência. Por favor, tente novamente.');
        } finally {
            setLoadingTrends(false);
        }
    };
    
    // Fetch distribution data
    const fetchDistributionData = async () => {
        setLoadingDistributions(true);
        try {
            // Fetch payment method distribution
            const paymentMethodResponse = await api.get('/dashboard/distribution?type=payment_method');
            setPaymentMethodDistribution(paymentMethodResponse.data);
            
            // Fetch payment type distribution
            const paymentTypeResponse = await api.get('/dashboard/distribution?type=payment_type');
            setPaymentTypeDistribution(paymentTypeResponse.data);
        } catch (err) {
            console.error('Error fetching distribution data:', err);
            setError('Erro ao carregar os dados de distribuição. Por favor, tente novamente.');
        } finally {
            setLoadingDistributions(false);
        }
    };
    
    // Fetch all data when period changes
    useEffect(() => {
        fetchKpiData();
        fetchTrendData();
        fetchDistributionData();
    }, [period]);
    
    // Format currency
    const formatCurrency = (value: number): string => {
        return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    
    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Dashboard</Typography>
                <PeriodSelector 
                    value={period} 
                    onChange={setPeriod} 
                />
            </Box>
            
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}
            
            {/* KPI Cards */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard 
                        title="Receita Total" 
                        value={loadingKpis ? '...' : formatCurrency(kpiData?.financial.current_revenue || 0)}
                        icon={<AttachMoney />}
                        trend={kpiData?.financial.revenue_change_percentage}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard 
                        title="Novos Pacientes" 
                        value={loadingKpis ? '...' : kpiData?.patients.new_patients.toString() || '0'}
                        icon={<Person />}
                        trend={kpiData?.patients.patients_change_percentage}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard 
                        title="Consultas Realizadas" 
                        value={loadingKpis ? '...' : kpiData?.appointments.completed_appointments.toString() || '0'}
                        icon={<EventNote />}
                        trend={kpiData?.appointments.completion_rate}
                        trendLabel="Taxa de conclusão"
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard 
                        title="Taxa de Inadimplência" 
                        value={loadingKpis ? '...' : `${kpiData?.financial.default_rate.toFixed(1)}%` || '0%'}
                        icon={<Warning />}
                        color="#d32f2f"
                    />
                </Grid>
            </Grid>
            
            {/* Second row of KPIs */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard 
                        title="Ticket Médio" 
                        value={loadingKpis ? '...' : formatCurrency(kpiData?.financial.average_ticket || 0)}
                        icon={<CreditCard />}
                        color="#7b1fa2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard 
                        title="Pagamentos Pendentes" 
                        value={loadingKpis ? '...' : formatCurrency(kpiData?.financial.pending_payments || 0)}
                        icon={<TrendingUp />}
                        color="#0288d1"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard 
                        title="Total de Pacientes" 
                        value={loadingKpis ? '...' : kpiData?.patients.total_patients.toString() || '0'}
                        icon={<Person />}
                        color="#00796b"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard 
                        title="Total de Consultas" 
                        value={loadingKpis ? '...' : kpiData?.appointments.total_appointments.toString() || '0'}
                        icon={<EventNote />}
                        color="#f57c00"
                    />
                </Grid>
            </Grid>
            
            {/* Charts */}
            <Grid container spacing={3}>
                {/* Revenue Trend Chart */}
                <Grid item xs={12} md={8}>
                    <ChartCard 
                        title="Tendência de Receita" 
                        subtitle={`${kpiData?.period.start} até ${kpiData?.period.end}`}
                        height={300}
                    >
                        <LineChart 
                            data={revenueTrend?.data || []}
                            loading={loadingTrends}
                            formatY={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                            xKey={period === 'year' ? 'month' : 'date'}
                        />
                    </ChartCard>
                </Grid>
                
                {/* Payment Method Distribution */}
                <Grid item xs={12} md={4}>
                    <ChartCard 
                        title="Formas de Pagamento" 
                        height={300}
                    >
                        <PieChart 
                            data={paymentMethodDistribution?.data || []}
                            loading={loadingDistributions}
                            formatValue={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                        />
                    </ChartCard>
                </Grid>
                
                {/* Appointments Trend Chart */}
                <Grid item xs={12} md={8}>
                    <ChartCard 
                        title="Tendência de Consultas" 
                        subtitle={`${kpiData?.period.start} até ${kpiData?.period.end}`}
                        height={300}
                    >
                        <LineChart 
                            data={appointmentsTrend?.data || []}
                            loading={loadingTrends}
                            color="#ed6c02"
                            xKey={period === 'year' ? 'month' : 'date'}
                        />
                    </ChartCard>
                </Grid>
                
                {/* Payment Type Distribution */}
                <Grid item xs={12} md={4}>
                    <ChartCard 
                        title="Tipos de Pagamento" 
                        height={300}
                    >
                        <PieChart 
                            data={paymentTypeDistribution?.data || []}
                            loading={loadingDistributions}
                            formatValue={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                            colors={['#ed6c02', '#2e7d32', '#0288d1']}
                        />
                    </ChartCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
