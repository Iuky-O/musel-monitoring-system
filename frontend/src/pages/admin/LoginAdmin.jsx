import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/Home.css';

function LoginAdmin() {
    const [key, setKey] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const autenticar = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ key })
            });

            if (response.ok) {
            const data = await response.json();
            console.log("Admin autenticado:", data);
            navigate("/user/obra");
            } else {
            const error = await response.json();
            setErro(error.detail || "Erro na autenticação");
            }
        } catch (err) {
            setErro("Erro de conexão com o servidor");
        }
    };

    return (
        <div className="home-container">
        <header className="home-header">
            <div className="home-content">
            <h1>Seja Bem vindo ao Nosso Museu</h1>
            <p>Insira a chave de autenticação</p>
            <div className="home-buttons">
                <form onSubmit={autenticar}>
                <input
                    className="text-input"
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Digite sua chave"
                />
                <div className="btn-contet">
                    <button type="submit" className="btn-secondary">Entrar</button>
                </div>
                <div>
                    {erro && <p style={{ color: 'red' }}>{erro}</p>}
                </div>
                </form>
            </div>
            </div>
        </header>
        </div>
    );
}

export default LoginAdmin;
