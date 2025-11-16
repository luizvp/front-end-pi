import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  People,
  EventNote,
  AttachMoney,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import api from '../../api';
import type { DashboardResponse, KpisResponse } from '../../types/analytics';

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  suffix?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color, suffix = '' }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}{suffix}
          </Typography>
        </Box>
        <Box color={`${color}.main`}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [kpis, setKpis] = useState<KpisResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [dashboardResponse, kpisResponse] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/metricas/kpis')
        ]);

        setDashboardData(dashboardResponse.data);
        setKpis(kpisResponse.data);
        setError(null);
      } catch (err: any) {
        setError('Erro ao carregar dados de analytics');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box margin={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box margin={3}>
      <Typography variant="h4" gutterBottom>
        📊 Analytics Dashboard
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Visão geral das métricas da clínica com dados em tempo real e análises avançadas.
      </Typography>

      {/* KPIs Cards */}
      <Grid container spacing={3} marginBottom={4}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Pacientes Ativos"
            value={dashboardData?.data.metricas.pacientes_ativos || kpis?.pacientes_total || 0}
            icon={<People fontSize="large" />}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Tratamentos Ativos"
            value={dashboardData?.data.metricas.tratamentos_ativo || kpis?.tratamentos_ativos || 0}
            icon={<TrendingUp fontSize="large" />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Sessões Este Mês"
            value={dashboardData?.data.metricas.sessoes_mes || kpis?.sessoes_hoje || 0}
            icon={<EventNote fontSize="large" />}
            color="warning"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Receita Mensal"
            value={`R$ ${(dashboardData?.data.metricas.receita_mes || kpis?.receita_mes || 0).toLocaleString()}`}
            icon={<AttachMoney fontSize="large" />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Status Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Taxa de Comparecimento
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h4" color="success.main">
                  {dashboardData?.data.metricas.taxa_comparecimento.toFixed(1) || '0.0'}%
                </Typography>
                <Chip 
                  icon={<CheckCircle />} 
                  label="Últimos 30 dias" 
                  color="success" 
                  variant="outlined" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alertas ML
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h4" color="warning.main">
                  {dashboardData?.data.metricas.previsoes_alto_risco || 0}
                </Typography>
                <Chip 
                  icon={<Warning />} 
                  label="Pacientes em Risco" 
                  color="warning" 
                  variant="outlined" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Info sobre novas funcionalidades */}
      <Box marginTop={4}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            🚀 Novas Funcionalidades Implementadas
          </Typography>
          <Typography variant="body2" paragraph>
            ✅ <strong>Banco de Dados Expandido:</strong> 6 novas tabelas para analytics avançadas
          </Typography>
          <Typography variant="body2" paragraph>
            ✅ <strong>Models Eloquent:</strong> 10+ models com relacionamentos e métodos de análise
          </Typography>
          <Typography variant="body2" paragraph>
            ✅ <strong>Analytics Controller:</strong> APIs para dashboard, previsões ML e dados IoT
          </Typography>
          <Typography variant="body2" paragraph>
            ✅ <strong>TypeScript:</strong> Interfaces completas para todas as funcionalidades
          </Typography>
          <Typography variant="body2">
            📊 <strong>Endpoints disponíveis:</strong> /api/analytics/dashboard, /api/analytics/previsoes, /api/analytics/iot
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
}
