// src/pages/Register/Register.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { mockUser } from '../../utils/mockData';
import styles from './Register.module.css';
import { api } from '../../utils/api';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    homeCity: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.homeCity.trim()) e.homeCity = 'Required';
    if (form.password.length < 6) e.password = 'Min. 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    try {
      setLoading(true);
      await api.register(form);
      navigate('/login');
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Registration failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          PackMate
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.sub}>Free forever. Start packing smarter today.</p>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className={`${styles.input} ${errors.name ? styles.inputErr : ''}`}
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && <span className={styles.err}>{errors.name}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Home City
            </label>
            <input
              id="name"
              className={`${styles.input} ${errors.homeCity ? styles.inputErr : ''}`}
              type="text"
              placeholder="New York"
              value={form.homeCity}
              onChange={(e) => set('homeCity', e.target.value)}
            />
            {errors.homeCity && <span className={styles.err}>{errors.homeCity}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
            {errors.email && <span className={styles.err}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
            />
            {errors.password && <span className={styles.err}>{errors.password}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              className={`${styles.input} ${errors.confirm ? styles.inputErr : ''}`}
              type="password"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={(e) => set('confirm', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            {errors.confirm && <span className={styles.err}>{errors.confirm}</span>}
          </div>

          <button className={styles.submitBtn} onClick={submit} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.switchLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
