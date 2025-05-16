import React, { createContext, useContext, useState } from 'react';

const ObraContext = createContext();

export const ObraProvider = ({ children }) => {
  const [obraSelecionadaId, setObraSelecionadaId] = useState(null);

  return (
    <ObraContext.Provider value={{ obraSelecionadaId, setObraSelecionadaId }}>
      {children}
    </ObraContext.Provider>
  );
};

export const useObraContext = () => useContext(ObraContext);
