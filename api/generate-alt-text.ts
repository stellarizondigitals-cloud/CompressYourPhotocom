import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, mimeType } = req.body || {};
    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const payload = {
      contents: [{
        parts: [
          { inline_data: { mime_type: mimeType, data: imageBase64 } },
          {
            text: `You are an SEO expert. Analyze this image and generate professional, SEO-optimized alt text for web use.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "primary": "concise alt text under 125 chars describing what is in the image for accessibility and SEO",
  "alternative1": "keyword-rich version optimized for search engines, under 125 chars",
  "alternative2": "detailed descriptive version with more context, under 150 chars",
  "tips": [
    "specific actionable tip 1 for this image",
    "specific actionable tip 2 for this image",
    "specific actionable tip 3 for this image"
  ]
}`
          }
        ]
      }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 8192 }
    };

    const geminiModels = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];
    let geminiResponse: globalThis.Response | null = null;
    let lastStatus = 0;

    for (const model of geminiModels) {
      const modelPayload = model === 'gemini-2.5-flash'
        ? { ...payload, generationConfig: { ...payload.generationConfig, thinkingConfig: { thinkingBudget: 0 } } }
        : payload;

      geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(modelPayload) }
      );
      lastStatus = geminiResponse.status;
      if (geminiResponse.ok) break;
      const errText = await geminiResponse.text();
      console.error(`[Gemini] ${model} error:`, geminiResponse.status, errText.substring(0, 200));
      if (geminiResponse.status === 400 || geminiResponse.status === 403) break;
    }

    if (!geminiResponse || !geminiResponse.ok) {
      const msg = lastStatus === 429
        ? 'AI quota temporarily reached. Please try again in a moment.'
        : 'AI generation failed. Please try again.';
      return res.status(502).json({ error: msg });
    }

    const data: any = await geminiResponse.json();
    const parts: any[] = data.candidates?.[0]?.content?.parts || [];
    let text = parts.filter((p: any) => !p.thought).map((p: any) => p.text || '').join('\n').trim();
    if (!text) text = parts.map((p: any) => p.text || '').join('\n').trim();
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[Gemini] No JSON in response:', text.substring(0, 300));
      return res.status(500).json({ error: 'Unexpected AI response. Please try again.' });
    }

    const result = JSON.parse(jsonMatch[0]);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[Alt Text] Error:', error);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
}
