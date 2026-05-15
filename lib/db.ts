import { sql } from '@vercel/postgres'

export async function createTable() {
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
}

export async function insertInscription(data: {
  nom: string
  prenom: string
  institution: string
  email: string
  telephone: string
  adresse: string
  ligne_directe?: string
}) {
  const result = await sql`
    INSERT INTO inscriptions (nom, prenom, institution, email, telephone, adresse, ligne_directe)
    VALUES (${data.nom}, ${data.prenom}, ${data.institution}, ${data.email}, ${data.telephone}, ${data.adresse}, ${data.ligne_directe || null})
    RETURNING *
  `
  return result.rows[0]
}

export async function getAllInscriptions() {
  const result = await sql`
    SELECT * FROM inscriptions ORDER BY created_at DESC
  `
  return result.rows
}

export async function getInscriptionCount() {
  const result = await sql`SELECT COUNT(*) as count FROM inscriptions`
  return parseInt(result.rows[0].count)
}
