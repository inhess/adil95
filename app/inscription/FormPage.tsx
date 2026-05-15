'use client'
import { useState } from 'react'
import styles from './form.module.css'

interface FormData {
  nom: string; prenom: string; institution: string
  email: string; telephone: string; adresse: string; ligne_directe: string
}

interface Props { onBack: () => void }

function validate(f: FormData) {
  const e: Partial<Record<keyof FormData, string>> = {}
  if (!f.nom.trim()) e.nom = 'Requis'
  if (!f.prenom.trim()) e.prenom = 'Requis'
  if (!f.institution.trim()) e.institution = 'Requis'
  if (!f.email.trim()) e.email = 'Requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Email invalide'
  if (!f.telephone.trim()) e.telephone = 'Requis'
  if (!f.adresse.trim()) e.adresse = 'Requis'
  return e
}

interface FieldProps {
  name: string
  label: string
  required?: boolean
  placeholder?: string
  type?: string
  value: string
  error?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Field({ name, label, required = true, placeholder = '', type = 'text', value, error, onChange }: FieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor={name}>
        {label}
        {required ? <span className={styles.req}> *</span> : <span className={styles.opt}>optionnel</span>}
      </label>
      <input
        id={name}
        type={type}
        className={`${styles.input} ${error ? styles.inputErr : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className={styles.errMsg}>⚠ {error}</span>}
    </div>
  )
}

export default function FormPage({ onBack }: Props) {
  const [form, setForm] = useState<FormData>({
    nom: '', prenom: '', institution: '',
    email: '', telephone: '', adresse: '', ligne_directe: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [name]: e.target.value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = async () => {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch('/api/inscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setServerError(data.error || 'Une erreur est survenue. Veuillez réessayer.')
        if (data.errors) setErrors(data.errors)
      }
    } catch {
      setServerError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <div className={styles.page}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Inscription confirmée !</h2>
        <p className={styles.successText}>
          Votre inscription à la journée d'inauguration a bien été enregistrée.<br />
          Nous vous attendons le <strong>26 juin 2026 à 16h00</strong> !
        </p>
        <div className={styles.successDetail}>
          {[
            ['Nom', `${form.prenom} ${form.nom}`],
            ['Institution', form.institution],
            ['Date', '26 juin 2026 — 16h00'],
            ['Lieu', 'Bât G, Rue des châteaux Saint-Sylvère, 95000 Cergy']
          ].map(([l, v]) => (
            <div key={l} className={styles.successRow}>
              <span className={styles.successLabel}>{l}</span><span>{v}</span>
            </div>
          ))}
        </div>
        <button className={styles.btn} onClick={onBack} style={{ marginTop: 20 }}>Retour à l'accueil</button>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <img src="/logo.png" className={styles.logo} alt="ADIL 95" />
        <h1 className={styles.title}>Formulaire d'inscription</h1>
        <p className={styles.subtitle}>Inauguration des nouveaux locaux — 26 juin 2026 à 16h00</p>
      </div>

      <div className={styles.card}>
        {serverError && <div className={styles.serverError}>⚠ {serverError}</div>}

        <div className={styles.sectionTitle}>Informations personnelles</div>
        <div className={styles.row}>
          <Field name="prenom" label="Prénom" placeholder="Marie"
            value={form.prenom} error={errors.prenom} onChange={handleChange('prenom')} />
          <Field name="nom" label="Nom" placeholder="Dupont"
            value={form.nom} error={errors.nom} onChange={handleChange('nom')} />
        </div>

        <div className={styles.sectionTitle}>Coordonnées professionnelles</div>
        <Field name="institution" label="Institution / Organisme" placeholder="Préfecture du Val-d'Oise"
          value={form.institution} error={errors.institution} onChange={handleChange('institution')} />
        <div className={styles.row}>
          <Field name="email" label="Email" type="email" placeholder="contact@institution.fr"
            value={form.email} error={errors.email} onChange={handleChange('email')} />
          <Field name="telephone" label="Téléphone" type="tel" placeholder="01 XX XX XX XX"
            value={form.telephone} error={errors.telephone} onChange={handleChange('telephone')} />
        </div>
        <Field name="ligne_directe" label="Ligne directe" required={false} type="tel"
          placeholder="01 XX XX XX XX"
          value={form.ligne_directe} error={errors.ligne_directe} onChange={handleChange('ligne_directe')} />

        <div className={styles.sectionTitle}>Adresse postale</div>
        <Field name="adresse" label="Adresse complète" placeholder="12 rue de la Paix, 95000 Cergy"
          value={form.adresse} error={errors.adresse} onChange={handleChange('adresse')} />

        <button className={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enregistrement en cours...' : 'Confirmer mon inscription →'}
        </button>
        <p className={styles.note}>* Champs obligatoires. Vos données sont utilisées uniquement pour l'organisation de l'événement.</p>
      </div>
    </div>
  )
}
