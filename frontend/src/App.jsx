// src/App.js
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import './styles/global.css';
import AuthProvider from './context/authContext';
import RoutesProvider from './routes';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <RoutesProvider />
        <Toaster position="top-right" style={{ top: '65px' }} duration={2000} />
      </AuthProvider>
    </Router>
  );
};

export default App;
