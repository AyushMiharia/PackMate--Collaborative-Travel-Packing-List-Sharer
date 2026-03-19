import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { mockTips, mockTrips } from '../../utils/mockData';
import TipCard from '../../components/TipCard/TipCard';
import styles from './Profile.module.css';
import { api } from '../../utils/api';
import { toast } from 'sonner';

const Profile = ({ user, isAuthenticated }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(user);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', homeCity: user?.homeCity || '' });
  const [saved, setSaved] = useState(false);

  const myTips = mockTips.filter((t) => user?.submittedTips?.includes(t._id));
  const activeTrip = mockTrips.find((t) => t._id === user?.currentActiveTripId);

  const handleSave = async () => {
    try {
      setSaved(true);
      setEditing(false);
      const response = await api.updateMe(form);
      setUserInfo(response);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate('/');
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  if (!isAuthenticated)
    return (
      <div className={styles.page}>
        <div className={`${styles.inner} container`}>
          <p className={styles.notAuth}>Please sign in to view your profile.</p>
        </div>
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={`${styles.inner} container`}>
        {/* header */}
        <div className={styles.header}>
          <div className={styles.avatar}>{userInfo.name[0].toUpperCase()}</div>
          <div className={styles.info}>
            <h1 className={styles.name}>{userInfo.name}</h1>
            <p className={styles.email}>{userInfo.homeCity}</p>
            <p className={styles.email}>{userInfo.email}</p>
            <div className={styles.pills}>
              <span className={styles.pill}>{mockTrips.length} trips</span>
              <span className={`${styles.pill} ${styles.pillBlue}`}>
                {myTips.length} tips shared
              </span>
              <span className={`${styles.pill} ${styles.pillGreen}`}>
                {user.upvotedTips?.length || 0} upvoted
              </span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.editBtn} onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : '✎ Edit'}
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        {saved && <div className={styles.savedBanner}>✓ Profile updated</div>}

        {/* edit form */}
        {editing && (
          <div className={styles.editCard}>
            <h2 className={styles.sectionTitle}>Edit profile</h2>
            <div className={styles.editRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="p-name">
                  Name
                </label>
                <input
                  id="p-name"
                  className={styles.input}
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="p-email">
                  Home City
                </label>
                <input
                  id="p-email"
                  className={styles.input}
                  type="text"
                  value={form.homeCity}
                  onChange={(e) => setForm((p) => ({ ...p, homeCity: e.target.value }))}
                />
              </div>
            </div>
            <button className={styles.saveBtn} onClick={handleSave}>
              Save changes
            </button>
          </div>
        )}

        {/* active trip */}
        {activeTrip && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Currently packing for</h2>
            <div className={styles.activeTripCard}>
              <div className={styles.activeTripIcon}>
                {activeTrip.climate === 'cold'
                  ? '❄️'
                  : activeTrip.climate === 'tropical'
                    ? '🌴'
                    : '☀️'}
              </div>
              <div className={styles.activeTripInfo}>
                <p className={styles.activeTripName}>{activeTrip.tripName}</p>
                <p className={styles.activeTripMeta}>
                  {activeTrip.destination}, {activeTrip.country} · {activeTrip.durationDays} days
                </p>
                <p className={styles.activeTripPacked}>
                  {activeTrip.items.filter((i) => i.isChecked).length}/{activeTrip.items.length}{' '}
                  items packed
                </p>
              </div>
            </div>
          </div>
        )}

        {/* submitted tips */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>My submitted tips</h2>
          {myTips.length === 0 ? (
            <p className={styles.emptyText}>
              You haven&apos;t shared any tips yet. Complete a trip and share what you learned!
            </p>
          ) : (
            <div className={styles.tipsBox}>
              {myTips.map((tip) => (
                <TipCard
                  key={tip._id}
                  tip={tip}
                  hasUpvoted={false}
                  onUpvote={() => {}}
                  onRemoveUpvote={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    submittedTips: PropTypes.arrayOf(PropTypes.string),
    upvotedTips: PropTypes.arrayOf(PropTypes.string),
    currentActiveTripId: PropTypes.string,
  }),
  isAuthenticated: PropTypes.bool.isRequired,
};
Profile.defaultProps = { user: null, isAuthenticated: false };

export default Profile;
