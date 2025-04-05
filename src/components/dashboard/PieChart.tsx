import React from 'react';
import {
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';

interface DataPoint {
    label: string;
    value: number;
    [key: string]: any;
}

interface PieChartProps {
    data: DataPoint[];
    labelKey?: string;
    valueKey?: string;
    colors?: string[];
    loading?: boolean;
    formatValue?: (value: any) => string;
}

// Default color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const PieChart: React.FC<PieChartProps> = ({
    data,
    labelKey = 'label',
    valueKey = 'value',
    colors = COLORS,
    loading = false,
    formatValue
}) => {
    // Default value formatter
    const defaultFormatValue = (value: any): string => {
        if (typeof value === 'number') {
            return value.toLocaleString('pt-BR');
        }
        return String(value);
    };

    // Use provided formatter or default
    const valueFormatter = formatValue || defaultFormatValue;

    // Format labels for display
    const formatLabel = (label: string): string => {
        // Format payment methods
        if (label === 'dinheiro') return 'Dinheiro';
        if (label === 'cartao_credito') return 'Cartão de Crédito';
        if (label === 'cartao_debito') return 'Cartão de Débito';
        if (label === 'pix') return 'PIX';
        
        // Format payment types
        if (label === 'consulta') return 'Consulta';
        if (label === 'produto') return 'Produto';
        if (label === 'outro') return 'Outro';
        
        // Format appointment status
        if (label === 'Realizado') return 'Realizado';
        if (label === 'Em aberto') return 'Em aberto';
        if (label === 'Cancelado') return 'Cancelado';
        
        return label;
    };

    // Custom tooltip formatter
    const renderTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                >
                    <Typography variant="body2" fontWeight="bold">
                        {formatLabel(data[labelKey])}
                    </Typography>
                    <Typography variant="body2">
                        {valueFormatter(data[valueKey])}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography color="text.secondary">
                    Sem dados disponíveis
                </Typography>
            </Box>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey={valueKey}
                    nameKey={labelKey}
                    label={({ name, percent }) => `${formatLabel(name)} (${(percent * 100).toFixed(0)}%)`}
                >
                    {data.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={colors[index % colors.length]} 
                        />
                    ))}
                </Pie>
                <Tooltip content={renderTooltip} />
                <Legend 
                    formatter={(value) => formatLabel(value)} 
                />
            </RechartsPieChart>
        </ResponsiveContainer>
    );
};

export default PieChart;
