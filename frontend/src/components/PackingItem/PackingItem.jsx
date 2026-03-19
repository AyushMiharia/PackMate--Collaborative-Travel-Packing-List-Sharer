// src/components/PackingItem/PackingItem.js
import PropTypes from 'prop-types';
import styles from './PackingItem.module.css';

const catIcon = {
  Clothing: '👕',
  Footwear: '👟',
  Electronics: '🔌',
  Toiletries: '🧴',
  Documents: '📄',
  'Health & Safety': '💊',
  'Activity Gear': '🎒',
};

const PackingItem = ({
  item,
  isChecked,
  isInTrip,
  onToggleCheck,
  onAddToTrip,
  onRemoveFromTrip,
}) => (
  <div className={`${styles.row} ${isChecked ? styles.checked : ''}`}>
    {isInTrip && (
      <button
        className={`${styles.checkbox} ${isChecked ? styles.checkboxOn : ''}`}
        onClick={() => onToggleCheck(item._id)}
        aria-label={isChecked ? 'uncheck' : 'check'}
      >
        {isChecked && <span className={styles.tick}>✓</span>}
      </button>
    )}

    <span className={styles.icon}>{catIcon[item.category] || '📦'}</span>

    <div className={styles.info}>
      <span className={styles.name}>{item.name}</span>
      <span className={styles.cat}>{item.category}</span>
    </div>

    {item.isEssential && <span className={styles.essential}>Essential</span>}

    {isInTrip ? (
      <button
        className={styles.removeBtn}
        onClick={() => onRemoveFromTrip(item._id)}
        aria-label="remove"
      >
        ✕
      </button>
    ) : (
      <button className={styles.addBtn} onClick={() => onAddToTrip(item)}>
        + Add
      </button>
    )}
  </div>
);

PackingItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    isEssential: PropTypes.bool,
  }).isRequired,
  isChecked: PropTypes.bool,
  isInTrip: PropTypes.bool,
  onToggleCheck: PropTypes.func,
  onAddToTrip: PropTypes.func,
  onRemoveFromTrip: PropTypes.func,
};
PackingItem.defaultProps = {
  isChecked: false,
  isInTrip: false,
  onToggleCheck: () => {},
  onAddToTrip: () => {},
  onRemoveFromTrip: () => {},
};

export default PackingItem;
