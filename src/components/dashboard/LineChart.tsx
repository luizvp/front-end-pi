import React from 'react';
import {
    ResponsiveContainer,
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';

interface DataPoint {
    date?: string;
    month?: number;
    value: number;
    [key: string]: any;
}

interface LineChartProps {
    data: DataPoint[];
    xKey?: string;
    yKey?: string;
    color?: string;
    loading?: boolean;
    formatX?: (value: any) => string;
    formatY?: (value: any) => string;
}

const LineChart: React.FC<LineChartProps> = ({
    data,
    xKey = 'date',
    yKey = 'value',
    color = '#1976d2',
    loading = false,
    formatX,
    formatY
}) => {
    // Format month numbers to month names
    const formatMonth = (month: number): string => {
        const monthNames = [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ];
        return monthNames[month - 1] || '';
    };

    // Default formatters
    const defaultFormatX = (value: any): string => {
        if (typeof value === 'number') {
            return formatMonth(value);
        }
        
        // If it's a date string, format it as DD/MM
        if (typeof value === 'string' && value.includes('-')) {
            const parts = value.split('-');
            if (parts.length >= 3) {
                return `${parts[2]}/${parts[1]}`;
            }
        }
        
        return String(value);
    };

    const defaultFormatY = (value: any): string => {
        if (typeof value === 'number') {
            return value.toLocaleString('pt-BR');
        }
        return String(value);
    };

    // Use provided formatters or defaults
    const xFormatter = formatX || defaultFormatX;
    const yFormatter = formatY || defaultFormatY;

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
            <RechartsLineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey={xKey} 
                    tickFormatter={xFormatter}
                />
                <YAxis 
                    tickFormatter={yFormatter}
                    domain={[0, (dataMax: number) => Math.max(2000, dataMax * 1.1)]}
                    allowDataOverflow={false}
                />
                <Tooltip 
                    formatter={(value: any) => [yFormatter(value), '']}
                    labelFormatter={(label) => xFormatter(label)}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey={yKey}
                    stroke={color}
                    activeDot={{ r: 8 }}
                    name="Valor"
                />
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};

export default LineChart;
