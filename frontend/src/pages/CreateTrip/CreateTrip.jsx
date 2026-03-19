// src/pages/CreateTrip/CreateTrip.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { climates, tripTypes, luggageTypes, climateEmoji, typeEmoji } from '../../utils/constants';
import styles from './CreateTrip.module.css';
import { api } from '../../utils/api';
import { toast } from 'sonner';

const STEPS = ['Basics', 'Trip Profile', 'Review'];

const CreateTrip = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    tripName: '',
    destination: '',
    country: '',
    startDate: '',
    endDate: '',
    climate: '',
    tripType: '',
    luggageType: '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const duration = () => {
    if (!form.startDate || !form.endDate) return null;
    const d = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000);
    return d > 0 ? d : null;
  };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.tripName.trim()) e.tripName = 'Required';
      if (!form.destination.trim()) e.destination = 'Required';
      if (!form.country.trim()) e.country = 'Required';
      if (!form.startDate) e.startDate = 'Required';
      if (!form.endDate) e.endDate = 'Required';
      if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate))
        e.endDate = 'Must be after start date';
    }
    if (step === 1) {
      if (!form.climate) e.climate = 'Select one';
      if (!form.tripType) e.tripType = 'Select one';
      if (!form.luggageType) e.luggageType = 'Select one';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    try {
      const response = await api.createTrip({
        ...form,
        durationDays: duration(),
        status: 'planning',
        items: [],
      });
      console.log(response);
      toast.success('Trip created successfully!');
      navigate(`/dashboard`);
    } catch (error) {
      console.error('Failed to create trip:', error);
      toast.error('Failed to create trip.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.inner} container`}>
        <div className={styles.pageHead}>
          <h1 className={styles.title}>Create a trip</h1>
          <p className={styles.sub}>Fill in the details to open your packing list.</p>
        </div>

        {/* stepper */}
        <div className={styles.stepper}>
          {STEPS.map((s, i) => (
            <div key={s} className={styles.stepItem}>
              <div
                className={`${styles.stepDot} ${i < step ? styles.stepDone : ''} ${i === step ? styles.stepActive : ''}`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`${styles.stepLabel} ${i === step ? styles.stepLabelOn : ''}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* card */}
        <div className={styles.card}>
          {/* ── step 0 ── */}
          {step === 0 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>Trip basics</h2>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="tripName">
                  Trip name
                </label>
                <input
                  id="tripName"
                  className={`${styles.input} ${errors.tripName ? styles.inputErr : ''}`}
                  type="text"
                  placeholder="e.g. Tokyo Winter Escape"
                  value={form.tripName}
                  onChange={(e) => set('tripName', e.target.value)}
                />
                {errors.tripName && <span className={styles.err}>{errors.tripName}</span>}
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="destination">
                    Destination
                  </label>
                  <input
                    id="destination"
                    className={`${styles.input} ${errors.destination ? styles.inputErr : ''}`}
                    type="text"
                    placeholder="City"
                    value={form.destination}
                    onChange={(e) => set('destination', e.target.value)}
                  />
                  {errors.destination && <span className={styles.err}>{errors.destination}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="country">
                    Country
                  </label>
                  <input
                    id="country"
                    className={`${styles.input} ${errors.country ? styles.inputErr : ''}`}
                    type="text"
                    placeholder="Country"
                    value={form.country}
                    onChange={(e) => set('country', e.target.value)}
                  />
                  {errors.country && <span className={styles.err}>{errors.country}</span>}
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="startDate">
                    Start date
                  </label>
                  <input
                    id="startDate"
                    className={`${styles.input} ${errors.startDate ? styles.inputErr : ''}`}
                    type="date"
                    value={form.startDate}
                    onChange={(e) => set('startDate', e.target.value)}
                  />
                  {errors.startDate && <span className={styles.err}>{errors.startDate}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="endDate">
                    End date
                  </label>
                  <input
                    id="endDate"
                    className={`${styles.input} ${errors.endDate ? styles.inputErr : ''}`}
                    type="date"
                    value={form.endDate}
                    onChange={(e) => set('endDate', e.target.value)}
                  />
                  {errors.endDate && <span className={styles.err}>{errors.endDate}</span>}
                </div>
              </div>

              {duration() && (
                <span className={styles.durationPill}>
                  📅 {duration()} day{duration() !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {/* ── step 1 ── */}
          {step === 1 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>Trip profile</h2>

              <div className={styles.field}>
                <label className={styles.label}>Climate</label>
                {errors.climate && <span className={styles.err}>{errors.climate}</span>}
                <div className={styles.optGrid}>
                  {climates.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`${styles.optBtn} ${form.climate === c ? styles.optOn : ''}`}
                      onClick={() => set('climate', c)}
                    >
                      <span className={styles.optIcon}>{climateEmoji[c]}</span>
                      <span className={styles.optLabel}>{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Trip type</label>
                {errors.tripType && <span className={styles.err}>{errors.tripType}</span>}
                <div className={styles.optGrid}>
                  {tripTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`${styles.optBtn} ${form.tripType === t ? styles.optOn : ''}`}
                      onClick={() => set('tripType', t)}
                    >
                      <span className={styles.optIcon}>{typeEmoji[t]}</span>
                      <span className={styles.optLabel}>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Luggage type</label>
                {errors.luggageType && <span className={styles.err}>{errors.luggageType}</span>}
                <div className={styles.optGrid}>
                  {luggageTypes.map((l) => (
                    <button
                      key={l}
                      type="button"
                      className={`${styles.optBtn} ${form.luggageType === l ? styles.optOn : ''}`}
                      onClick={() => set('luggageType', l)}
                    >
                      <span className={styles.optIcon}>{l === 'carry-on' ? '🎒' : '🧳'}</span>
                      <span className={styles.optLabel}>{l}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── step 2 ── */}
          {step === 2 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>Review your trip</h2>
              <div className={styles.preview}>
                <div className={styles.previewTop}>
                  <div className={styles.previewIcon}>{climateEmoji[form.climate] || '✈️'}</div>
                  <div>
                    <p className={styles.previewName}>{form.tripName}</p>
                    <p className={styles.previewDest}>
                      {form.destination}, {form.country}
                    </p>
                  </div>
                </div>
                <div className={styles.previewGrid}>
                  {[
                    { l: 'Climate', v: form.climate },
                    { l: 'Trip type', v: form.tripType },
                    { l: 'Luggage', v: form.luggageType },
                    { l: 'Duration', v: `${duration()} days` },
                    { l: 'From', v: form.startDate },
                    { l: 'To', v: form.endDate },
                  ].map((r) => (
                    <div key={r.l} className={styles.previewRow}>
                      <span className={styles.previewLabel}>{r.l}</span>
                      <span className={styles.previewValue}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* nav */}
          <div className={styles.nav}>
            {step > 0 ? (
              <button className={styles.backBtn} onClick={back}>
                ← Back
              </button>
            ) : (
              <span />
            )}
            {step < STEPS.length - 1 ? (
              <button className={styles.nextBtn} onClick={next}>
                Continue →
              </button>
            ) : (
              <button className={styles.submitBtn} onClick={submit}>
                Create trip →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
