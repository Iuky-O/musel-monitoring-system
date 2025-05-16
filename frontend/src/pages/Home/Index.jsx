import React from 'react';
import '../../style/Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-content">
          <h1>Seja Bem vindo ao Nosso Museul</h1>
          <p>Aqui você pode mostrar as suas melhores obras e ainda conferir estatisticas sobre elas!</p>
          <div className="home-buttons">
            <a href="#/user/obra" className="btn-primary">Área do Administrador</a>
            <a href="#/user/exposicao" className="btn-secondary">Exposição</a>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Home;
