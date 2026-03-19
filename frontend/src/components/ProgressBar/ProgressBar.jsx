// src/components/ProgressBar/ProgressBar.js
import PropTypes from 'prop-types';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ checked, total }) => {
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  const cls = pct === 100 ? 'green' : pct >= 50 ? 'blue' : 'amber';

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>Packing progress</span>
        <span className={`${styles.pct} ${styles[`pct_${cls}`]}`}>{pct}%</span>
      </div>
      <div className={styles.track}>
        <div className={`${styles.fill} ${styles[`fill_${cls}`]}`} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.sub}>
        {checked} of {total} items packed{pct === 100 ? ' — all done!' : ''}
      </p>
    </div>
  );
};

ProgressBar.propTypes = {
  checked: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default ProgressBar;
