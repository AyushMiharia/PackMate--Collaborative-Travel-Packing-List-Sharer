import { useState } from 'react';
import PropTypes from 'prop-types';

export default function TipForm({ onTipAdded }) {
  const [tripType, setTripType] = useState('');
  const [tip, setTip] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/communityTips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripType, tip, author }),
      });
      setTripType('');
      setTip('');
      setAuthor('');
      onTipAdded();
    } catch (err) {
      console.error('Failed to add tip', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a Tip</h2>
      <select
        value={tripType}
        onChange={(e) => setTripType(e.target.value)}
        required
      >
        <option value="">Select Trip Type</option>
        <option value="beach">Beach</option>
        <option value="hiking">Hiking</option>
        <option value="city">City</option>
        <option value="winter">Winter</option>
        <option value="business">Business</option>
      </select>
      <input
        type="text"
        placeholder="Your name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <textarea
        placeholder="Share your packing tip..."
        value={tip}
        onChange={(e) => setTip(e.target.value)}
        required
      />
      <button type="submit">Add Tip</button>
    </form>
  );
}

TipForm.propTypes = {
  onTipAdded: PropTypes.func.isRequired,
};
