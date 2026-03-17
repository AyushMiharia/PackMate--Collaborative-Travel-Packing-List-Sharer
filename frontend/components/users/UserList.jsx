import { useState } from "react";
import PropTypes from "prop-types";

export default function UserList({ users, onUpdate }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      onUpdate();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setEditData({ name: user.name, email: user.email, homeCity: user.homeCity });
  };

  const handleSave = async (id) => {
    try {
      await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setEditId(null);
      onUpdate();
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  return (
    <ul>
      {users.map((user) => (
        <li key={user._id}>
          {editId === user._id ? (
            <div>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
              <input
                type="text"
                value={editData.homeCity}
                onChange={(e) => setEditData({ ...editData, homeCity: e.target.value })}
              />
              <button onClick={() => handleSave(user._id)}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <strong>{user.name}</strong> — {user.email} — {user.homeCity}
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user._id)}>Delete</button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      homeCity: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
};