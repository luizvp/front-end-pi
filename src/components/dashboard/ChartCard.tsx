import React, { ReactNode } from 'react';
import { Box, Card, CardContent, Typography, Divider } from '@mui/material';

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    height?: number | string;
    action?: ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
    title, 
    subtitle, 
    children, 
    height = 300,
    action
}) => {
    return (
        <Card 
            sx={{ 
                height: '100%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box>
                        <Typography variant="h6" component="div">
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    {action && (
                        <Box>
                            {action}
                        </Box>
                    )}
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box height={height} display="flex" alignItems="center" justifyContent="center">
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ChartCard;
