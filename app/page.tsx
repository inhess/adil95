'use client'
import { useState } from 'react'
import styles from './page.module.css'
import FormPage from './inscription/FormPage'
import AdminPage from './admin/AdminPage'

export default function Home() {
  const [view, setView] = useState<'home' | 'form' | 'admin'>('home')

  return (
    <div className={styles.root}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <img src="/logo.png" className={styles.logoImg} alt="ADIL 95" />
          <div className={styles.logoText}>
            ADIL 95
            <span className={styles.logoSub}>Agence Départementale d'Information sur le Logement</span>
          </div>
        </div>
        <nav className={styles.nav}>
          <button className={`${styles.navBtn} ${view === 'home' ? styles.navActive : ''}`} onClick={() => setView('home')}>Accueil</button>
          <button className={`${styles.navBtn} ${view === 'form' ? styles.navActive : ''}`} onClick={() => setView('form')}>Inscription</button>
          <button className={`${styles.navBtn} ${view === 'admin' ? styles.navActive : ''}`} onClick={() => setView('admin')}>Admin</button>
        </nav>
      </header>

      <main className={styles.main}>
        {view === 'home' && (
          <>
            {/* HERO avec fond et logo */}
            <div className={styles.hero}>
              <div className={styles.heroBg} />
              <div className={styles.heroOverlay} />
              <img src="/logo.png" className={styles.heroLogo} alt="ADIL 95" />
              <div className={styles.heroBadge}>✦ Inauguration officielle</div>
              <h1 className={styles.heroTitle}>Inauguration des nouveaux locaux de l'ADIL 95</h1>
              <p className={styles.heroSub}>
                Rejoignez-nous pour célébrer l'ouverture de nos nouveaux espaces dédiés à l'information sur le logement dans le Val-d'Oise.
              </p>
              <button className={styles.heroCta} onClick={() => setView('form')}>
                S'inscrire à l'événement →
              </button>
            </div>

            {/* INFO CARDS */}
            <section className={styles.infoSection}>
              <div className={styles.infoGrid}>
                {[
                  { ico: '📅', label: 'Date', value: 'Vendredi 26 juin 2026' },
                  { ico: '🕓', label: 'Horaire', value: 'À partir de 16h00' },
                  { ico: '📍', label: 'Lieu', value: 'La Croix Saint-Sylvère, Rue des châteaux Saint-Sylvère, Bât G, 95000 Cergy' },
                ].map(({ ico, label, value }) => (
                  <div key={label} className={styles.infoCard}>
                    <div className={styles.infoIcon}>{ico}</div>
                    <div>
                      <div className={styles.infoLabel}>{label}</div>
                      <div className={styles.infoValue}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.aboutBlock}>
                <div className={styles.aboutTitle}>À propos de l'ADIL 95</div>
                <p className={styles.aboutText}>
                  L'ADIL 95 offre des conseils juridiques, financiers et fiscaux gratuits et impartiaux à tous les habitants du Val-d'Oise.
                  Après des travaux d'aménagement, nous vous invitons à découvrir nos nouveaux locaux lors de cette journée d'inauguration conviviale et institutionnelle.
                </p>
              </div>
              <div className={styles.ctaCenter}>
                <button className={styles.heroCta} style={{ background: 'var(--bordeaux)', color: 'white' }} onClick={() => setView('form')}>
                  S'inscrire gratuitement →
                </button>
              </div>
            </section>
          </>
        )}

        {view === 'form' && <FormPage onBack={() => setView('home')} />}
        {view === 'admin' && <AdminPage />}
      </main>

      <footer className={styles.footer}>
        <strong>ADIL 95</strong> — Agence Départementale d'Information sur le Logement du Val-d'Oise<br />
        La Croix Saint-Sylvère, Rue des châteaux Saint-Sylvère, Bât G, 95000 Cergy
      </footer>
    </div>
  )
}
