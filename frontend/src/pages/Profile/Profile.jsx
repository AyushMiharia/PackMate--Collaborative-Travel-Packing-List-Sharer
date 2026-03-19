import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import TipCard from '../../components/TipCard/TipCard';
import styles from './Profile.module.css';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import CenteredSpinner from '../../components/centeredSpinner';

const Profile = ({ user, isAuthenticated }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(user);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', homeCity: user?.homeCity || '' });
  const [saved, setSaved] = useState(false);
  const [myTips, setMyTips] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tipsData, tripsData] = await Promise.all([api.getTips(), api.getMyTrips()]);
        setMyTips(tipsData.filter((t) => t.email === user.email));
        setTrips(tripsData);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const activeTrips = trips.filter((t) => t.status === 'ongoing' || t.status === 'planning');

  const handleSave = async () => {
    try {
      const response = await api.updateMe(form);
      setUserInfo(response);
      setSaved(true);
      setEditing(false);
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
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={`${styles.inner} container`}>
          <p className={styles.notAuth}>Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) return <CenteredSpinner size="small" />;

  return (
    <div className={styles.page}>
      <div className={`${styles.inner} container`}>
        <div className={styles.header}>
          <div className={styles.avatar}>{userInfo.name[0].toUpperCase()}</div>
          <div className={styles.info}>
            <h1 className={styles.name}>{userInfo.name}</h1>
            {userInfo.homeCity && <p className={styles.email}>{userInfo.homeCity}</p>}
            <p className={styles.email}>{userInfo.email}</p>
            <div className={styles.pills}>
              <span className={styles.pill}>{trips.length} trips</span>
              <span className={`${styles.pill} ${styles.pillBlue}`}>
                {myTips.length} tips shared
              </span>
              <span className={`${styles.pill} ${styles.pillGreen}`}>
                {myTips.reduce((sum, t) => sum + (t.upvoteCount || 0), 0)} upvotes received
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

        {saved && <div className={styles.savedBanner}>Profile updated</div>}

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
                <label className={styles.label} htmlFor="p-city">
                  Home City
                </label>
                <input
                  id="p-city"
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

        {activeTrips.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Currently packing for</h2>
            <div className={styles.activeTripsGrid}>
              {activeTrips.map((trip) => (
                <div key={trip._id} className={styles.activeTripCard}>
                  <div className={styles.activeTripIcon}>
                    {trip.climate === 'cold' ? '❄️' : trip.climate === 'tropical' ? '🌴' : '☀️'}
                  </div>
                  <div className={styles.activeTripInfo}>
                    <p className={styles.activeTripName}>{trip.tripName}</p>
                    <p className={styles.activeTripMeta}>
                      {trip.destination}
                      {trip.country ? `, ${trip.country}` : ''} · {trip.durationDays} days
                    </p>
                    <p className={styles.activeTripPacked}>
                      {trip.items.filter((i) => i.isChecked).length}/{trip.items.length} items
                      packed
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
    homeCity: PropTypes.string,
  }),
  isAuthenticated: PropTypes.bool.isRequired,
};
Profile.defaultProps = { user: null, isAuthenticated: false };

export default Profile;
