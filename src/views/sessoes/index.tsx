import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Schedule, CheckCircle, Cancel } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import api from '../../api';
import { formatDate } from '../../utilities/helperFunctions';

interface SessaoFisioterapia {
  id: number;
  agendamento_id?: number;
  paciente_id: number;
  prontuario_id: number;
  tratamento_id?: number;
  data_sessao: string;
  hora_inicio?: string;
  hora_fim?: string;
  duracao_minutos?: number;
  status: 'agendada' | 'realizada' | 'cancelada' | 'faltou';
  tipo_sessao?: string;
  observacoes_sessao?: string;
  evolucao_paciente?: string;
  equipamentos_utilizados?: number[];
  exercicios_realizados?: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  paciente?: {
    id: number;
    nome: string;
  };
  tratamento?: {
    id: number;
    objetivo_tratamento?: string;
  };
}

export default function SessoesFisioterapia() {
  const [sessoes, setSessoes] = useState<SessaoFisioterapia[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSessoes();
  }, []);

  const fetchSessoes = async () => {
    try {
      setLoading(true);
      // Como a API ainda não existe, vamos simular dados
      const sessoesMock: SessaoFisioterapia[] = [
        {
          id: 1,
          paciente_id: 1,
          prontuario_id: 1,
          data_sessao: '2024-10-02',
          hora_inicio: '09:00',
          hora_fim: '10:00',
          duracao_minutos: 60,
          status: 'realizada',
          tipo_sessao: 'tratamento',
          observacoes_sessao: 'Paciente apresentou boa evolução',
          evolucao_paciente: 'Melhora da amplitude de movimento',
          exercicios_realizados: 'Fortalecimento de quadríceps, alongamentos',
          created_at: '2024-10-02T09:00:00.000000Z',
          updated_at: '2024-10-02T10:00:00.000000Z',
          paciente: { id: 1, nome: 'João Silva' },
          tratamento: { id: 1, objetivo_tratamento: 'Reabilitação pós-cirúrgica' }
        },
        {
          id: 2,
          paciente_id: 2,
          prontuario_id: 2,
          data_sessao: '2024-10-03',
          hora_inicio: '10:00',
          status: 'agendada',
          tipo_sessao: 'avaliacao',
          created_at: '2024-10-01T15:30:00.000000Z',
          updated_at: '2024-10-01T15:30:00.000000Z',
          paciente: { id: 2, nome: 'Maria Santos' }
        },
        {
          id: 3,
          paciente_id: 3,
          prontuario_id: 3,
          data_sessao: '2024-10-01',
          hora_inicio: '14:00',
          status: 'faltou',
          tipo_sessao: 'tratamento',
          observacoes_sessao: 'Paciente não compareceu',
          created_at: '2024-10-01T14:00:00.000000Z',
          updated_at: '2024-10-01T14:30:00.000000Z',
          paciente: { id: 3, nome: 'Ana Costa' }
        }
      ];
      
      setSessoes(sessoesMock);
    } catch (error) {
      console.error('Erro ao buscar sessões:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'info';
      case 'realizada': return 'success';
      case 'cancelada': return 'default';
      case 'faltou': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendada': return <Schedule />;
      case 'realizada': return <CheckCircle />;
      case 'cancelada': return <Cancel />;
      case 'faltou': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const sessoesFiltradas = sessoes.filter(sessao => {
    const matchStatus = filtroStatus === 'todas' || sessao.status === filtroStatus;
    const matchSearch = !searchTerm || 
                       sessao.paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       sessao.tipo_sessao?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box margin={3}>
      <Typography variant="h4" gutterBottom>
        🏥 Sessões de Fisioterapia
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Controle completo de sessões individuais com tracking detalhado de cada atendimento.
      </Typography>

      {/* Filtros e controles */}
      <Grid container spacing={2} marginBottom={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Buscar por paciente ou tipo"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Filtrar por status"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="todas">Todas</option>
            <option value="agendada">Agendadas</option>
            <option value="realizada">Realizadas</option>
            <option value="cancelada">Canceladas</option>
            <option value="faltou">Faltas</option>
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            sx={{ height: '56px' }}
          >
            Nova Sessão
          </Button>
        </Grid>
      </Grid>

      {/* Cards de estatísticas rápidas */}
      <Grid container spacing={2} marginBottom={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sessões Hoje
              </Typography>
              <Typography variant="h4">
                {sessoes.filter(s => s.data_sessao === new Date().toISOString().split('T')[0]).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Taxa Comparecimento
              </Typography>
              <Typography variant="h4" color="success.main">
                {Math.round((sessoes.filter(s => s.status === 'realizada').length / sessoes.length) * 100)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Agendadas
              </Typography>
              <Typography variant="h4" color="info.main">
                {sessoes.filter(s => s.status === 'agendada').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Realizadas
              </Typography>
              <Typography variant="h4" color="success.main">
                {sessoes.filter(s => s.status === 'realizada').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de sessões */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Observações</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessoesFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Nenhuma sessão encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sessoesFiltradas.map((sessao) => (
                <TableRow key={sessao.id}>
                  <TableCell>{sessao.paciente?.nome || 'Paciente não identificado'}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {formatDate(sessao.data_sessao)}
                      </Typography>
                      {sessao.hora_inicio && (
                        <Typography variant="caption" color="textSecondary">
                          {sessao.hora_inicio}
                          {sessao.hora_fim && ` - ${sessao.hora_fim}`}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {sessao.tipo_sessao === 'tratamento' ? 'Tratamento' :
                       sessao.tipo_sessao === 'avaliacao' ? 'Avaliação' :
                       sessao.tipo_sessao || 'Não definido'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(sessao.status)}
                      label={sessao.status.charAt(0).toUpperCase() + sessao.status.slice(1)}
                      color={getStatusColor(sessao.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {sessao.duracao_minutos ? `${sessao.duracao_minutos} min` : '-'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {sessao.observacoes_sessao || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Info sobre a nova funcionalidade */}
      <Box marginTop={3}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            🚀 Nova Funcionalidade: Sessões de Fisioterapia
          </Typography>
          <Typography variant="body2">
            Esta interface permite controle detalhado de cada sessão individual, incluindo:
            tracking de presença, duração, exercícios realizados, equipamentos utilizados,
            evolução do paciente e observações específicas de cada atendimento.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
}
