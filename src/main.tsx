import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Ocultar loading inicial cuando React se monta
const hideInitialLoading = () => {
  const initialLoading = document.querySelector('.initial-loading');
  if (initialLoading) {
    initialLoading.style.opacity = '0';
    initialLoading.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => {
      initialLoading.remove();
    }, 300);
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Ocultar loading después de que React se monte
setTimeout(hideInitialLoading, 100);