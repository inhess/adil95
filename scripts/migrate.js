// scripts/migrate.js
// Exécuter: node scripts/migrate.js
// (après avoir défini les variables d'environnement Vercel Postgres)

require('dotenv').config({ path: '.env.local' })
const { sql } = require('@vercel/postgres')

async function migrate() {
  console.log('🔄 Création de la table inscriptions...')
  try {
    await sql`
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
    `
    console.log('✅ Table créée avec succès !')
  } catch (err) {
    console.error('❌ Erreur:', err)
    process.exit(1)
  }
}

migrate()
