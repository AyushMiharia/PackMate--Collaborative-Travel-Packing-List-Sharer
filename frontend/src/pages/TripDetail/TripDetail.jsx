import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { categories, climateEmoji, tripTypes, climates } from '../../utils/constants';
import PackingItem from '../../components/PackingItem/PackingItem';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import TipCard from '../../components/TipCard/TipCard';
import FilterBar from '../../components/FilterBar/FilterBar';
import styles from './TripDetail.module.css';
import { api } from '../../utils/api';
import CenteredSpinner from '../../components/centeredSpinner';
import PropTypes from 'prop-types';

const catFilters = categories.map((c) => ({ value: c, label: c }));
const statusOptions = ['planning', 'ongoing', 'completed'];

const TripDetail = ({ userEmail }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [catalogItems, setCatalogItems] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('list');
  const [catFilter, setCatFilter] = useState([]);
  const [customName, setCustomName] = useState('');
  const [upvoted, setUpvoted] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [showTipForm, setShowTipForm] = useState(false);
  const [tipForm, setTipForm] = useState({
    title: '',
    description: '',
    tripTypeTags: [],
    climateTags: [],
  });
  const [submittingTip, setSubmittingTip] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const tripData = await api.getTrip(id);
        setTrip(tripData);
        setEditName(tripData.tripName);
        const [itemsData, tipsData] = await Promise.all([
          api.getItems(),
          api.getTips({ tripType: tripData.tripType, climate: tripData.climate }),
        ]);
        setCatalogItems(itemsData);
        setTips(tipsData);
        setUpvoted(tipsData.filter((t) => t.upvotedBy?.includes(userEmail)).map((t) => t._id));
      } catch (err) {
        console.error('Failed to load trip data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const tripItemIds = trip?.items.map((i) => String(i.itemId)) ?? [];
  const filteredCatalog = catalogItems.filter(
    (item) => catFilter.length === 0 || catFilter.includes(item.category)
  );
  const checked = trip?.items.filter((i) => i.isChecked).length ?? 0;
  const getIndex = (itemId) => trip.items.findIndex((i) => String(i.itemId) === String(itemId));

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
      console.log('Failed to toggle item check:', err);
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
      console.error('Failed to add item to trip:', err);
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
      console.error('Failed to remove item from trip:', err);
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
      console.error('Failed to add custom item:', err);
      setTrip((p) => ({ ...p, items: p.items.filter((i) => i.itemId !== tempId) }));
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
      console.error('Failed to update trip name:', err);
      setTrip((p) => ({ ...p, tripName: prevName }));
      setEditName(prevName);
    }
  };

  const changeStatus = async (newStatus) => {
    const prevStatus = trip.status;
    setTrip((p) => ({ ...p, status: newStatus }));
    try {
      await api.updateTrip(id, { status: newStatus });
    } catch (err) {
      console.error('Failed to update trip status:', err);
      setTrip((p) => ({ ...p, status: prevStatus }));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await api.deleteTrip(id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete trip:', err);
    }
  };

  const handleUpvote = async (tipId) => {
    setUpvoted((p) => [...p, tipId]);
    setTips((p) => p.map((t) => (t._id === tipId ? { ...t, upvoteCount: t.upvoteCount + 1 } : t)));
    try {
      await api.upvoteTip(tipId, userEmail);
    } catch (err) {
      console.error('Failed to upvote:', err);
      setUpvoted((p) => p.filter((u) => u !== tipId));
      setTips((p) =>
        p.map((t) => (t._id === tipId ? { ...t, upvoteCount: t.upvoteCount - 1 } : t))
      );
    }
  };

  const handleRemoveUpvote = async (tipId) => {
    setUpvoted((p) => p.filter((u) => u !== tipId));
    setTips((p) => p.map((t) => (t._id === tipId ? { ...t, upvoteCount: t.upvoteCount - 1 } : t)));
    try {
      await api.removeUpvote(tipId, userEmail);
    } catch (err) {
      console.error('Failed to remove upvote:', err);
      setUpvoted((p) => [...p, tipId]);
      setTips((p) =>
        p.map((t) => (t._id === tipId ? { ...t, upvoteCount: t.upvoteCount + 1 } : t))
      );
    }
  };

  const openTipForm = () => {
    setTipForm({
      title: '',
      description: '',
      tripTypeTags: [trip.tripType],
      climateTags: [trip.climate],
    });
    setShowTipForm(true);
  };

  const toggleTag = (field, value) =>
    setTipForm((p) => ({
      ...p,
      [field]: p[field].includes(value)
        ? p[field].filter((t) => t !== value)
        : [...p[field], value],
    }));

  const submitTip = async () => {
    if (!tipForm.title.trim() || !tipForm.description.trim()) return;
    setSubmittingTip(true);
    try {
      await api.createTip({ ...tipForm, email: userEmail });
      const tipsData = await api.getTips({ tripType: trip.tripType, climate: trip.climate });
      setTips(tipsData);
      setUpvoted(tipsData.filter((t) => t.upvotedBy?.includes(userEmail)).map((t) => t._id));
      setShowTipForm(false);
    } catch (err) {
      console.error('Failed to submit tip:', err);
    } finally {
      setSubmittingTip(false);
    }
  };

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
        <div className={styles.breadcrumb}>
          <Link to="/dashboard" className={styles.bcLink}>
            My trips
          </Link>
          <span className={styles.bcSep}>›</span>
          <span className={styles.bcCurrent}>{trip.tripName}</span>
        </div>

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
              <div className={styles.statusRow}>
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    className={`${styles.statusBtn} ${trip.status === s ? styles.statusBtnOn : ''} ${styles[`status_${s}`]}`}
                    onClick={() => changeStatus(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.progressBox}>
            <ProgressBar checked={checked} total={trip.items.length} />
          </div>
        </div>

        <div className={styles.tabs}>
          {[
            { key: 'list', label: `My list (${trip.items.length})` },
            { key: 'catalog', label: 'Browse catalog' },
            { key: 'tips', label: `Tips (${tips.length})` },
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
                {[...categories, 'Custom'].map((cat) => {
                  const catItems = trip.items.filter((ti) => {
                    if (ti.isCustom) return cat === 'Custom';
                    const master = catalogItems.find((m) => String(m._id) === String(ti.itemId));
                    return master?.category === cat;
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
                          const master = catalogItems.find(
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

        {tab === 'catalog' && (
          <div className={styles.tabContent}>
            <FilterBar
              label="Category"
              filters={catFilters}
              active={catFilter}
              onChange={setCatFilter}
            />
            <div className={styles.catalogGrid}>
              {filteredCatalog.map((item) => {
                const tripItem = trip.items.find((ti) => String(ti.itemId) === String(item._id));
                return (
                  <PackingItem
                    key={item._id}
                    item={item}
                    isInTrip={!!tripItem}
                    isChecked={tripItem?.isChecked ?? false}
                    onAddToTrip={addToTrip}
                    onToggleCheck={toggleCheck}
                    onRemoveFromTrip={removeFromTrip}
                  />
                );
              })}
            </div>
          </div>
        )}

        {tab === 'tips' && (
          <div className={styles.tabContent}>
            <div className={styles.tipsHeader}>
              <p className={styles.tipsIntro}>
                Top community tips for <strong>{trip.tripType}</strong> trips in a{' '}
                <strong>{trip.climate}</strong> climate.
              </p>
              {trip.status === 'completed' ? (
                <button className={styles.addTipBtn} onClick={openTipForm}>
                  + Add a tip
                </button>
              ) : (
                <span className={styles.tipLocked}>Complete your trip to add a tip</span>
              )}
            </div>

            {showTipForm && trip.status === 'completed' && (
              <div className={styles.tipForm}>
                <input
                  className={styles.tipInput}
                  placeholder="Title"
                  value={tipForm.title}
                  onChange={(e) => setTipForm((p) => ({ ...p, title: e.target.value }))}
                />
                <textarea
                  className={styles.tipTextarea}
                  placeholder="Describe your tip..."
                  rows={3}
                  value={tipForm.description}
                  onChange={(e) => setTipForm((p) => ({ ...p, description: e.target.value }))}
                />
                <div className={styles.tipTagSection}>
                  <p className={styles.tipTagLabel}>Trip types</p>
                  <div className={styles.tipTags}>
                    {tripTypes.map((t) => (
                      <button
                        key={t}
                        className={`${styles.tipTag} ${tipForm.tripTypeTags.includes(t) ? styles.tipTagOn : ''}`}
                        onClick={() => toggleTag('tripTypeTags', t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.tipTagSection}>
                  <p className={styles.tipTagLabel}>Climates</p>
                  <div className={styles.tipTags}>
                    {climates.map((c) => (
                      <button
                        key={c}
                        className={`${styles.tipTag} ${tipForm.climateTags.includes(c) ? styles.tipTagOn : ''}`}
                        onClick={() => toggleTag('climateTags', c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.tipFormActions}>
                  <button
                    className={styles.tipSubmitBtn}
                    onClick={submitTip}
                    disabled={submittingTip || !tipForm.title.trim() || !tipForm.description.trim()}
                  >
                    {submittingTip ? 'Submitting...' : 'Submit tip'}
                  </button>
                  <button className={styles.tipCancelBtn} onClick={() => setShowTipForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className={styles.tipsBox}>
              {tips.length === 0 ? (
                <p className={styles.emptySub}>No tips yet for this trip type.</p>
              ) : (
                [...tips]
                  .sort((a, b) => (b.email === trip.email) - (a.email === trip.email))
                  .map((tip) => (
                    <TipCard
                      key={tip._id}
                      tip={tip}
                      isOwner={tip.email === trip.email}
                      hasUpvoted={upvoted.includes(tip._id)}
                      onUpvote={handleUpvote}
                      onRemoveUpvote={handleRemoveUpvote}
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

TripDetail.propTypes = {
  useEmail: PropTypes.string.isRequired,
};

export default TripDetail;
