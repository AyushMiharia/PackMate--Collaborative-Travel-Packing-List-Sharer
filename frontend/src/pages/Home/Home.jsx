import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { api } from '../../utils/api';
import { climateEmoji, typeEmoji } from '../../utils/constants';

const steps = [
  {
    num: '01',
    color: 'blue',
    title: 'Create a trip',
    desc: 'Enter destination, climate, trip type, and duration to open your packing space.',
  },
  {
    num: '02',
    color: 'amber',
    title: 'Build your list',
    desc: 'Browse a categorized catalog of items and add exactly what fits your trip.',
  },
  {
    num: '03',
    color: 'green',
    title: 'Learn from others',
    desc: "See top-voted tips from travelers who've taken the same kind of trip.",
  },
];

const personas = [
  {
    emoji: '💻',
    name: 'Sarah',
    role: 'CS student abroad',
    desc: 'Needs carry-on packing for cold-weather Europe.',
  },
  {
    emoji: '🏖️',
    name: 'Marcus',
    role: 'First-time traveler',
    desc: 'Wants a guided list for a solo beach trip.',
  },
  {
    emoji: '🏔️',
    name: 'Priya',
    role: 'Group trip organizer',
    desc: 'Needs gear checklists from experienced hikers.',
  },
  {
    emoji: '🎒',
    name: 'Alex',
    role: 'Budget backpacker',
    desc: 'Multi-country minimalist — every gram counts.',
  },
];

const statusColor = {
  planning: styles.badgePlanning,
  ongoing: styles.badgeOngoing,
  completed: styles.badgeCompleted,
};

const Home = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await api.getTrips({ limit: 6, page: 1 });
        setTrips(data.trips ?? []);
      } catch (err) {
        console.error('Failed to fetch trips:', err);
      }
    };
    fetchTrips();
  }, []);

  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`${styles.heroInner} container`}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>Free · Open source · Community-powered</span>
            <h1 className={styles.heroTitle}>
              The smarter way
              <br />
              to pack for <em>any</em> trip.
            </h1>
            <p className={styles.heroSub}>
              Build custom packing lists for any destination and discover what experienced travelers
              actually bring — curated and upvoted by the community.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/register" className={styles.ctaSolid}>
                Start packing free
              </Link>
              <Link to="/community" className={styles.ctaGhost}>
                Browse community trips →
              </Link>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardHeader}>
              <div className={styles.heroCardLeft}>
                <div className={styles.heroCardIcon}>❄️</div>
                <div>
                  <p className={styles.heroCardName}>Tokyo Winter Escape</p>
                  <p className={styles.heroCardMeta}>Tokyo, Japan · 10 days · cold</p>
                </div>
              </div>
              <span className={styles.heroBadge}>Planning</span>
            </div>
            <div className={styles.heroCardProgress}>
              <div className={styles.heroProgressHeader}>
                <span className={styles.heroProgressLabel}>Packing progress</span>
                <span className={styles.heroProgressPct}>40%</span>
              </div>
              <div className={styles.heroTrack}>
                <div className={styles.heroFill} />
              </div>
              <p className={styles.heroProgressSub}>2 of 5 items packed</p>
            </div>
            <div className={styles.heroItems}>
              {[
                { name: 'Thermal Underlayer', done: true },
                { name: 'Winter Coat', done: true },
                { name: 'Wool Socks', done: false },
                { name: 'Travel Adapter', done: false },
              ].map((it) => (
                <div
                  key={it.name}
                  className={`${styles.heroItem} ${it.done ? styles.heroItemDone : ''}`}
                >
                  <span className={`${styles.heroCheck} ${it.done ? styles.heroCheckOn : ''}`}>
                    {it.done && '✓'}
                  </span>
                  <span className={styles.heroItemName}>{it.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className={styles.statsBar}>
        <div className={`${styles.statsInner} container`}>
          {[
            { n: '2,500+', l: 'Trips created' },
            { n: '1,000+', l: 'Community tips' },
            { n: '98%', l: 'Said it saved time' },
            { n: '25+', l: 'Trip categories' },
          ].map((s) => (
            <div key={s.l} className={styles.stat}>
              <span className={styles.statN}>{s.n}</span>
              <span className={styles.statL}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <section className={styles.section}>
        <div className={`${styles.sectionInner} container`}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>How it works</h2>
            <p className={styles.sectionSub}>Three steps from blank slate to fully packed.</p>
          </div>
          <div className={styles.steps}>
            {steps.map((s) => (
              <div key={s.num} className={styles.step}>
                <span className={`${styles.stepNum} ${styles[`stepNum_${s.color}`]}`}>{s.num}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent community trips ── */}
      <section className={styles.tripsSection}>
        <div className={`${styles.tripsSectionInner} container`}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>Recent community trips</h2>
              <p className={styles.sectionSub}>See what other travellers are packing for.</p>
            </div>
            <Link to="/community" className={styles.seeAll}>
              Browse all →
            </Link>
          </div>

          {trips.length === 0 ? (
            <p className={styles.tripsEmpty}>No trips yet. Be the first to create one!</p>
          ) : (
            <div className={styles.tripsGrid}>
              {trips.map((trip) => (
                <Link key={trip._id} to={`/community/${trip._id}`} className={styles.tripCard}>
                  <div className={styles.tripCardTop}>
                    <span className={styles.tripCardIcon}>
                      {climateEmoji[trip.climate] || '✈️'}
                    </span>
                    <span className={`${styles.badge} ${statusColor[trip.status] || ''}`}>
                      {trip.status}
                    </span>
                  </div>
                  <h3 className={styles.tripCardName}>{trip.tripName}</h3>
                  <p className={styles.tripCardMeta}>
                    {trip.destination}
                    {trip.country ? `, ${trip.country}` : ''}
                  </p>
                  <div className={styles.tripCardTags}>
                    <span className={styles.tag}>
                      {typeEmoji[trip.tripType]} {trip.tripType}
                    </span>
                    <span className={styles.tag}>{trip.durationDays}d</span>
                    <span className={styles.tag}>{trip.luggageType}</span>
                  </div>
                  <div className={styles.tripCardFooter}>
                    <span className={styles.tripItemCount}>{trip.items.length} items</span>
                    <span className={styles.tripPacked}>
                      {trip.items.filter((i) => i.isChecked).length}/{trip.items.length} packed
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className={styles.section}>
        <div className={`${styles.sectionInner} container`}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Built for every traveler</h2>
          </div>
          <div className={styles.personas}>
            {personas.map((p) => (
              <div key={p.name} className={styles.personaCard}>
                <span className={styles.personaEmoji}>{p.emoji}</span>
                <div>
                  <p className={styles.personaName}>{p.name}</p>
                  <p className={styles.personaRole}>{p.role}</p>
                  <p className={styles.personaDesc}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={`${styles.ctaInner} container`}>
          <h2 className={styles.ctaTitle}>Ready to pack smarter?</h2>
          <p className={styles.ctaSub}>Free forever. No credit card required.</p>
          <Link to="/register" className={styles.ctaSolid}>
            Create your first trip →
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
