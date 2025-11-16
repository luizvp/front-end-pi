// Types para as novas funcionalidades de Analytics

export interface Tratamento {
  id: number;
  paciente_id: number;
  prontuario_id: number;
  data_inicio: string;
  data_fim_prevista?: string;
  data_alta_real?: string;
  status: 'ativo' | 'concluido' | 'interrompido' | 'pausado';
  motivo_alta?: string;
  total_sessoes_previstas?: number;
  total_sessoes_realizadas: number;
  objetivo_tratamento?: string;
  observacoes_finais?: string;
  created_at: string;
  updated_at: string;
}

export interface SessaoFisioterapia {
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
}

export interface DiagnosticoPadronizado {
  id: number;
  codigo_cid: string;
  descricao: string;
  categoria?: string;
  subcategoria?: string;
  created_at: string;
  updated_at: string;
}

export interface Equipamento {
  id: number;
  nome: string;
  tipo: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  status: 'ativo' | 'manutencao' | 'inativo';
  localizacao?: string;
  tempo_uso_total: number;
  ultima_manutencao?: string;
  proxima_manutencao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface DadoIot {
  id: number;
  paciente_id?: number;
  sessao_id?: number;
  equipamento_id?: number;
  tipo_sensor: string;
  timestamp: string;
  valor: number;
  unidade_medida?: string;
  contexto?: string;
  observacoes?: string;
  created_at: string;
}

export interface PrevisaoMl {
  id: number;
  paciente_id: number;
  tipo_previsao: 'probabilidade_falta' | 'demanda_periodo' | 'sucesso_tratamento';
  valor_previsao: number;
  confianca?: number;
  data_previsao: string;
  data_calculo: string;
  modelo_utilizado?: string;
  parametros_entrada?: any;
  acao_recomendada?: string;
  executada: boolean;
}

// Analytics Dashboard Types
export interface DashboardMetricas {
  pacientes_ativos: number;
  tratamentos_ativo: number;
  sessoes_mes: number;
  receita_mes: number;
  taxa_comparecimento: number;
  previsoes_alto_risco: number;
}

export interface GraficoDados {
  data: string;
  total: number;
}

export interface DistribuicaoData {
  categoria: string;
  total: number;
}

export interface DashboardGraficos {
  sessoes_por_dia: GraficoDados[];
  distribuicao_diagnosticos: DistribuicaoData[];
  evolucao_receita: { mes: string; receita: number }[];
  status_tratamentos: { status: string; total: number }[];
}

export interface DashboardResponse {
  success: boolean;
  data: {
    metricas: DashboardMetricas;
    graficos: DashboardGraficos;
  };
}

export interface AlertaEquipamento {
  manutencao_vencida: number;
  equipamentos_inativos: number;
}

export interface PrevisaoResponse {
  pacientes_risco_falta: PrevisaoMl[];
  previsoes_demanda: PrevisaoMl[];
  resumo_previsoes: any[];
  alertas_equipamentos: AlertaEquipamento;
}

export interface IoTResponse {
  leituras_hoje: number;
  sensores_ativos: number;
  alertas_criticos: any[];
  tendencias: any;
}

export interface KpisResponse {
  pacientes_total: number;
  tratamentos_ativos: number;
  sessoes_hoje: number;
  receita_mes: number;
}

export interface RealtimeResponse {
  timestamp: string;
  sessoes_ativas: number;
  pacientes_atendidos_hoje: number;
  ultima_atualizacao: string;
}

// Base Paciente interface 
export interface Paciente {
  id: number;
  nome: string;
  data_nascimento: string;
  telefone: string;
  sexo: string;
  cidade: string;
  bairro: string;
  profissao: string;
  endereco_residencial: string;
  endereco_comercial?: string;
  naturalidade: string;
  estado_civil: string;
  cpf: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Extended Paciente interface
export interface PacienteExtendido extends Paciente {
  tratamentos?: Tratamento[];
  sessoes_fisioterapia?: SessaoFisioterapia[];
  previsoes_ml?: PrevisaoMl[];
}

// Analytics API Service Types
export interface AnalyticsService {
  getDashboard(): Promise<DashboardResponse>;
  getTratamentos(): Promise<any>;
  getPrevisoes(): Promise<PrevisaoResponse>;
  getIoT(): Promise<IoTResponse>;
  getKpis(): Promise<KpisResponse>;
  getRealtime(): Promise<RealtimeResponse>;
}

// ===== INTERFACES DE PREVISÃO DE DEMANDA =====

export interface DemandPrediction {
  success: boolean;
  period: string;
  predicted_appointments: number;
  daily_average: number;
  confidence_interval: [number, number];
  seasonal_factors: {
    peak_day?: string;
    lowest_day?: string;
    weekend_factor: number;
    holiday_factor: number;
  };
  holiday_impact: number;
  diagnostico_breakdown: Record<string, number>;
  forecast_data: Array<{
    date: string;
    predicted: number;
    confidence_lower: number;
    confidence_upper: number;
  }>;
  model_confidence: number;
  timestamp: string;
  source?: string;
}

export interface DemandTrends {
  success: boolean;
  historical_data: Array<{
    date: string;
    appointments: number;
  }>;
  period_days: number;
  average_daily: number;
  trend_direction: string;
  seasonality_detected: boolean;
  source?: string;
}

export interface DemandByDiagnosis {
  success: boolean;
  period_days: number;
  total_appointments: number;
  breakdown: Record<string, number>;
  pie_data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  timestamp: string;
  source?: string;
}

export interface SeasonalAnalysis {
  success: boolean;
  seasonal_factors: {
    monthly: Record<string, number>;
    weekly: Record<string, number>;
    special_factors?: Record<string, number>;
  };
  insights: string[];
  timestamp: string;
  source?: string;
}

export interface DemandDashboard {
  success: boolean;
  period_days: number;
  demand_prediction: DemandPrediction;
  demand_trends: DemandTrends;
  demand_by_diagnosis: DemandByDiagnosis;
  seasonal_analysis: SeasonalAnalysis;
  timestamp: string;
}

// Interfaces para componentes do dashboard de demanda
export interface DemandMetrics {
  predicted_appointments: number;
  growth_percentage: number;
  model_accuracy: number;
  alerts_count: number;
}

export interface ForecastDataPoint {
  date: string;
  predicted: number;
  confidence_lower: number;
  confidence_upper: number;
  appointments?: number; // histórico real
}

// Interface para controles de filtro
export interface DemandFilters {
  period: '7d' | '30d' | '90d';
  diagnostico?: string;
  show_confidence_interval: boolean;
  show_historical: boolean;
}
