import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { climates, tripTypes, luggageTypes, climateEmoji, typeEmoji } from '../../utils/constants';
import styles from './Trips.module.css';
import { api } from '../../utils/api';
import CenteredSpinner from '../../components/centeredSpinner';

const STATUSES = ['planning', 'ongoing', 'completed'];
const PAGE_SIZE = 12;

const statusColor = {
  planning: styles.badgePlanning,
  ongoing: styles.badgeOngoing,
  completed: styles.badgeCompleted,
};

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [climate, setClimate] = useState('');
  const [tripType, setTripType] = useState('');
  const [luggageType, setLuggageType] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: PAGE_SIZE };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status;
      if (climate) params.climate = climate;
      if (tripType) params.tripType = tripType;
      if (luggageType) params.luggageType = luggageType;

      const data = await api.getTrips(params);
      setTrips(data.trips);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch community trips:', err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, climate, tripType, luggageType]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setClimate('');
    setTripType('');
    setLuggageType('');
    setPage(1);
  };

  const hasFilters = search || status || climate || tripType || luggageType;

  const handleFilterChange = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.inner} container`}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Community Trips</h1>
            <p className={styles.sub}>Browse trips created by travellers around the world</p>
          </div>
          <span className={styles.totalBadge}>{total} trips</span>
        </div>

        <div className={styles.toolbar}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search by trip name or destination..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <div className={styles.filters}>
            <select
              className={styles.select}
              value={status}
              onChange={(e) => handleFilterChange(setStatus)(e.target.value)}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={climate}
              onChange={(e) => handleFilterChange(setClimate)(e.target.value)}
            >
              <option value="">All climates</option>
              {climates.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={tripType}
              onChange={(e) => handleFilterChange(setTripType)(e.target.value)}
            >
              <option value="">All trip types</option>
              {tripTypes.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={luggageType}
              onChange={(e) => handleFilterChange(setLuggageType)(e.target.value)}
            >
              <option value="">All luggage</option>
              {luggageTypes.map((l) => (
                <option key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button className={styles.clearBtn} onClick={resetFilters}>
                Clear filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <CenteredSpinner size="small" />
        ) : trips.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No trips found.</p>
            <p className={styles.emptySub}>Try adjusting your filters or search term.</p>
            {hasFilters && (
              <button className={styles.clearBtn} onClick={resetFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {trips.map((trip) => (
                <Link key={trip._id} to={`/trips/${trip._id}`} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardIcon}>{climateEmoji[trip.climate] || '✈️'}</span>
                    <span className={`${styles.badge} ${statusColor[trip.status]}`}>
                      {trip.status}
                    </span>
                  </div>
                  <h3 className={styles.cardName}>{trip.tripName}</h3>
                  <p className={styles.cardMeta}>
                    {trip.destination}
                    {trip.country ? `, ${trip.country}` : ''}
                  </p>
                  <div className={styles.cardTags}>
                    <span className={styles.tag}>
                      {typeEmoji[trip.tripType]} {trip.tripType}
                    </span>
                    <span className={styles.tag}>{trip.durationDays}d</span>
                    <span className={styles.tag}>{trip.luggageType}</span>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.itemCount}>{trip.items.length} items</span>
                    <span className={styles.packed}>
                      {trip.items.filter((i) => i.isChecked).length}/{trip.items.length} packed
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Prev
                </button>
                <div className={styles.pageNums}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`ellipsis-${i}`} className={styles.ellipsis}>
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          className={`${styles.pageNum} ${page === p ? styles.pageNumOn : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Trips;
