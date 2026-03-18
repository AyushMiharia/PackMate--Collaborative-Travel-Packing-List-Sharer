import { useState } from 'react';
import PropTypes from 'prop-types';

export default function TipList({ tips, onUpdate }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/communityTips/${id}`, { method: 'DELETE' });
      onUpdate();
    } catch (err) {
      console.error('Failed to delete tip', err);
    }
  };

  const handleEdit = (tip) => {
    setEditId(tip._id);
    setEditData({ tip: tip.tip, tripType: tip.tripType, author: tip.author });
  };

  const handleSave = async (id) => {
    try {
      await fetch(`/api/communityTips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      setEditId(null);
      onUpdate();
    } catch (err) {
      console.error('Failed to update tip', err);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await fetch(`/api/communityTips/${id}/upvote`, { method: 'PATCH' });
      onUpdate();
    } catch (err) {
      console.error('Failed to upvote tip', err);
    }
  };

  return (
    <ul>
      {tips.map((tip) => (
        <li key={tip._id}>
          {editId === tip._id ? (
            <div>
              <select
                value={editData.tripType}
                onChange={(e) =>
                  setEditData({ ...editData, tripType: e.target.value })
                }
              >
                <option value="beach">Beach</option>
                <option value="hiking">Hiking</option>
                <option value="city">City</option>
                <option value="winter">Winter</option>
                <option value="business">Business</option>
              </select>
              <input
                type="text"
                value={editData.author}
                onChange={(e) =>
                  setEditData({ ...editData, author: e.target.value })
                }
              />
              <textarea
                value={editData.tip}
                onChange={(e) =>
                  setEditData({ ...editData, tip: e.target.value })
                }
              />
              <button onClick={() => handleSave(tip._id)}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <strong>{tip.tripType}</strong> — {tip.author}
              <p>{tip.tip}</p>
              <button onClick={() => handleUpvote(tip._id)}>
                👍 {tip.upvotes}
              </button>
              <button onClick={() => handleEdit(tip)}>Edit</button>
              <button onClick={() => handleDelete(tip._id)}>Delete</button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

TipList.propTypes = {
  tips: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      tripType: PropTypes.string.isRequired,
      tip: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      upvotes: PropTypes.number.isRequired,
    })
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
