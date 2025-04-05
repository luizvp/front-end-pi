import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Agendamentos from "./agendamentos";
import Paciente from "./pacientes";
import Prontuarios from "./prontuarios";
import PagamentosPendentes from "./pagamentosPendentes";
import RelatorioFinanceiro from "./relatorioFinanceiro";

export default function RelatoriosModal() {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const handleOpenModal = (relatorio: string) => {
    setOpenModal(relatorio);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <Box>
      <Typography variant="h4" align="center">
        Relatórios
      </Typography>
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button
          variant="contained"
          onClick={() => handleOpenModal("agendamentos")}
        >
          Relatório de Agendamentos
        </Button>
        {/* Adicione botões para outros relatórios conforme necessário */}
      </Box>
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button
          variant="contained"
          onClick={() => handleOpenModal("pacientes")}
        >
          Relatório de Pacientes
        </Button>
        {/* Adicione botões para outros relatórios conforme necessário */}
      </Box>
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button
          variant="contained"
          onClick={() => handleOpenModal("prontuarios")}
        >
          Relatório de Prontuarios
        </Button>
        {/* Adicione botões para outros relatórios conforme necessário */}
      </Box>
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button
          variant="contained"
          onClick={() => handleOpenModal("pendencias")}
        >
          Relatório de Pagamentos Pendentes
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button
          variant="contained"
          onClick={() => handleOpenModal("financeiro")}
        >
          Relatório Financeiro
        </Button>
      </Box>
      {/* Modal para Relatório de Agendamentos */}
      <Dialog
        open={openModal === "agendamentos"}
        onClose={handleCloseModal}
        fullWidth
      >
        <DialogTitle>Relatório de Agendamentos</DialogTitle>
        <DialogContent>
          <Agendamentos />{" "}
          {/* Renderiza o componente de agendamentos no modal */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openModal === "pendencias"}
        onClose={handleCloseModal}
        fullWidth
      >
        <DialogTitle>Relatório de Pagamentos Pendentes</DialogTitle>
        <DialogContent>
          <PagamentosPendentes />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openModal === "pacientes"}
        onClose={handleCloseModal}
        fullWidth
      >
        <DialogTitle>Relatório de pacientes</DialogTitle>
        <DialogContent>
          <Paciente /> {/* Renderiza o componente de agendamentos no modal */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openModal === "prontuarios"}
        onClose={handleCloseModal}
        fullWidth
      >
        <DialogTitle>Relatório de prontuarios</DialogTitle>
        <DialogContent>
          <Prontuarios />{" "}
          {/* Renderiza o componente de agendamentos no modal */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openModal === "financeiro"} onClose={handleCloseModal} fullWidth>
    <DialogTitle>Relatório Financeiro</DialogTitle>
    <DialogContent>
        <RelatorioFinanceiro />
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseModal}>Fechar</Button>
    </DialogActions>
</Dialog>

    </Box>
  );
}
