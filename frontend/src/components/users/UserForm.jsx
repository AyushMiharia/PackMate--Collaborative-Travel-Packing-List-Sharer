import { useState } from 'react';
import PropTypes from 'prop-types';

export default function UserForm({ onUserAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [homeCity, setHomeCity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, homeCity }),
      });
      setName('');
      setEmail('');
      setHomeCity('');
      onUserAdded();
    } catch (err) {
      console.error('Failed to add user', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add User</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Home City"
        value={homeCity}
        onChange={(e) => setHomeCity(e.target.value)}
        required
      />
      <button type="submit">Add User</button>
    </form>
  );
}

UserForm.propTypes = {
  onUserAdded: PropTypes.func.isRequired,
};
