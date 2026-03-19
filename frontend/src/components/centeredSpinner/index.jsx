import Spinner from '../spinner';
import styles from './CenteredSpinner.module.css';

const CenteredSpinner = ({ size = 'small' }) => {
  return (
    <div className={styles.wrapper}>
      <Spinner size={size} />
    </div>
  );
};

export default CenteredSpinner;
