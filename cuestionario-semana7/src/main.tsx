// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import CuestionarioSelector from './CuestionarioSelector.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className='app-container'>
      <CuestionarioSelector />
    </div>
  </React.StrictMode>
);
