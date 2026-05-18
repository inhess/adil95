export async function await sendNotificationEmail(inscription: {
  nom: string
  prenom: string
  institution: string
  email: string
  telephone: string
  adresse: string
  ligne_directe?: string
}) {
  const notifEmail = process.env.NOTIF_EMAIL
  const MJ_KEY = process.env.MAILJET_API_KEY
  const MJ_SECRET = process.env.MAILJET_SECRET_KEY
  const fromEmail = process.env.FROM_EMAIL

  // Logs de debug
  console.log('=== EMAIL DEBUG ===')
  console.log('NOTIF_EMAIL:', notifEmail || 'MANQUANT')
  console.log('FROM_EMAIL:', fromEmail || 'MANQUANT')
  console.log('MAILJET_API_KEY présente:', !!MJ_KEY)
  console.log('MAILJET_SECRET_KEY présente:', !!MJ_SECRET)
  console.log('Email destinataire:', inscription.email)

  if (!notifEmail) { console.error('❌ NOTIF_EMAIL manquant'); return }
  if (!MJ_KEY || !MJ_SECRET) { console.error('❌ Clés Mailjet manquantes'); return }

  const credentials = Buffer.from(`${MJ_KEY}:${MJ_SECRET}`).toString('base64')

  try {
    const mjRes = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: fromEmail || notifEmail, Name: 'ADIL 95' },
            To: [{ Email: inscription.email, Name: `${inscription.prenom} ${inscription.nom}` }],
            Subject: 'Confirmation de votre inscription - Inauguration ADIL 95',
            HTMLPart: buildConfirmationHtml(inscription),
          },
          {
            From: { Email: fromEmail || notifEmail, Name: 'ADIL 95' },
            To: [{ Email: notifEmail, Name: 'Admin ADIL 95' }],
            Subject: `Nouvelle inscription - ${inscription.prenom} ${inscription.nom} (${inscription.institution})`,
            HTMLPart: buildNotifHtml(inscription),
          },
        ],
      }),
    })

    const mjData = await mjRes.json()
    console.log('Mailjet status:', mjRes.status)
    console.log('Mailjet réponse:', JSON.stringify(mjData))

    if (!mjRes.ok) {
      console.error('❌ Mailjet erreur:', mjData)
    } else {
      console.log('✅ Emails envoyés avec succès')
    }
  } catch (err) {
    console.error('❌ Erreur fetch Mailjet:', err)
  }
}

function buildConfirmationHtml(i: {
  nom: string; prenom: string; institution: string
  email: string; telephone: string; adresse: string; ligne_directe?: string
}) {
  return `
<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background:#f5f0f2;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0f2;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background:#460525;padding:40px 48px;text-align:center;">
          <p style="margin:0 0 10px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.55);">ADIL 95</p>
          <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;">Inscription confirmée !</h1>
          <p style="margin:10px 0 0;font-size:15px;color:rgba(255,255,255,0.7);">Inauguration des nouveaux locaux</p>
        </td>
      </tr>
      <tr>
        <td style="padding:40px 48px;">
          <p style="margin:0 0 18px;font-size:16px;color:#2a0316;">Bonjour <strong>${i.prenom} ${i.nom}</strong>,</p>
          <p style="margin:0 0 28px;font-size:15px;color:#5a3a44;line-height:1.7;">
            Nous avons bien reçu votre inscription à l'inauguration des nouveaux locaux de l'ADIL 95.
            Nous serions ravis de vous accueillir lors de cet événement.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf5f8;border:1px solid #f0d8e4;border-radius:12px;margin-bottom:28px;">
            <tr><td style="padding:24px 28px;">
              <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9b3060;">DÉTAILS DE L'ÉVÉNEMENT</p>
              <table width="100%">
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#7a3050;width:30%;">Date</td>
                  <td style="padding:5px 0;font-size:14px;font-weight:700;color:#2a0316;">Vendredi 26 juin 2026</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#7a3050;">Heure</td>
                  <td style="padding:5px 0;font-size:14px;font-weight:700;color:#2a0316;">À partir de 16h00</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#7a3050;vertical-align:top;">Lieu</td>
                  <td style="padding:5px 0;font-size:14px;font-weight:700;color:#2a0316;line-height:1.6;">
                    La Croix Saint-Sylvère<br>
                    Rue des châteaux Saint-Sylvère, Bât G<br>
                    95000 Cergy
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
          <p style="margin:0 0 6px;font-size:15px;color:#5a3a44;line-height:1.7;">En cas de question, n'hésitez pas à nous contacter.</p>
          <p style="margin:0;font-size:15px;color:#5a3a44;line-height:1.7;">À très bientôt,<br><strong style="color:#460525;">L'équipe ADIL 95</strong></p>
        </td>
      </tr>
      <tr>
        <td style="background:#f5f0f2;padding:20px 48px;text-align:center;border-top:1px solid #ead8e4;">
          <p style="margin:0;font-size:12px;color:#9a7585;">Agence Départementale d'Information sur le Logement du Val-d'Oise</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

function buildNotifHtml(i: {
  nom: string; prenom: string; institution: string
  email: string; telephone: string; adresse: string; ligne_directe?: string
}) {
  return `
  <div style="font-family:sans-serif;max-width:500px;margin:0 auto;border:1px solid #e0d0d8;border-radius:12px;overflow:hidden;">
    <div style="background:#460525;padding:20px 24px;">
      <h2 style="color:white;margin:0;font-size:18px;">Nouvelle inscription — Inauguration ADIL 95</h2>
      <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">26 juin 2026 à 16h00</p>
    </div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#999;width:120px;">Nom complet</td><td style="font-weight:700;color:#1a0a10;">${i.prenom} ${i.nom}</td></tr>
        <tr><td style="padding:6px 0;color:#999;">Institution</td><td style="color:#460525;font-weight:600;">${i.institution}</td></tr>
        <tr><td style="padding:6px 0;color:#999;">Email</td><td>${i.email}</td></tr>
        <tr><td style="padding:6px 0;color:#999;">Téléphone</td><td>${i.telephone}</td></tr>
        ${i.ligne_directe ? `<tr><td style="padding:6px 0;color:#999;">Ligne directe</td><td>${i.ligne_directe}</td></tr>` : ''}
        <tr><td style="padding:6px 0;color:#999;">Adresse</td><td>${i.adresse}</td></tr>
      </table>
    </div>
    <div style="background:#f9f0f4;padding:14px 24px;font-size:12px;color:#999;">
      ADIL 95 — Système d'inscription automatique
    </div>
  </div>`
}
