// src/components/Navbar/Navbar.js
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Navbar.module.css';
import { api } from '../../utils/api';
import { toast } from 'sonner';

const Navbar = ({ user, isAuthenticated, setIsAuthenticated }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const active = (p) => pathname === p;

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate('/');
      setOpen(false);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={`${styles.inner} container`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoDot} />
          PackMate
        </Link>

        <div className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
          <Link
            to="/dashboard"
            className={`${styles.link} ${active('/dashboard') ? styles.linkActive : ''}`}
            onClick={() => setOpen(false)}
          >
            My Trips
          </Link>
          <Link
            to="/community"
            className={`${styles.link} ${active('/community') ? styles.linkActive : ''}`}
            onClick={() => setOpen(false)}
          >
            Community
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`${styles.link} ${active('/profile') ? styles.linkActive : ''}`}
                onClick={() => setOpen(false)}
              >
                {user?.name?.split(' ')[0]}
              </Link>
              <button className={styles.outlineBtn} onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link} onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link to="/register" className={styles.solidBtn} onClick={() => setOpen(false)}>
                Get started
              </Link>
            </>
          )}
        </div>

        <button className={styles.burger} onClick={() => setOpen(!open)} aria-label="menu">
          <span className={`${styles.bar} ${open ? styles.bar1Open : ''}`} />
          <span className={`${styles.bar} ${open ? styles.bar2Open : ''}`} />
          <span className={`${styles.bar} ${open ? styles.bar3Open : ''}`} />
        </button>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({ name: PropTypes.string }),
  isAuthenticated: PropTypes.bool.isRequired,
};
Navbar.defaultProps = { user: null, isAuthenticated: false };

export default Navbar;
