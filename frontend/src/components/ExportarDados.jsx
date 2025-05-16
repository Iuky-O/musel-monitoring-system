import React from 'react';

const ExportarDados = () => {
  const exportar = async (formato) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/estatisticas/exportar-${formato}`);

      if (!response.ok) {
        const err = await response.json();
        alert(err.detail || `Erro ao exportar ${formato.toUpperCase()}`);
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dados_exportados.${formato}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(`Erro ao exportar ${formato}:`, error);
      alert(`Erro ao exportar ${formato.toUpperCase()}`);
    }
  };


  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Exportar Dados</h3>
      <button onClick={() => exportar('csv')} style={{ marginRight: "10px" }}>
        Exportar CSV
      </button>
      <button onClick={() => exportar('pdf')}>
        Exportar PDF
      </button>
    </div>
  );
};

export default ExportarDados;
