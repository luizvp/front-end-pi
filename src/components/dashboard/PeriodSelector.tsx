import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';

interface PeriodSelectorProps {
    value: string;
    onChange: (period: string) => void;
    label?: string;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
    value, 
    onChange,
    label = 'Período'
}) => {
    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newPeriod: string | null,
    ) => {
        if (newPeriod !== null) {
            onChange(newPeriod);
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={2}>
            {label && (
                <Typography variant="body2" color="text.secondary">
                    {label}:
                </Typography>
            )}
            <ToggleButtonGroup
                value={value}
                exclusive
                onChange={handleChange}
                aria-label="período de tempo"
                size="small"
            >
                <ToggleButton value="week" aria-label="semana">
                    Semana
                </ToggleButton>
                <ToggleButton value="month" aria-label="mês">
                    Mês
                </ToggleButton>
                <ToggleButton value="year" aria-label="ano">
                    Ano
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default PeriodSelector;
