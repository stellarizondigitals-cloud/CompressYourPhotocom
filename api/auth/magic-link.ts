import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, redirectTo } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Auth service not configured' });
    }

    if (!resendApiKey) {
      return res.status(503).json({ error: 'Email service not configured. Please contact support.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const callbackUrl = redirectTo || 'https://www.compressyourphoto.com/auth/callback';

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: callbackUrl },
    });

    if (error || !data?.properties?.action_link) {
      console.error('[MagicLink] Generate error:', error?.message);
      return res.status(500).json({ error: error?.message || 'Failed to generate login link' });
    }

    const magicLink = data.properties.action_link;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CompressYourPhoto <hello@compressyourphoto.com>',
        reply_to: 'hello@compressyourphoto.com',
        to: email,
        subject: 'Your sign-in link for CompressYourPhoto',
        text: `Sign in to CompressYourPhoto\n\nClick the link below to sign in. This link expires in 1 hour and can only be used once.\n\n${magicLink}\n\nIf you didn't request this, you can safely ignore this email.\n\n-- CompressYourPhoto\nhttps://www.compressyourphoto.com`,
        html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign in to CompressYourPhoto</title></head><body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
            <tr><td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e8e8e8">
                <tr><td style="background:#7c3aed;padding:24px 32px">
                  <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px">CompressYourPhoto</p>
                </td></tr>
                <tr><td style="padding:36px 32px">
                  <h1 style="margin:0 0 12px;font-size:22px;color:#111111;font-weight:700">Your sign-in link</h1>
                  <p style="margin:0 0 28px;font-size:15px;color:#555555;line-height:1.6">Click the button below to sign in to your account. This link expires in <strong>1 hour</strong> and can only be used once.</p>
                  <table cellpadding="0" cellspacing="0"><tr><td style="border-radius:7px;background:#7c3aed">
                    <a href="${magicLink}" style="display:inline-block;padding:14px 30px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;border-radius:7px">Sign in to CompressYourPhoto</a>
                  </td></tr></table>
                  <p style="margin:28px 0 0;font-size:13px;color:#999999;line-height:1.5">If the button doesn't work, copy and paste this link into your browser:<br><a href="${magicLink}" style="color:#7c3aed;word-break:break-all;font-size:12px">${magicLink}</a></p>
                </td></tr>
                <tr><td style="padding:20px 32px;border-top:1px solid #eeeeee;background:#fafafa">
                  <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6">If you didn't request this email, you can safely ignore it — no action is needed.<br>
                  &copy; ${new Date().getFullYear()} CompressYourPhoto &middot; Stellarizon Digitals Ltd &middot; <a href="https://www.compressyourphoto.com" style="color:#aaaaaa">compressyourphoto.com</a></p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body></html>`,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('[MagicLink] Resend error:', emailRes.status, errText);
      return res.status(502).json({ error: 'Failed to send login email. Please try again.' });
    }

    console.log('[MagicLink] Sent via Resend to:', email);
    return res.status(200).json({ message: 'Login link sent! Check your email.' });
  } catch (err: any) {
    console.error('[MagicLink] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to send login link' });
  }
}
