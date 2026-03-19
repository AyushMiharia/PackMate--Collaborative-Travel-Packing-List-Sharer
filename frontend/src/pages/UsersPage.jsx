import { useState, useEffect } from 'react';
import UserList from '../components/users/UserList.jsx';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleSignupSuccess = () => {
    setAuthMode('login');
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="users-page">
        {authMode === 'login' ? (
          <>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
            <p>
              Don't have an account?{' '}
              <button onClick={() => setAuthMode('signup')}>Sign Up</button>
            </p>
          </>
        ) : (
          <>
            <SignupForm onSignupSuccess={handleSignupSuccess} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setAuthMode('login')}>Login</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="users-page">
      <div>
        <p>Welcome, {currentUser.name}!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h1>Users</h1>
      <UserForm onUserAdded={fetchUsers} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <UserList users={users} onUpdate={fetchUsers} />
      )}
    </div>
  );
}
