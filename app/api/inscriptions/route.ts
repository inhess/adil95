import { NextRequest, NextResponse } from 'next/server'
import { insertInscription, getAllInscriptions, createTable } from '@/lib/db'
import { sendNotificationEmail } from '@/lib/email'

function validate(data: Record<string, string>) {
  const errors: Record<string, string> = {}
  if (!data.nom?.trim()) errors.nom = 'Le nom est requis'
  if (!data.prenom?.trim()) errors.prenom = 'Le prénom est requis'
  if (!data.institution?.trim()) errors.institution = "L'institution est requise"
  if (!data.email?.trim()) errors.email = "L'email est requis"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Email invalide'
  if (!data.telephone?.trim()) errors.telephone = 'Le téléphone est requis'
  if (!data.adresse?.trim()) errors.adresse = "L'adresse est requise"
  return errors
}

// POST /api/inscriptions — créer une inscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const errors = validate(body)
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    await createTable() // crée la table si elle n'existe pas encore
    const inscription = await insertInscription({
      nom: body.nom.trim(),
      prenom: body.prenom.trim(),
      institution: body.institution.trim(),
      email: body.email.trim().toLowerCase(),
      telephone: body.telephone.trim(),
      adresse: body.adresse.trim(),
      ligne_directe: body.ligne_directe?.trim() || undefined,
    })

    // Notification email en arrière-plan (ne bloque pas la réponse)
  await sendNotificationEmail({
  nom: inscription.nom,
  prenom: inscription.prenom,
  institution: inscription.institution,
  email: inscription.email,
  telephone: inscription.telephone,
  adresse: inscription.adresse,
  ligne_directe: inscription.ligne_directe,
})

    return NextResponse.json({ success: true, inscription }, { status: 201 })
  } catch (err) {
    console.error('Erreur inscription:', err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

// GET /api/inscriptions — liste (admin uniquement)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('x-admin-password')
  if (authHeader !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    await createTable()
    const inscriptions = await getAllInscriptions()
    return NextResponse.json({ success: true, inscriptions })
  } catch (err) {
    console.error('Erreur récupération:', err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
