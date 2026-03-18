import { useState } from 'react';
import UsersPage from './pages/UsersPage.jsx';
import CommunityTipsPage from './pages/CommunityTipsPage.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('tips');

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage('tips')}>Community Tips</button>
        <button onClick={() => setCurrentPage('users')}>Users</button>
      </nav>

      {currentPage === 'tips' && <CommunityTipsPage />}
      {currentPage === 'users' && <UsersPage />}
    </div>
  );
}
