import { Route, Routes } from 'react-router-dom';
import Home from './views/home';
import PacientesCreate from './views/pacientes/create';
import ProntuariosCreate from './views/prontuarios/create';
import Pacientes from './views/pacientes';
import Prontuarios from './views/prontuarios';
import Agendamentos from './views/agendamentos';
import Pagamentos from './views/pagamentos';
import Login from './views/login';
import Usuarios from './views/usuarios';
import UsuariosCreate from './views/usuarios/create';
import Relatorios from './views/relatorios';
import Dashboard from './views/dashboard';
import MachineLearning from './views/ml';
import PredicaoFaltas from './views/ml/predicao-faltas';
import PrevisaoDemanda from './views/ml/previsao-demanda';
import AnaliseDados from './views/ml/analise-dados';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/pacientes/novo" element={<PacientesCreate />} />
            <Route path="/pacientes/:id/editar" element={<PacientesCreate />} />
            <Route path="/prontuarios" element={<Prontuarios />} />
            <Route path="/prontuarios/novo" element={<ProntuariosCreate />} />
            <Route path="/prontuarios/:id/editar" element={<ProntuariosCreate />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/novo" element={<UsuariosCreate/>}/>
            <Route path="/relatórios" element={<Relatorios/>}/>
            <Route path="usuarios/:id/editar" element={<UsuariosCreate/>}/>
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="/ml" element={<MachineLearning />} />
            <Route path="/ml/predicao-faltas" element={<PredicaoFaltas />} />
            <Route path="/ml/previsao-demanda" element={<PrevisaoDemanda />} />
            <Route path="/ml/analise-dados" element={<AnaliseDados />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Login />} />
        </Routes>
    );
}

function NotFound() {
    return <h1>404 - Page Not Found</h1>;
}
