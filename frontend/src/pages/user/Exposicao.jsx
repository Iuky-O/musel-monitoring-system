import React, { useEffect, useState } from 'react';
import '../../style/Exposicao.css';
import { useObraContext } from '../../hook/ObraContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Exposicao = () => {
  const [obras, setObras] = useState([]);
  const { setObraSelecionadaId } = useObraContext();
  useEffect(() => {
    const fetchObras = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/admin/obras/');
        setObras(response.data);
      } catch (error) {
        console.error('Erro ao buscar obras:', error);
      }
    };

    fetchObras();
  }, []);

  return (
    <div className="explore-container">
      <h1 className="explore-title">Escolha a Obra que sera exibida</h1>
      <div className="card-grid">
        {obras.map((obra) => (
          <Link
            to={`/user/visualizar`}
            key={obra._id}
            className="art-card"
            onClick={() => setObraSelecionadaId(obra._id)}
          >
            <div className="card-images">
              <img
                src={obra.imagens_url?.[0] || 'https://via.placeholder.com/300'}
                alt={obra.titulo}
              />
            </div>
            <div className="card-footer">
              <span>{obra.titulo}</span>
              <span>{obra.ano}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Exposicao;
