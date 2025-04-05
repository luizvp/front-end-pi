import React, { ReactNode } from 'react';
import { Box, Card, CardContent, Typography, Tooltip } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface KpiCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: number;
    trendLabel?: string;
    color?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
    title, 
    value, 
    icon, 
    trend, 
    trendLabel,
    color = '#1976d2' 
}) => {
    const isTrendPositive = trend && trend > 0;
    const isTrendNegative = trend && trend < 0;
    
    // Determine if positive trend is good (default) or bad
    const isPositiveTrendGood = title.toLowerCase().includes('receita') || 
                               title.toLowerCase().includes('pacientes') ||
                               title.toLowerCase().includes('consultas');
    
    // For metrics like "Taxa de Inadimplência", a negative trend is good
    const trendColor = isTrendPositive 
        ? (isPositiveTrendGood ? 'green' : 'red')
        : (isPositiveTrendGood ? 'red' : 'green');
    
    return (
        <Card 
            sx={{ 
                height: '100%',
                borderTop: `4px solid ${color}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {title}
                    </Typography>
                    {icon && (
                        <Box sx={{ color }}>
                            {icon}
                        </Box>
                    )}
                </Box>
                
                <Typography variant="h4" component="div" fontWeight="bold">
                    {value}
                </Typography>
                
                {trend !== undefined && (
                    <Box display="flex" alignItems="center" mt={1}>
                        {isTrendPositive && <ArrowUpward fontSize="small" sx={{ color: trendColor }} />}
                        {isTrendNegative && <ArrowDownward fontSize="small" sx={{ color: trendColor }} />}
                        
                        <Tooltip title={trendLabel || `Comparado com o período anterior`}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: trendColor,
                                    ml: 0.5
                                }}
                            >
                                {Math.abs(trend).toFixed(1)}%
                            </Typography>
                        </Tooltip>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default KpiCard;
