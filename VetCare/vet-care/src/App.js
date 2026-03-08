import React, { useState } from 'react';
import './App.css';

function App() {
  const [petName, setPetName] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <h1>🐾 VetCare</h1>
        <p>Sistema de Controle de Prontuários</p>
      </header>

      <main style={{ padding: '20px' }}>
        <h2>Cadastrar Novo Pet</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Nome do Pet (Ex: Thor)" 
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button 
            onClick={() => alert(`Pet ${petName} cadastrado com sucesso!`)}
            style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
          >
            Salvar no Prontuário
          </button>
        </div>
      </main>
    </div>
  );
}

