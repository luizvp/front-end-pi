import { ArrowBack } from "@mui/icons-material";
import { Grid, Typography, FormControl, InputLabel, TextField, Select, MenuItem, Button, Box, Paper, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import api from "../../api";
import { SetStateAction, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

interface Paciente {
    id: number
    nome: string
}

interface DiagnosticoPadronizado {
    id: number;
    codigo_cid: string;
    descricao: string;
    categoria?: string;
    subcategoria?: string;
}

interface Prontuario {
    id: number
    id_paciente: number
    diagnostico_cid_id?: number
    historia_clinica: string
    queixa_principal: string
    habitos_vida: any
    hma: any
    hmp: any
    antecedentes_pessoais: any
    antecedentes_familiares: any
    tratamentos_realizados: any
    deambulando: number
    internado: number
    deambulando_apoio: number
    orientado: number
    cadeira_rodas: number
    exames_complementares: any
    usa_medicamentos: any
    realizou_cirurgia: any
    inspecao_palpacao: any
    semiotica: any
    testes_especificos: any
    avaliacao_dor: any
    objetivos_tratamento: any
    recursos_terapeuticos: any
    plano_tratamento: any
    diagnostico_clinico: any
    diagnostico_fisioterapeutico: any
    status_tratamento?: string
    data_alta?: string
    motivo_alta?: string
    data_criacao: string
}

export default function ProntuariosCreate() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [diagnosticos, setDiagnosticos] = useState<DiagnosticoPadronizado[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [selectedDiagnostico, setSelectedDiagnostico] = useState('');
    const [statusTratamento, setStatusTratamento] = useState('ativo');
    const [deambulando, setDeambulando] = useState(false);
    const [internado, setInternado] = useState(false);
    const [deambulandoApoio, setDeambulandoApoio] = useState(false);
    const [orientado, setOrientado] = useState(false);
    const [cadeiraRodas, setCadeiraRodas] = useState(false)
    const { id } = useParams();
    const [prontuarioData, setProntuarioData] = useState<Prontuario | null>(null);

    useEffect(() => {
        fetchPacientes();
        fetchDiagnosticos();
    }, []);

    useEffect(() => {
        if (id) {
            api.get(`prontuarios/${id}`).then(response => {
                setProntuarioData(response.data.prontuario);
                setSelectedPaciente(response.data.prontuario.id_paciente.toString());
                setSelectedDiagnostico(response.data.prontuario.diagnostico_cid_id?.toString() || '');
                setStatusTratamento(response.data.prontuario.status_tratamento || 'ativo');
                setDeambulando(response.data.prontuario.deambulando === 1);
                setInternado(response.data.prontuario.internado === 1);
                setDeambulandoApoio(response.data.prontuario.deambulando_apoio === 1);
                setOrientado(response.data.prontuario.orientado === 1);
                setCadeiraRodas(response.data.prontuario.cadeira_rodas === 1);
            }).catch(error => {
                console.log(error);
            });
        }
    }, [id]);

    const fetchPacientes = async () => {
        try {
            const response = await  api.get('pacientes')
            setPacientes(response.data);
        } catch (error) {
            console.error('Error fetching pacientes:', error);
        }
    };

    const fetchDiagnosticos = async () => {
        try {
            const response = await api.get('diagnosticos');
            setDiagnosticos(response.data);
        } catch (error) {
            console.error('Error fetching diagnosticos:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });
        data['id_paciente'] = selectedPaciente;
        data['diagnostico_cid_id'] = selectedDiagnostico;
        data['status_tratamento'] = statusTratamento;
        data['deambulando'] = deambulando.toString() === 'false' ? '0' : '1' ;
        data['internado'] = internado.toString() === 'false' ? '0' : '1';
        data['deambulando_apoio'] = deambulandoApoio.toString() === 'false' ? '0' : '1';
        data['orientado'] = orientado.toString() === 'false' ? '0' : '1';
        data['cadeira_rodas'] = cadeiraRodas.toString() === 'false' ? '0' : '1';
        
        if(id){ 
            api.put(`prontuarios/${id}`, {FormData:data}).then(response => {
                navigate('/prontuarios');
            }).catch(error => {
                console.log(error);
                setLoading(false);
            });
            return;
        }
        api.post('prontuarios',{FormData:data}).then(response => {
        navigate('/prontuarios');
    }).catch(error => {
        console.log(error);
        setLoading(false);
    });
    };

    const handleSelectChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedPaciente(event.target.value);
    };

    if(id && prontuarioData === null) return (<Box display='flex' justifyContent='center' alignItems='center' height='100vh'><CircularProgress size={100} /></Box>)

    return (
        //create a form using material ui
        <Box margin={5}>
                        <NavLink to='/prontuarios'>
          <Button variant='text' color='info' startIcon={<ArrowBack/>} >
                Voltar
            </Button>
            </NavLink>
            <Typography variant="h4" align="center">Formulário de Cadastro de Prontuário</Typography>
            <Paper elevation={3} sx={{ backgroundColor: '#f5f0f0', '& > *': { padding: 2, marginTop: 2 } }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12}>
                        <FormControl fullWidth>
                                <InputLabel id="idPaciente-label">Paciente</InputLabel>
                                <Select
                                    labelId="idPaciente-label"
                                    id="idPaciente"
                                    value={selectedPaciente}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    {pacientes.map((paciente) => (
                                        <MenuItem key={paciente.id} value={paciente.id}>{paciente.nome}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="historia_clinica" name="historia_clinica" label="História Clínica" multiline rows={2} required defaultValue={prontuarioData?.historia_clinica}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="queixa_principal" name="queixa_principal" label="Queixa Principal" multiline rows={2} required defaultValue={prontuarioData?.queixa_principal}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="habitos_vida" name="habitos_vida" label="Hábitos de Vida" multiline rows={2} defaultValue={prontuarioData?.habitos_vida}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="hma" name="hma" label="HMA" multiline rows={2} defaultValue={prontuarioData?.hma}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="hmp" name="hmp" label="HMP" multiline rows={2} defaultValue={prontuarioData?.hmp}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="antecedentes_pessoais" name="antecedentes_pessoais" label="Antecedentes Pessoais" multiline rows={2} defaultValue={prontuarioData?.antecedentes_pessoais}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="antecedentes_familiares" name="antecedentes_familiares" label="Antecedentes Familiares" multiline rows={2} defaultValue={prontuarioData?.antecedentes_familiares}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="tratamentos_realizados" name="tratamentos_realizados" label="Tratamentos Realizados" multiline rows={2} defaultValue={prontuarioData?.tratamentos_realizados}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Apresentação do Paciente</Typography>
                            <FormControlLabel checked={deambulando} onChange={(e) => setDeambulando((e.target as HTMLInputElement).checked)}
                                control={
                                    <Checkbox id="deambulando" name="deambulando" />
                                }
                                label="Deambulando"
                            />
                            <FormControlLabel checked={internado} onChange={(e) => setInternado((e.target as HTMLInputElement).checked)}
                                control={
                                    <Checkbox id="internado" name="internado" />
                                }
                                label="Internado"
                            />
                            <FormControlLabel checked={deambulandoApoio} onChange={(e) => setDeambulandoApoio((e.target as HTMLInputElement).checked)}
                                control={
                                    <Checkbox id="deambulando_apoio" name="deambulando_apoio" />
                                }
                                label="Deambulando com apoio/auxílio" />
                                <FormControlLabel checked={orientado} onChange={(e) => setOrientado((e.target as HTMLInputElement).checked)}
                                control={
                                    <Checkbox id="orientado" name="orientado" />
                                }
                                label="Orientado" />
                                 <FormControlLabel checked={cadeiraRodas} onChange={(e) => setCadeiraRodas((e.target as HTMLInputElement).checked)}
                                control={
                                    <Checkbox id="cadeira_rodas" name="cadeira_rodas" />
                                }
                                label="Cadeira de rodas" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="exames_complementares" name="exames_complementares" label="Exames Complementares" multiline rows={2} defaultValue={prontuarioData?.exames_complementares}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="usa_medicamentos" name="usa_medicamentos" label="Usa Medicamentos" multiline rows={2} defaultValue={prontuarioData?.usa_medicamentos}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="realizou_cirurgia" name="realizou_cirurgia" label="Realizou Cirurgia" multiline rows={2} defaultValue={prontuarioData?.realizou_cirurgia}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="inspecao_palpacao" name="inspecao_palpacao" label="Inspeção/Palpação" multiline rows={2} defaultValue={prontuarioData?.inspecao_palpacao}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="semiotica" name="semiotica" label="Semiótica" multiline rows={2} defaultValue={prontuarioData?.semiotica}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="testes_especificos" name="testes_especificos" label="Testes Específicos" multiline rows={2} defaultValue={prontuarioData?.testes_especificos}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="avaliacao_dor" name="avaliacao_dor" label="Avaliação da Intensidade da Dor" multiline rows={2} defaultValue={prontuarioData?.avaliacao_dor}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="objetivos_tratamento" name="objetivos_tratamento" label="Objetivos de Tratamento" multiline rows={2} defaultValue={prontuarioData?.objetivos_tratamento}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="recursos_terapeuticos" name="recursos_terapeuticos" label="Recursos Terapêuticos" multiline rows={2} defaultValue={prontuarioData?.recursos_terapeuticos}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField id="plano_tratamento" name="plano_tratamento" label="Plano de Tratamento" multiline rows={2} defaultValue={prontuarioData?.plano_tratamento}/>
                            </FormControl>
                        </Grid>
                        
                        {/* Novos campos para diagnóstico e status */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="diagnostico-label">Diagnóstico CID-10</InputLabel>
                                <Select
                                    labelId="diagnostico-label"
                                    id="diagnostico_cid_id"
                                    value={selectedDiagnostico}
                                    onChange={(e) => setSelectedDiagnostico(e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>Selecione um diagnóstico</em>
                                    </MenuItem>
                                    {diagnosticos.map((diagnostico) => (
                                        <MenuItem key={diagnostico.id} value={diagnostico.id}>
                                            {diagnostico.codigo_cid} - {diagnostico.descricao}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="status-label">Status do Tratamento</InputLabel>
                                <Select
                                    labelId="status-label"
                                    id="status_tratamento"
                                    value={statusTratamento}
                                    onChange={(e) => setStatusTratamento(e.target.value)}
                                >
                                    <MenuItem value="ativo">Ativo</MenuItem>
                                    <MenuItem value="concluido">Concluído</MenuItem>
                                    <MenuItem value="pausado">Pausado</MenuItem>
                                    <MenuItem value="interrompido">Interrompido</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        {statusTratamento === 'concluido' && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="data_alta"
                                            name="data_alta"
                                            label="Data de Alta"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            defaultValue={prontuarioData?.data_alta}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="motivo_alta"
                                            name="motivo_alta"
                                            label="Motivo da Alta"
                                            multiline
                                            rows={2}
                                            defaultValue={prontuarioData?.motivo_alta}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        )}
                        
                        <Grid item xs={12} md={6}>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : id ?  'Editar' : 'Cadastrar'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
