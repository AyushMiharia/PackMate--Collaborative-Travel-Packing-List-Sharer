// src/pages/TripDetail/TripDetail.js
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockPackingItems, mockTips, categories, climateEmoji } from '../../utils/mockData';
import PackingItem from '../../components/PackingItem/PackingItem';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import TipCard from '../../components/TipCard/TipCard';
import FilterBar from '../../components/FilterBar/FilterBar';
import styles from './TripDetail.module.css';
import { api } from '../../utils/api';
import CenteredSpinner from '../../components/centeredSpinner';

const catFilters = categories.map((c) => ({ value: c, label: c }));

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('list');
  const [catFilter, setCatFilter] = useState([]);
  const [customName, setCustomName] = useState('');
  const [upvoted, setUpvoted] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const data = await api.getTrip(id);
      setTrip(data);
      setEditName(data.tripName);
    } catch (err) {
      console.error('Failed to fetch trip:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const tripItemIds = trip?.items.map((i) => String(i.itemId)) ?? [];

  const catalogItems = mockPackingItems.filter(
    (item) => catFilter.length === 0 || catFilter.includes(item.category)
  );

  const relatedTips = mockTips.filter(
    (t) => t?.tripTypeTags?.includes(trip?.tripType) || t?.climateTags?.includes(trip?.climate)
  );

  const checked = trip?.items.filter((i) => i.isChecked).length ?? 0;

  // ── Helpers ────────────────────────────────────────────────────────────────

  // The backend uses array index for PATCH/DELETE on items,
  // so we always resolve the index from the current trip.items array.
  const getIndex = (itemId) => trip.items.findIndex((i) => String(i.itemId) === String(itemId));

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleCheck = async (itemId) => {
    const index = getIndex(itemId);
    if (index === -1) return;
    const newChecked = !trip.items[index].isChecked;

    setTrip((p) => ({
      ...p,
      items: p.items.map((item, i) => (i === index ? { ...item, isChecked: newChecked } : item)),
    }));

    try {
      await api.toggleTripItem(id, index, newChecked);
    } catch (err) {
      // Revert on failure
      setTrip((p) => ({
        ...p,
        items: p.items.map((item, i) => (i === index ? { ...item, isChecked: !newChecked } : item)),
      }));
    }
  };

  const addToTrip = async (item) => {
    if (tripItemIds.includes(String(item._id))) return;

    const newItem = { itemId: item._id, isChecked: false, isCustom: false, customName: null };
    setTrip((p) => ({ ...p, items: [...p.items, newItem] }));

    try {
      await api.addTripItem(id, { itemId: item._id, isCustom: false, customName: '' });
    } catch (err) {
      setTrip((p) => ({
        ...p,
        items: p.items.filter((i) => String(i.itemId) !== String(item._id)),
      }));
    }
  };

  const removeFromTrip = async (itemId) => {
    const index = getIndex(itemId);
    if (index === -1) return;
    const removedItem = trip.items[index];

    setTrip((p) => ({ ...p, items: p.items.filter((_, i) => i !== index) }));

    try {
      await api.removeTripItem(id, index);
    } catch (err) {
      // Revert — re-insert at original position
      setTrip((p) => {
        const items = [...p.items];
        items.splice(index, 0, removedItem);
        return { ...p, items };
      });
    }
  };

  const addCustom = async () => {
    if (!customName.trim()) return;
    const name = customName.trim();
    const tempId = `custom_${Date.now()}`;
    const newItem = { itemId: tempId, isChecked: false, isCustom: true, customName: name };

    setTrip((p) => ({ ...p, items: [...p.items, newItem] }));
    setCustomName('');

    try {
      await api.addTripItem(id, { itemId: null, isCustom: true, customName: name });
    } catch (err) {
      setTrip((p) => ({
        ...p,
        items: p.items.filter((i) => i.itemId !== tempId),
      }));
      setCustomName(name);
    }
  };

  const saveName = async () => {
    const name = editName.trim();
    if (!name) return;
    const prevName = trip.tripName;

    setTrip((p) => ({ ...p, tripName: name }));
    setEditing(false);

    try {
      await api.updateTrip(id, { tripName: name });
    } catch (err) {
      setTrip((p) => ({ ...p, tripName: prevName }));
      setEditName(prevName);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete trip:', err);
      alert('Could not delete trip. Please try again.');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) return <CenteredSpinner size="small" />;

  if (!trip) {
    return (
      <div className={styles.page}>
        <div className={`${styles.inner} container`}>
          <p>Trip not found.</p>
          <Link to="/dashboard">Back to My Trips</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.inner} container`}>
        {/* breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/dashboard" className={styles.bcLink}>
            My trips
          </Link>
          <span className={styles.bcSep}>›</span>
          <span className={styles.bcCurrent}>{trip.tripName}</span>
        </div>

        {/* header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>{climateEmoji[trip.climate] || '✈️'}</div>
            <div>
              {editing ? (
                <div className={styles.editRow}>
                  <input
                    className={styles.editInput}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveName();
                      if (e.key === 'Escape') setEditing(false);
                    }}
                    autoFocus
                  />
                  <button className={styles.saveBtn} onClick={saveName}>
                    Save
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className={styles.nameRow}>
                  <h1 className={styles.tripName}>{trip.tripName}</h1>
                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      setEditName(trip.tripName);
                      setEditing(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className={styles.deleteBtn} onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              )}
              <p className={styles.tripMeta}>
                {trip.destination}, {trip.country} · {trip.durationDays}d · {trip.tripType} ·{' '}
                {trip.climate} · {trip.luggageType}
              </p>
            </div>
          </div>
          <div className={styles.progressBox}>
            <ProgressBar checked={checked} total={trip.items.length} />
          </div>
        </div>

        {/* tabs */}
        <div className={styles.tabs}>
          {[
            { key: 'list', label: `My list (${trip.items.length})` },
            { key: 'catalog', label: 'Browse catalog' },
            { key: 'tips', label: `Tips (${relatedTips.length})` },
          ].map((t) => (
            <button
              key={t.key}
              className={`${styles.tab} ${tab === t.key ? styles.tabOn : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── My list ── */}
        {tab === 'list' && (
          <div className={styles.tabContent}>
            <div className={styles.customRow}>
              <input
                className={styles.customInput}
                type="text"
                placeholder="Add a custom item..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              />
              <button className={styles.customAddBtn} onClick={addCustom}>
                + Add
              </button>
            </div>

            {trip.items.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>Your list is empty.</p>
                <p className={styles.emptySub}>Browse the catalog tab to add items.</p>
                <button className={styles.emptyBtn} onClick={() => setTab('catalog')}>
                  Browse catalog →
                </button>
              </div>
            ) : (
              <div className={styles.groups}>
                {categories.map((cat) => {
                  const catItems = trip.items.filter((ti) => {
                    if (ti.isCustom) return cat === 'Activity Gear';
                    const m = mockPackingItems.find((m) => String(m._id) === String(ti.itemId));
                    return m && m.category === cat;
                  });
                  if (catItems.length === 0) return null;
                  return (
                    <div key={cat} className={styles.group}>
                      <h3 className={styles.groupTitle}>
                        {cat}
                        <span className={styles.groupCount}>{catItems.length}</span>
                      </h3>
                      <div className={styles.groupItems}>
                        {catItems.map((ti) => {
                          if (ti.isCustom) {
                            return (
                              <div
                                key={ti.itemId}
                                className={`${styles.customItem} ${ti.isChecked ? styles.customItemDone : ''}`}
                              >
                                <button
                                  className={`${styles.chk} ${ti.isChecked ? styles.chkOn : ''}`}
                                  onClick={() => toggleCheck(ti.itemId)}
                                >
                                  {ti.isChecked && '✓'}
                                </button>
                                <span className={styles.customItemName}>{ti.customName}</span>
                                <span className={styles.customBadge}>Custom</span>
                                <button
                                  className={styles.rmBtn}
                                  onClick={() => removeFromTrip(ti.itemId)}
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          }
                          const master = mockPackingItems.find(
                            (m) => String(m._id) === String(ti.itemId)
                          );
                          if (!master) return null;
                          return (
                            <PackingItem
                              key={ti.itemId}
                              item={master}
                              isChecked={ti.isChecked}
                              isInTrip
                              onToggleCheck={toggleCheck}
                              onRemoveFromTrip={removeFromTrip}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Catalog ── */}
        {tab === 'catalog' && (
          <div className={styles.tabContent}>
            <FilterBar
              label="Category"
              filters={catFilters}
              active={catFilter}
              onChange={setCatFilter}
            />
            <div className={styles.catalogGrid}>
              {catalogItems.map((item) => (
                <PackingItem
                  key={item._id}
                  item={item}
                  isInTrip={tripItemIds.includes(String(item._id))}
                  onAddToTrip={addToTrip}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Tips ── */}
        {tab === 'tips' && (
          <div className={styles.tabContent}>
            <p className={styles.tipsIntro}>
              Top community tips for <strong>{trip.tripType}</strong> trips in a{' '}
              <strong>{trip.climate}</strong> climate.
            </p>
            <div className={styles.tipsBox}>
              {relatedTips.length === 0 ? (
                <p className={styles.emptySub}>No tips yet for this trip type.</p>
              ) : (
                relatedTips.map((tip) => (
                  <TipCard
                    key={tip._id}
                    tip={tip}
                    hasUpvoted={upvoted.includes(tip._id)}
                    onUpvote={(id) => setUpvoted((p) => [...p, id])}
                    onRemoveUpvote={(id) => setUpvoted((p) => p.filter((u) => u !== id))}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetail;
