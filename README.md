# 🏠 ADIL 95 — Site d'inscription Inauguration 26 juin 2026

## 🚀 Déploiement sur Vercel (étape par étape)

### Étape 1 — Préparer le dépôt GitHub

1. Créez un nouveau dépôt GitHub (ex: `adil95-inscription`)
2. Ouvrez un terminal dans ce dossier et exécutez :
```bash
git init
git add .
git commit -m "Initial commit — ADIL 95 inscription site"
git remote add origin https://github.com/VOTRE_USERNAME/adil95-inscription.git
git push -u origin main
```

### Étape 2 — Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com) → **Add New Project**
2. Importez votre dépôt GitHub `adil95-inscription`
3. Framework : **Next.js** (auto-détecté)
4. Cliquez **Deploy** ✅

### Étape 3 — Créer la base de données Vercel Postgres

1. Dans votre projet Vercel → onglet **Storage**
2. Cliquez **Create Database** → choisissez **Postgres**
3. Nommez-la `adil95-db` → **Create**
4. Cliquez **Connect to Project** → toutes les variables sont ajoutées automatiquement ✅

### Étape 4 — Configurer les variables d'environnement

Dans Vercel → **Settings** → **Environment Variables**, ajoutez :

| Variable | Valeur |
|----------|--------|
| `ADMIN_PASSWORD` | `adil95admin` (ou votre mot de passe) |
| `NOTIF_EMAIL` | `votre@email.fr` (email qui reçoit les notifications) |

**Pour les notifications email (optionnel) :**

Option A — Resend (recommandé, gratuit) :
1. Créez un compte sur [resend.com](https://resend.com)
2. Ajoutez la variable `RESEND_API_KEY` avec votre clé

Option B — Gmail :
| Variable | Valeur |
|----------|--------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `votre@gmail.com` |
| `SMTP_PASS` | votre mot de passe d'application Gmail |

### Étape 5 — Créer la table en base de données

La table est créée automatiquement à la première inscription. Vous pouvez aussi l'initialiser manuellement :

Dans Vercel → **Storage** → votre DB → **Query** :
```sql
CREATE TABLE IF NOT EXISTS inscriptions (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  institution VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  telephone VARCHAR(30) NOT NULL,
  adresse TEXT NOT NULL,
  ligne_directe VARCHAR(30),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Étape 6 — Redéployer

Après avoir ajouté les variables → **Redeploy** dans Vercel ✅

---

## 🔐 Accès admin

URL : `https://votre-site.vercel.app` → onglet **Admin**  
Mot de passe : défini dans la variable `ADMIN_PASSWORD`

## 📁 Structure du projet

```
adil95/
├── app/
│   ├── api/
│   │   ├── inscriptions/route.ts   # POST (inscription) + GET (liste admin)
│   │   └── admin/route.ts          # Authentification admin
│   ├── admin/AdminPage.tsx         # Panel administration
│   ├── inscription/FormPage.tsx    # Formulaire d'inscription
│   ├── layout.tsx
│   ├── page.tsx                    # Page principale
│   └── globals.css
├── lib/
│   ├── db.ts                       # Connexion Vercel Postgres
│   └── email.ts                    # Notifications email
├── public/
│   ├── logo.png                    # Logo ADIL 95
│   └── fond3.jpg                   # Image de fond
└── scripts/
    └── migrate.js                  # Script de migration DB
```
# adil95
# adil95
# adil95
