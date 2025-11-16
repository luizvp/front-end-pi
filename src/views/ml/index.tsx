import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Grid,
    Paper,
    useTheme
} from '@mui/material';
import {
    Psychology,
    Timeline,
    ArrowForward,
    BarChart
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function MachineLearning() {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleNavigateToPredicaoFaltas = () => {
        navigate('/ml/predicao-faltas');
    };

    const handleNavigateToPrevisaoDemanda = () => {
        navigate('/ml/previsao-demanda');
    };

    const handleNavigateToAnaliseDados = () => {
        navigate('/ml/analise-dados');
    };

    return (
        <Box margin={5}>
            <Box textAlign="center" marginBottom={6}>
                <Typography 
                    variant="h3" 
                    gutterBottom
                    style={{
                        background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold'
                    }}
                >
                    Análises
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    Escolha o tipo de análise que deseja realizar
                </Typography>
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {/* Card 1: Predição de Faltas */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            height: '400px',
                            position: 'relative',
                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0px)';
                            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                        }}
                        onClick={handleNavigateToPredicaoFaltas}
                    >
                        <CardActionArea style={{ height: '100%', padding: '0' }}>
                            <CardContent 
                                style={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    position: 'relative',
                                    padding: '40px'
                                }}
                            >
                                {/* Efeito de fundo */}
                                <Box
                                    style={{
                                        position: 'absolute',
                                        top: '-50px',
                                        right: '-50px',
                                        width: '200px',
                                        height: '200px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        opacity: 0.7
                                    }}
                                />
                                <Box
                                    style={{
                                        position: 'absolute',
                                        bottom: '-30px',
                                        left: '-30px',
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        opacity: 0.8
                                    }}
                                />

                                {/* Conteúdo principal */}
                                <Box
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        borderRadius: '50%',
                                        padding: '30px',
                                        marginBottom: '30px',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    <Psychology style={{ fontSize: '4rem', color: 'white' }} />
                                </Box>

                                <Typography 
                                    variant="h4" 
                                    style={{ 
                                        color: 'white', 
                                        fontWeight: 'bold', 
                                        marginBottom: '16px',
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    Predição de Faltas
                                </Typography>

                                <Typography 
                                    variant="body1" 
                                    style={{ 
                                        color: 'rgba(255, 255, 255, 0.9)', 
                                        marginBottom: '30px',
                                        lineHeight: 1.6,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Analise probabilidades de falta dos pacientes com inteligência artificial
                                </Typography>

                                <Box
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    <span style={{ marginRight: '8px' }}>Acessar</span>
                                    <ArrowForward style={{ fontSize: '1.2rem' }} />
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Paper>
                </Grid>

                {/* Card 2: Previsão de Demanda */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        style={{
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            height: '400px',
                            position: 'relative',
                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(240, 147, 251, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0px)';
                            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                        }}
                        onClick={handleNavigateToPrevisaoDemanda}
                    >
                        <CardActionArea style={{ height: '100%', padding: '0' }}>
                            <CardContent 
                                style={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    position: 'relative',
                                    padding: '40px'
                                }}
                            >
                                {/* Efeito de fundo */}
                                <Box
                                    style={{
                                        position: 'absolute',
                                        top: '-50px',
                                        right: '-50px',
                                        width: '200px',
                                        height: '200px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        opacity: 0.7
                                    }}
                                />
                                <Box
                                    style={{
                                        position: 'absolute',
                                        bottom: '-30px',
                                        left: '-30px',
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        opacity: 0.8
                                    }}
                                />

                                {/* Conteúdo principal */}
                                <Box
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        borderRadius: '50%',
                                        padding: '30px',
                                        marginBottom: '30px',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    <Timeline style={{ fontSize: '4rem', color: 'white' }} />
                                </Box>

                                <Typography 
                                    variant="h4" 
                                    style={{ 
                                        color: 'white', 
                                        fontWeight: 'bold', 
                                        marginBottom: '16px',
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    Previsão de Demanda
                                </Typography>

                                <Typography 
                                    variant="body1" 
                                    style={{ 
                                        color: 'rgba(255, 255, 255, 0.9)', 
                                        marginBottom: '30px',
                                        lineHeight: 1.6,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Preveja a demanda futura de agendamentos com análise sazonal
                                </Typography>

                                <Box
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    <span style={{ marginRight: '8px' }}>Acessar</span>
                                    <ArrowForward style={{ fontSize: '1.2rem' }} />
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Paper>
                </Grid>

                {/* Card 3: Análise de Dados */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        style={{
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            height: '400px',
                            position: 'relative',
                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 172, 254, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0px)';
                            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                        }}
                        onClick={handleNavigateToAnaliseDados}
                    >
                        <CardActionArea style={{ height: '100%', padding: '0' }}>
                            <CardContent 
                                style={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    position: 'relative',
                                    padding: '40px'
                                }}
                            >
                                {/* Efeito de fundo */}
                                <Box
                                    style={{
                                        position: 'absolute',
                                        top: '-50px',
                                        right: '-50px',
                                        width: '200px',
                                        height: '200px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        opacity: 0.7
                                    }}
                                />
                                <Box
                                    style={{
                                        position: 'absolute',
                                        bottom: '-30px',
                                        left: '-30px',
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        opacity: 0.8
                                    }}
                                />

                                {/* Conteúdo principal */}
                                <Box
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        borderRadius: '50%',
                                        padding: '30px',
                                        marginBottom: '30px',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    <BarChart style={{ fontSize: '4rem', color: 'white' }} />
                                </Box>

                                <Typography 
                                    variant="h4" 
                                    style={{ 
                                        color: 'white', 
                                        fontWeight: 'bold', 
                                        marginBottom: '16px',
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    Análise de Dados
                                </Typography>

                                <Typography 
                                    variant="body1" 
                                    style={{ 
                                        color: 'rgba(255, 255, 255, 0.9)', 
                                        marginBottom: '30px',
                                        lineHeight: 1.6,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Análise empresarial com métricas de desempenho e indicadores
                                </Typography>

                                <Box
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    <span style={{ marginRight: '8px' }}>Acessar</span>
                                    <ArrowForward style={{ fontSize: '1.2rem' }} />
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Paper>
                </Grid>
            </Grid>

        </Box>
    );
}
