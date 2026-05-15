export async function sendNotificationEmail(inscription: {
  nom: string
  prenom: string
  institution: string
  email: string
  telephone: string
  adresse: string
  ligne_directe?: string
}) {
  const notifEmail = process.env.NOTIF_EMAIL
  if (!notifEmail) return // pas de notif configurée

  try {
    // Option Resend (recommandé)
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ADIL 95 <noreply@adil95.fr>',
          to: [notifEmail],
          subject: `🎉 Nouvelle inscription — ${inscription.prenom} ${inscription.nom}`,
          html: buildEmailHtml(inscription),
        }),
      })
      return
    }

    // Option Nodemailer / SMTP
    if (process.env.SMTP_HOST) {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
      await transporter.sendMail({
        from: `"ADIL 95" <${process.env.SMTP_USER}>`,
        to: notifEmail,
        subject: `🎉 Nouvelle inscription — ${inscription.prenom} ${inscription.nom}`,
        html: buildEmailHtml(inscription),
      })
    }
  } catch (err) {
    console.error('Erreur envoi email:', err)
    // On ne bloque pas l'inscription si l'email échoue
  }
}

function buildEmailHtml(i: {
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
  </div>
  `
}
