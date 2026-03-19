// src/pages/Community/Community.js
import { useState } from 'react';
import PropTypes from 'prop-types';
import { mockTips, tripTypes, climates } from '../../utils/mockData';
import TipCard from '../../components/TipCard/TipCard';
import FilterBar from '../../components/FilterBar/FilterBar';
import styles from './Community.module.css';

const typeFilters = tripTypes.map((t) => ({ value: t, label: t }));
const climateFilters = climates.map((c) => ({ value: c, label: c }));
const SORTS = ['Most upvoted', 'Most recent'];

const Community = ({ user, isAuthenticated }) => {
  const [tips, setTips] = useState(mockTips);
  const [upvoted, setUpvoted] = useState([]);
  const [typeF, setTypeF] = useState([]);
  const [climateF, setClimateF] = useState([]);
  const [sort, setSort] = useState('Most upvoted');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    tripTypeTags: [],
    climateTags: [],
  });
  const [formErr, setFormErr] = useState('');

  const visible = tips
    .filter((t) => {
      const mt = typeF.length === 0 || t.tripTypeTags.some((x) => typeF.includes(x));
      const mc = climateF.length === 0 || t.climateTags.some((x) => climateF.includes(x));
      return mt && mc;
    })
    .sort((a, b) =>
      sort === 'Most upvoted'
        ? b.upvoteCount - a.upvoteCount
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const handleUpvote = (id) => {
    setUpvoted((p) => [...p, id]);
    setTips((p) => p.map((t) => (t._id === id ? { ...t, upvoteCount: t.upvoteCount + 1 } : t)));
  };
  const handleRemove = (id) => {
    setUpvoted((p) => p.filter((u) => u !== id));
    setTips((p) => p.map((t) => (t._id === id ? { ...t, upvoteCount: t.upvoteCount - 1 } : t)));
  };

  const toggleTag = (field, val) =>
    setForm((p) => ({
      ...p,
      [field]: p[field].includes(val) ? p[field].filter((v) => v !== val) : [...p[field], val],
    }));

  const submitTip = () => {
    if (!form.title.trim() || !form.description.trim()) {
      setFormErr('Title and description are required.');
      return;
    }
    if (form.tripTypeTags.length === 0) {
      setFormErr('Select at least one trip type.');
      return;
    }
    setTips((p) => [
      {
        _id: `tip_${Date.now()}`,
        title: form.title,
        description: form.description,
        authorId: user?._id || 'anon',
        authorName: user?.name || 'Anonymous',
        tripTypeTags: form.tripTypeTags,
        climateTags: form.climateTags,
        upvoteCount: 0,
        isVerified: false,
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      ...p,
    ]);
    setForm({ title: '', description: '', tripTypeTags: [], climateTags: [] });
    setFormErr('');
    setShowForm(false);
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.inner} container`}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Community Tips</h1>
            <p className={styles.sub}>Real advice from real travelers, ranked by usefulness.</p>
          </div>
          {isAuthenticated && user && (
            <button className={styles.shareBtn} onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ Share a tip'}
            </button>
          )}
        </div>

        {/* submit form */}
        {showForm && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Share your tip</h2>
            {formErr && <p className={styles.formErr}>{formErr}</p>}

            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="tipTitle">
                Title
              </label>
              <input
                id="tipTitle"
                className={styles.formInput}
                type="text"
                placeholder="e.g. Roll, don't fold"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="tipDesc">
                Description
              </label>
              <textarea
                id="tipDesc"
                className={styles.formTextarea}
                placeholder="Explain your tip in detail..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Trip types</label>
              <div className={styles.tagRow}>
                {tripTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.tagBtn} ${form.tripTypeTags.includes(t) ? styles.tagOn : ''}`}
                    onClick={() => toggleTag('tripTypeTags', t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>
                Climates <span className={styles.optional}>(optional)</span>
              </label>
              <div className={styles.tagRow}>
                {climates.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.tagBtn} ${form.climateTags.includes(c) ? styles.tagOn : ''}`}
                    onClick={() => toggleTag('climateTags', c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button className={styles.postBtn} onClick={submitTip}>
              Post tip →
            </button>
          </div>
        )}

        {/* filters + sort */}
        <div className={styles.controls}>
          <div className={styles.filterGroup}>
            <FilterBar label="Type" filters={typeFilters} active={typeF} onChange={setTypeF} />
            <FilterBar
              label="Climate"
              filters={climateFilters}
              active={climateF}
              onChange={setClimateF}
            />
          </div>
          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Sort</span>
            {SORTS.map((s) => (
              <button
                key={s}
                className={`${styles.sortBtn} ${sort === s ? styles.sortOn : ''}`}
                onClick={() => setSort(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className={styles.resultCount}>
          {visible.length} tip{visible.length !== 1 ? 's' : ''}
        </p>

        {visible.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No tips match your filters.</p>
            <p className={styles.emptySub}>Try clearing some filters or share the first one!</p>
          </div>
        ) : (
          <div className={styles.tipsBox}>
            {visible.map((tip) => (
              <TipCard
                key={tip._id}
                tip={tip}
                hasUpvoted={upvoted.includes(tip._id)}
                onUpvote={handleUpvote}
                onRemoveUpvote={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Community.propTypes = {
  user: PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string }),
  isAuthenticated: PropTypes.bool.isRequired,
};
Community.defaultProps = { user: null, isAuthenticated: false };

export default Community;
