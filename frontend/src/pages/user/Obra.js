import React from 'react';
import VisitaCounter from '../../components/VisitaCounter';

const Obra = () => {
  // Supondo que você tenha o ID da obra disponível
  const obraId = "67e0adad46e5b921c4a270d9"; // Substitua pelo ID real

  return (
    <div>
      <h1>Detalhes da Obra</h1>
      {/* Outros detalhes da obra */}
      <VisitaCounter obraId={obraId} />
    </div>
  );
};

export default Obra;