// src/components/TripCard/TripCard.js
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { climateEmoji } from '../../utils/mockData';
import styles from './TripCard.module.css';

const statusMeta = {
  planning: { label: 'Planning', cls: 'blue' },
  ongoing: { label: 'Ongoing', cls: 'amber' },
  completed: { label: 'Done', cls: 'green' },
};

const TripCard = ({ trip, index, onDelete }) => {
  const checked = trip.items.filter((i) => i.isChecked).length;
  const total = trip.items.length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  const meta = statusMeta[trip.status] || statusMeta.planning;

  return (
    <div className={styles.row}>
      <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>

      <div className={`${styles.icon} ${styles[`icon_${meta.cls}`]}`}>
        {climateEmoji[trip.climate] || '✈️'}
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{trip.tripName}</p>
        <p className={styles.dest}>
          {trip.destination}, {trip.country} · {trip.durationDays}d · {trip.tripType}
        </p>
      </div>

      <div className={styles.progress}>
        <div className={styles.track}>
          <div
            className={`${styles.fill} ${styles[`fill_${meta.cls}`]}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={styles.pct}>{pct}%</span>
      </div>

      <span className={`${styles.badge} ${styles[`badge_${meta.cls}`]}`}>{meta.label}</span>

      <div className={styles.actions}>
        <Link to={`/trip/${trip._id}`} className={styles.viewBtn}>
          View →
        </Link>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(trip._id)}
          aria-label="delete trip"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

TripCard.propTypes = {
  trip: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    tripName: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    climate: PropTypes.string.isRequired,
    tripType: PropTypes.string.isRequired,
    durationDays: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TripCard;
