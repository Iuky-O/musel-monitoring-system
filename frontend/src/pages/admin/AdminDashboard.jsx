import { Link } from "react-router-dom";

function AdminDashboard() {
    return (
        <div>
            <h1>Painel Administrativo</h1>
            <nav>
                <ul>
                    <li><Link to="/admin/cadastro">Cadastrar Obra</Link></li>
                    <li><Link to="/admin/lista">Lista de Obras</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default AdminDashboard;
