import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { categories, climateEmoji, climates, tripTypes } from '../../utils/constants';
import TipCard from '../../components/TipCard/TipCard';
import styles from './CommnunityTripDetails.module.css';
import { api } from '../../utils/api';
import CenteredSpinner from '../../components/centeredSpinner';

const CommunityTripDetail = ({ userEmail, isAuthenticated }) => {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [catalogItems, setCatalogItems] = useState([]);
  const [tips, setTips] = useState([]);
  const [myTrips, setMyTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('list');
  const [upvoted, setUpvoted] = useState([]);

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

        const [itemsData, tipsData] = await Promise.all([
          api.getItems(),
          api.getTips({ tripType: tripData.tripType, climate: tripData.climate }),
        ]);
        setCatalogItems(itemsData);

        const tipsArr = Array.isArray(tipsData) ? tipsData : (tipsData.tips ?? []);
        setTips(tipsArr);

        if (userEmail) {
          setUpvoted(tipsArr.filter((t) => t.upvotedBy?.includes(userEmail)).map((t) => t._id));
        }

        if (isAuthenticated) {
          const myTripsData = await api.getMyTrips();
          setMyTrips(myTripsData);
        }
      } catch (err) {
        console.error('Failed to load community trip:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, userEmail, isAuthenticated]);

  const isEligible =
    isAuthenticated &&
    myTrips.some(
      (t) =>
        t.status === 'completed' && (t.tripType === trip?.tripType || t.climate === trip?.climate)
    );

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
      const tipsArr = Array.isArray(tipsData) ? tipsData : (tipsData.tips ?? []);
      setTips(tipsArr);
      setUpvoted(tipsArr.filter((t) => t.upvotedBy?.includes(userEmail)).map((t) => t._id));
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
          <Link to="/community">Back to Community</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.inner} container`}>
        <div className={styles.breadcrumb}>
          <Link to="/community" className={styles.bcLink}>
            Community
          </Link>
          <span className={styles.bcSep}>›</span>
          <span className={styles.bcCurrent}>{trip.tripName}</span>
        </div>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>{climateEmoji[trip.climate] || '✈️'}</div>
            <div>
              <h1 className={styles.tripName}>{trip.tripName}</h1>
              <p className={styles.tripMeta}>
                {trip.destination}
                {trip.country ? `, ${trip.country}` : ''} · {trip.durationDays}d · {trip.tripType} ·{' '}
                {trip.climate} · {trip.luggageType}
              </p>
              <span className={`${styles.statusBadge} ${styles[`status_${trip.status}`]}`}>
                {trip.status}
              </span>
            </div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.stat}>
              <span className={styles.statN}>{trip.items.length}</span>
              <span className={styles.statL}>Items</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statN}>{trip.items.filter((i) => i.isChecked).length}</span>
              <span className={styles.statL}>Packed</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statN}>{tips.length}</span>
              <span className={styles.statL}>Tips</span>
            </div>
          </div>
        </div>

        <div className={styles.tabs}>
          {[
            { key: 'list', label: `Packing list (${trip.items.length})` },
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
            {trip.items.length === 0 ? (
              <p className={styles.emptySub}>No items in this trip's packing list.</p>
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
                        {cat} <span className={styles.groupCount}>{catItems.length}</span>
                      </h3>
                      <div className={styles.groupItems}>
                        {catItems.map((ti) => {
                          const name = ti.isCustom
                            ? ti.customName
                            : catalogItems.find((m) => String(m._id) === String(ti.itemId))?.name;
                          if (!name) return null;
                          return (
                            <div
                              key={ti.itemId}
                              className={`${styles.itemRow} ${ti.isChecked ? styles.itemChecked : ''}`}
                            >
                              <span
                                className={`${styles.itemDot} ${ti.isChecked ? styles.itemDotOn : ''}`}
                              />
                              <span className={styles.itemName}>{name}</span>
                              {ti.isCustom && <span className={styles.customBadge}>Custom</span>}
                              {ti.isChecked && <span className={styles.packedBadge}>Packed</span>}
                            </div>
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

        {tab === 'tips' && (
          <div className={styles.tabContent}>
            <div className={styles.tipsHeader}>
              <p className={styles.tipsIntro}>
                Community tips for <strong>{trip.tripType}</strong> trips in a{' '}
                <strong>{trip.climate}</strong> climate.
              </p>
              {isAuthenticated ? (
                isEligible ? (
                  <button className={styles.addTipBtn} onClick={openTipForm}>
                    + Add a tip
                  </button>
                ) : (
                  <span className={styles.tipLocked}>Complete a similar trip to add a tip</span>
                )
              ) : (
                <Link to="/login" className={styles.tipLocked}>
                  Sign in to add a tip
                </Link>
              )}
            </div>

            {showTipForm && isEligible && (
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
                <p className={styles.emptySub}>No tips yet for this trip type and climate.</p>
              ) : (
                tips.map((tip) => (
                  <TipCard
                    key={tip._id}
                    tip={tip}
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

CommunityTripDetail.propTypes = {
  userEmail: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
};

CommunityTripDetail.defaultProps = {
  userEmail: null,
};

export default CommunityTripDetail;
