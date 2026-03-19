import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TripCard from '../../components/TripCard/TripCard';
import styles from './Dashboard.module.css';
import { api } from '../../utils/api';
import CenteredSpinner from '../../components/centeredSpinner/index';
const TABS = ['all', 'planning', 'ongoing', 'completed'];

const Dashboard = ({ user, isAuthenticated }) => {
  const [trips, setTrips] = useState();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  const fetchTrips = async () => {
    try {
      const data = await api.getMyTrips();
      setTrips(data);
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this trip?')) return;
    setTrips((p) => p.filter((t) => t._id !== id));
  };

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === 'all' ? trips?.length : trips?.filter((x) => x.status === t).length;
    return acc;
  }, {});

  if (loading) {
    return <CenteredSpinner size="small" />;
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.inner} container`}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Trips</h1>
            {isAuthenticated && (
              <p className={styles.sub}>Welcome back, {user.name.split(' ')[0]}</p>
            )}
          </div>
          <Link to="/create-trip" className={styles.newBtn}>
            + New trip
          </Link>
        </div>

        {/* summary */}
        <div className={styles.summary}>
          <div className={styles.summCard}>
            <span className={styles.summN}>{trips.length}</span>
            <span className={styles.summL}>Total</span>
          </div>
          <div className={styles.summCard}>
            <span className={`${styles.summN} ${styles.summBlue}`}>{counts.planning}</span>
            <span className={styles.summL}>Planning</span>
          </div>
          <div className={styles.summCard}>
            <span className={`${styles.summN} ${styles.summAmber}`}>{counts.ongoing}</span>
            <span className={styles.summL}>Ongoing</span>
          </div>
          <div className={styles.summCard}>
            <span className={`${styles.summN} ${styles.summGreen}`}>{counts.completed}</span>
            <span className={styles.summL}>Completed</span>
          </div>
        </div>

        {/* tabs */}
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabOn : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span className={styles.tabCount}></span>
            </button>
          ))}
        </div>

        {/* list */}
        {trips.length > 0 ? (
          <div className={styles.list}>
            {trips.map((trip, i) => (
              <TripCard key={trip._id} trip={trip} index={i} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No trips here yet.</p>
            <p className={styles.emptySub}>
              Create your first trip to start building a packing list.
            </p>
            <Link to="/create-trip" className={styles.newBtn} style={{ marginTop: 16 }}>
              + New trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.shape({ name: PropTypes.string }),
  isAuthenticated: PropTypes.bool.isRequired,
};
Dashboard.defaultProps = { user: null, isAuthenticated: false };

export default Dashboard;
