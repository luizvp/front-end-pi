import { useState, useEffect, SetStateAction } from "react";
import { Add, Edit, Delete } from "@mui/icons-material";
import { Box, Button, Typography, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import { NavLink } from "react-router-dom";
import api from "../../api";
import { formatDate } from "../../utilities/helperFunctions";

interface Prontuario {
    id: number;
    id_paciente: number;
    diagnostico_cid_id?: number;
    historia_clinica: string;
    queixa_principal: string;
    habitos_vida: string;
    hma: string;
    hmp: string;
    antecedentes_pessoais: string;
    antecedentes_familiares: string;
    tratamentos_realizados: string;
    deambulando: boolean;
    internado: boolean;
    deambulando_apoio: boolean;
    orientado: boolean;
    cadeira_rodas: boolean;
    exames_complementares: string;
    usa_medicamentos: string;
    realizou_cirurgia: string;
    inspecao_palpacao: string;
    semiotica: string;
    testes_especificos: string;
    avaliacao_dor: string;
    objetivos_tratamento: string;
    recursos_terapeuticos: string;
    plano_tratamento: string;
    diagnostico_clinico: string;
    diagnostico_fisioterapeutico: string;
    status_tratamento?: string;
    data_alta?: string;
    motivo_alta?: string;
    nome_paciente: string;
    data_criacao: string;
    quantidade_evolucoes: string;
    diagnostico_padronizado?: {
        codigo_cid: string;
        descricao: string;
    };
}

interface Evolucao {
    id: number;
    descricao_evolucao: string;
    data_atendimento: string;
    id_prontuario: number;
}


export default function Prontuarios() {
    const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Prontuario[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(0);
    const [evolucao, setEvolucao] = useState('')
    const [dataEvolucao, setDataEvolucao] = useState('')
    const [evolucoes, setEvolucoes] = useState<Evolucao[]>([])

    const getProntuarios = () => {
        setLoading(true);
        api.get('prontuarios').then(response => {
            setProntuarios(response.data);
            setSearchResults(response.data);
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    }
    const getEvolucoes = (id:number) => {
        api.get(`evolucao/${id}`).then(response => {
            console.log(response.data)
            setEvolucoes(response.data.evolucao);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        getProntuarios()
    }, []);

    useEffect(() => {
        const results = prontuarios.filter(prontuario =>
            prontuario.nome_paciente.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm, prontuarios]);

    const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(e.target.value);
    };

    const handleOpenModal = (id: number) => {
        getEvolucoes(id)
        setOpenModal(id);
    };

    const handleCloseModal = () => {
        setEvolucoes([])
        setEvolucao('')
        setDataEvolucao('')
        setOpenModal(0);
    };

    const createEvolucao = () => {
        api.post('evolucao', {
            FormData: {
                descricao_evolucao: evolucao, data_atendimento: dataEvolucao, id_prontuario: openModal
            }
        }).then(r => {
            getProntuarios()
            handleCloseModal()
        }).catch(err => {

        })
    }

    return (
        <Box margin={5}>
            <Typography variant="h4" align="center">Prontuarios:</Typography>
            <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <TextField
                    label="Pesquisar"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleChange}
                />
            </Box>
            <NavLink to='/prontuarios/novo'>
                <Button variant='contained' color='info' endIcon={<Add />} >
                    Novo
                </Button>
            </NavLink>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Paciente</TableCell>
                            <TableCell>Criado em</TableCell>
                            <TableCell>Diagnóstico CID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>N° Atendimentos</TableCell>
                            <TableCell>Queixa Principal</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <Box
                                position="fixed"
                                top="50%"
                                left="50%"
                                style={{ transform: 'translate(-50%, -50%)' }}
                                zIndex="modal"
                            >
                                <CircularProgress />
                            </Box>
                        )}
                        {searchResults.map((prontuario) => (
                            <TableRow key={prontuario.id}>
                                <TableCell>{prontuario.nome_paciente}</TableCell>
                                <TableCell>{formatDate(prontuario.data_criacao)}</TableCell>
                                <TableCell>
                                    {prontuario.diagnostico_padronizado?.descricao || 'Não definido'}
                                </TableCell>
                                <TableCell>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        backgroundColor: prontuario.status_tratamento === 'ativo' ? '#e3f2fd' : 
                                                       prontuario.status_tratamento === 'concluido' ? '#e8f5e8' :
                                                       prontuario.status_tratamento === 'pausado' ? '#fff3e0' :
                                                       prontuario.status_tratamento === 'interrompido' ? '#ffebee' : '#f5f5f5',
                                        color: prontuario.status_tratamento === 'ativo' ? '#1976d2' : 
                                               prontuario.status_tratamento === 'concluido' ? '#388e3c' :
                                               prontuario.status_tratamento === 'pausado' ? '#f57c00' :
                                               prontuario.status_tratamento === 'interrompido' ? '#d32f2f' : '#666'
                                    }}>
                                        {prontuario.status_tratamento === 'ativo' ? 'Ativo' :
                                         prontuario.status_tratamento === 'concluido' ? 'Concluído' :
                                         prontuario.status_tratamento === 'pausado' ? 'Pausado' :
                                         prontuario.status_tratamento === 'interrompido' ? 'Interrompido' :
                                         'Ativo'}
                                    </span>
                                </TableCell>
                                <TableCell>{prontuario.quantidade_evolucoes}</TableCell>
                                <TableCell>{prontuario.queixa_principal}</TableCell>
                                <TableCell>
                                    <IconButton color="success" aria-label="excluir" onClick={() => handleOpenModal(prontuario.id)}>
                                        <Add />
                                    </IconButton>
                                    <NavLink to={`/prontuarios/${prontuario.id}/editar`}>
                                        <IconButton color="primary" aria-label="editar">
                                            <Edit />
                                        </IconButton></NavLink>
                                    <IconButton color="error" aria-label="excluir">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openModal === 0 ? false : true} onClose={handleCloseModal} fullWidth>
                <DialogTitle>Adicionar Evolução</DialogTitle>
                <DialogContent>
                    <Typography>Data Evolução:</Typography>
                    <TextField id="data_nascimento" name="data_nascimento" type="date" required value={dataEvolucao}
                        onChange={(e) => setDataEvolucao(e.target.value)} />
                    <Typography>Descrição:</Typography>
                    <TextField
                        label="Evolução"
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        value={evolucao}
                        onChange={(e) => setEvolucao(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancelar</Button>
                    <Button onClick={createEvolucao} color="primary">Adicionar</Button>
                </DialogActions>
                <DialogContent>
                {evolucoes.length > 0 && <>
                        <Typography variant="h6">Evoluções atuais:</Typography>
                        {evolucoes.map((evolucao) => (
                            <Box key={evolucao.id} display="flex" justifyContent="space-between">
                                <Typography>{formatDate(evolucao.data_atendimento)}</Typography>
                                <Typography>{evolucao.descricao_evolucao}</Typography>
                            </Box>
                        ))}
                    </>}</DialogContent>
            </Dialog>
        </Box>
    )
}
