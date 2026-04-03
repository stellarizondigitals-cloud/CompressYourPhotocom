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
        from: 'CompressYourPhoto <noreply@compressyourphoto.com>',
        to: email,
        subject: 'Your login link for CompressYourPhoto',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff">
            <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a">Log in to CompressYourPhoto</h2>
            <p style="color:#555;margin:0 0 24px;font-size:15px">Click the button below to sign in instantly. This link expires in 1 hour and can only be used once.</p>
            <a href="${magicLink}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:13px 28px;border-radius:7px;font-weight:600;font-size:15px">Sign in to CompressYourPhoto</a>
            <p style="color:#888;margin:28px 0 0;font-size:13px">If you didn't request this email, you can safely ignore it.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#aaa;font-size:12px;margin:0">CompressYourPhoto &middot; <a href="https://www.compressyourphoto.com" style="color:#aaa">compressyourphoto.com</a></p>
          </div>`,
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
