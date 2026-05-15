'use client'
import { useState, useEffect } from 'react'
import styles from './admin.module.css'

interface Inscription {
  id: number; nom: string; prenom: string; institution: string
  email: string; telephone: string; adresse: string
  ligne_directe: string | null; created_at: string
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [inscriptions, setInscriptions] = useState<Inscription[]>([])
  const [fetchError, setFetchError] = useState('')
  const [notifEmail, setNotifEmail] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        setLoggedIn(true)
        fetchInscriptions(password)
      } else {
        setLoginError('Mot de passe incorrect.')
      }
    } catch {
      setLoginError('Erreur réseau.')
    } finally {
      setLoading(false)
    }
  }

  const fetchInscriptions = async (pw: string) => {
    try {
      const res = await fetch('/api/inscriptions', {
        headers: { 'x-admin-password': pw },
      })
      const data = await res.json()
      if (data.success) setInscriptions(data.inscriptions)
      else setFetchError('Impossible de charger les inscriptions.')
    } catch {
      setFetchError('Erreur réseau.')
    }
  }

  const exportCSV = () => {
    const headers = ['ID', 'Nom', 'Prénom', 'Institution', 'Email', 'Téléphone', 'Ligne directe', 'Adresse', "Date d'inscription"]
    const rows = inscriptions.map(r => [
      r.id, r.nom, r.prenom, r.institution, r.email,
      r.telephone, r.ligne_directe || '', r.adresse,
      new Date(r.created_at).toLocaleString('fr-FR'),
    ])
    const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inscriptions_adil95_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const institutions = new Set(inscriptions.map(r => r.institution)).size

  if (!loggedIn) return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <img src="/logo.png" className={styles.loginLogo} alt="ADIL 95" />
        <h2 className={styles.loginTitle}>Accès Administration</h2>
        <p className={styles.loginSub}>Réservé au responsable de l'ADIL 95</p>
        {loginError && <div className={styles.loginError}>{loginError}</div>}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Mot de passe</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={e => { setPassword(e.target.value); setLoginError('') }}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <button className={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Connexion...' : 'Accéder au panel →'}
        </button>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      {/* En-tête admin */}
      <div className={styles.adminHeader}>
        <div className={styles.adminHeaderLeft}>
          <img src="/logo.png" style={{ width: 44, height: 44, borderRadius: '50%' }} alt="ADIL" />
          <div>
            <div className={styles.adminTitle}>Panel d'administration</div>
            <div className={styles.adminSub}>Inauguration ADIL 95 — 26 juin 2026</div>
          </div>
        </div>
        <div className={styles.adminActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={exportCSV}>⬇ Exporter CSV</button>
          <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => { setLoggedIn(false); setPassword(''); setInscriptions([]); }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Notification email config */}
      <div className={styles.notifCard}>
        <div className={styles.notifTitle}>📧 Email de notification</div>
        <p className={styles.notifDesc}>L'adresse ci-dessous recevra un email à chaque nouvelle inscription. Configurer via la variable <code>NOTIF_EMAIL</code> dans Vercel.</p>
        <div className={styles.notifRow}>
          <input className={styles.notifInput} type="email" value={notifEmail} onChange={e => setNotifEmail(e.target.value)} placeholder="responsable@adil95.fr" />
          <span className={styles.notifHint}>Définie dans les variables d'environnement Vercel</span>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}><div className={styles.statLabel}>Inscrits total</div><div className={styles.statValue}>{inscriptions.length}</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Institutions</div><div className={styles.statValue}>{institutions}</div></div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Dernière inscription</div>
          <div className={styles.statValueSmall}>{inscriptions.length > 0 ? new Date(inscriptions[0].created_at).toLocaleDateString('fr-FR') : '—'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Jours restants</div>
          <div className={styles.statValue}>{Math.max(0, Math.ceil((new Date('2026-06-26').getTime() - Date.now()) / 86400000))}</div>
        </div>
      </div>

      {/* Table */}
      {fetchError && <div className={styles.serverError}>{fetchError}</div>}
      {inscriptions.length === 0 && !fetchError ? (
        <div className={styles.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700, color: '#666' }}>Aucune inscription pour le moment</div>
          <div style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>Les inscriptions apparaîtront ici dès qu'elles seront soumises.</div>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th><th>Nom complet</th><th>Institution</th>
                <th>Email</th><th>Téléphone</th><th>Adresse</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {inscriptions.map((r, i) => (
                <tr key={r.id}>
                  <td className={styles.tdNum}>{i + 1}</td>
                  <td className={styles.tdName}>{r.prenom} {r.nom}</td>
                  <td><span className={styles.badge}>{r.institution}</span></td>
                  <td className={styles.tdEmail}>{r.email}</td>
                  <td className={styles.tdSmall}>{r.telephone}</td>
                  <td className={styles.tdSmall}>{r.adresse}</td>
                  <td className={styles.tdDate}>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
