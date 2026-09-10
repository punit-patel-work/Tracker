import nodemailer from 'nodemailer';

/**
 * Gmail SMTP. Requires an *app password*, not the account password — Google
 * blocks plain password auth. If SMTP is not configured the app still works:
 * reset links fall back to the server log and the API response in dev.
 */
const configured = !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);

const transporter = configured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: (Number(process.env.SMTP_PORT) || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  : null;

export const mailReady = configured;

export async function verifyMailer() {
  if (!transporter) {
    console.log('[mail] SMTP not configured — reset links will be logged instead of sent');
    return false;
  }
  try {
    await transporter.verify();
    console.log(`[mail] SMTP ready as ${process.env.SMTP_USER}`);
    return true;
  } catch (err) {
    console.error(`[mail] SMTP check failed: ${String(err.message).slice(0, 200)}`);
    return false;
  }
}

const FROM = () => `"Gym Tracker" <${process.env.SMTP_USER}>`;

export async function sendPasswordReset(to, link, name) {
  if (!transporter) return false;
  await transporter.sendMail({
    from: FROM(),
    to,
    subject: 'Reset your Gym Tracker password',
    text: [
      `Hi ${name || 'there'},`,
      '',
      'Use this link to set a new password. It expires in one hour and works once:',
      link,
      '',
      'If you did not ask for this, you can ignore this email — your password has not changed.',
    ].join('\n'),
    html: emailShell(
      'Reset your password',
      `<p>Hi ${escapeHtml(name || 'there')},</p>
       <p>Use the button below to set a new password. The link expires in <strong>one hour</strong> and can be used once.</p>
       <p style="margin:28px 0"><a href="${link}" style="background:#6d5cf5;color:#fff;text-decoration:none;padding:13px 26px;border-radius:10px;font-weight:600;display:inline-block">Set a new password</a></p>
       <p style="color:#71718f;font-size:13px">Or paste this into your browser:<br><span style="word-break:break-all">${link}</span></p>
       <p style="color:#71718f;font-size:13px">If you did not ask for this, ignore this email — your password has not changed.</p>`,
    ),
  });
  return true;
}

export async function sendVerification(to, link, name) {
  if (!transporter) return false;
  await transporter.sendMail({
    from: FROM(),
    to,
    subject: 'Confirm your email for Gym Tracker',
    text: [
      `Hi ${name || 'there'},`,
      '',
      'Confirm this address so you can recover your account if you ever forget your password:',
      link,
      '',
      'The link expires in 24 hours. If you did not create a Gym Tracker account, ignore this email.',
    ].join('\n'),
    html: emailShell(
      'Confirm your email',
      `<p>Hi ${escapeHtml(name || 'there')},</p>
       <p>Confirm this address so you can get back into your account if you ever forget your password. You can keep using Gym Tracker in the meantime.</p>
       <p style="margin:28px 0"><a href="${link}" style="background:#6d5cf5;color:#fff;text-decoration:none;padding:13px 26px;border-radius:10px;font-weight:600;display:inline-block">Confirm my email</a></p>
       <p style="color:#71718f;font-size:13px">Or paste this into your browser:<br><span style="word-break:break-all">${link}</span></p>
       <p style="color:#71718f;font-size:13px">The link expires in 24 hours. If you did not create an account, ignore this email.</p>`,
    ),
  });
  return true;
}

export async function sendWorkoutSummary(to, name, summary) {
  if (!transporter) return false;
  const rows = summary.exercises
    .map(
      (e) =>
        `<tr><td style="padding:7px 0;border-bottom:1px solid #eee">${escapeHtml(e.name)}</td>
         <td style="padding:7px 0;border-bottom:1px solid #eee;text-align:right;color:#55556e">${escapeHtml(e.detail)}</td></tr>`,
    )
    .join('');

  await transporter.sendMail({
    from: FROM(),
    to,
    subject: `${summary.name} — ${summary.volume} logged`,
    html: emailShell(
      `${escapeHtml(summary.name)} complete`,
      `<p>Nice work, ${escapeHtml(name || 'there')}.</p>
       <table style="width:100%;border-collapse:collapse;margin:20px 0">
         <tr>
           <td style="padding:12px;background:#f7f7fc;border-radius:10px">
             <strong style="font-size:20px">${summary.volume}</strong><br>
             <span style="color:#71718f;font-size:12px">VOLUME</span>
           </td>
           <td style="width:10px"></td>
           <td style="padding:12px;background:#f7f7fc;border-radius:10px">
             <strong style="font-size:20px">${summary.kcal} kcal</strong><br>
             <span style="color:#71718f;font-size:12px">ENERGY</span>
           </td>
           <td style="width:10px"></td>
           <td style="padding:12px;background:#f7f7fc;border-radius:10px">
             <strong style="font-size:20px">${summary.minutes} min</strong><br>
             <span style="color:#71718f;font-size:12px">DURATION</span>
           </td>
         </tr>
       </table>
       ${summary.prs.length ? `<p style="background:#fff7e6;border:1px solid #fbbf24;border-radius:10px;padding:12px"><strong>🏆 ${summary.prs.length} personal record${summary.prs.length > 1 ? 's' : ''}:</strong><br>${summary.prs.map(escapeHtml).join('<br>')}</p>` : ''}
       <table style="width:100%;border-collapse:collapse">${rows}</table>`,
    ),
  });
  return true;
}

function emailShell(title, body) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f2f3f9;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#14142b">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
      <h1 style="margin:0 0 18px;font-size:22px">${title}</h1>
      ${body}
      <p style="margin-top:28px;color:#a0a0b8;font-size:12px">Gym Tracker</p>
    </div></body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
