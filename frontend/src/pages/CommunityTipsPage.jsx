import { useState, useEffect } from 'react';
import TipList from '../components/communityTips/TipList.jsx';
import TipForm from '../components/communityTips/TipForm.jsx';

export default function CommunityTipsPage() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTripType, setFilterTripType] = useState('');

  const fetchTips = async () => {
    try {
      const query = filterTripType ? `?tripType=${filterTripType}` : '';
      const res = await fetch(`/api/communityTips${query}`);
      const data = await res.json();
      setTips(data);
    } catch (err) {
      console.error('Failed to fetch tips', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [filterTripType]);

  return (
    <div className="tips-page">
      <h1>Community Packing Tips</h1>
      <select
        value={filterTripType}
        onChange={(e) => setFilterTripType(e.target.value)}
      >
        <option value="">All Trip Types</option>
        <option value="beach">Beach</option>
        <option value="hiking">Hiking</option>
        <option value="city">City</option>
        <option value="winter">Winter</option>
        <option value="business">Business</option>
      </select>
      <TipForm onTipAdded={fetchTips} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TipList tips={tips} onUpdate={fetchTips} />
      )}
    </div>
  );
}
