import { useState, useEffect } from 'react';
import { STRIPE_PRICE_ID_DEFAULTS, PRICING_TIER_1, PRICING_TIER_2, PRICING_TIER_3, tier1SavingsVs12Months } from '@/lib/pricing';

export type PriceTier = 1 | 2 | 3;

export interface GeoPrices {
  tier: PriceTier;
  country: string;
  countryCode: string;
  flag: string;
  weekPass: { amount: number; display: string };
  monthly: { amount: number; display: string; priceId: string } | null;
  lifetime: { amount: number; display: string };
  savingsVs12Months: string | null;
  specialLabel: string | null;
}

const TIER_1 = new Set([
  'GB','US','CA','AU','NZ','DE','FR','NL','BE','AT','CH','SE','NO','DK','FI',
  'IE','IT','ES','PT','LU','IS','LI','SG','HK','JP','AE','QA','SA','KW','BH','OM',
]);

const TIER_2 = new Set([
  'BR','MX','AR','CL','CO','PE','PL','RO','CZ','HU','SK','HR','BG','RS','MY',
  'TH','ZA','TR','RU','UA','EG','MA','TN','JO','LB','GE','AZ','KZ','MK','AL',
  'DZ','LY','IQ','IR','SY','YE',
]);

const COUNTRY_FLAG: Record<string, string> = {
  GB:'🇬🇧',US:'🇺🇸',CA:'🇨🇦',AU:'🇦🇺',NZ:'🇳🇿',DE:'🇩🇪',FR:'🇫🇷',NL:'🇳🇱',BE:'🇧🇪',
  AT:'🇦🇹',CH:'🇨🇭',SE:'🇸🇪',NO:'🇳🇴',DK:'🇩🇰',FI:'🇫🇮',IE:'🇮🇪',IT:'🇮🇹',ES:'🇪🇸',
  PT:'🇵🇹',SG:'🇸🇬',HK:'🇭🇰',JP:'🇯🇵',AE:'🇦🇪',QA:'🇶🇦',SA:'🇸🇦',KW:'🇰🇼',BH:'🇧🇭',
  OM:'🇴🇲',BR:'🇧🇷',MX:'🇲🇽',AR:'🇦🇷',CL:'🇨🇱',CO:'🇨🇴',PL:'🇵🇱',RO:'🇷🇴',CZ:'🇨🇿',
  MY:'🇲🇾',TH:'🇹🇭',ZA:'🇿🇦',TR:'🇹🇷',EG:'🇪🇬',MA:'🇲🇦',ID:'🇮🇩',IN:'🇮🇳',PH:'🇵🇭',
  VN:'🇻🇳',BD:'🇧🇩',PK:'🇵🇰',NG:'🇳🇬',GH:'🇬🇭',KE:'🇰🇪',
};

const COUNTRY_NAME: Record<string, string> = {
  GB:'United Kingdom',US:'United States',CA:'Canada',AU:'Australia',NZ:'New Zealand',
  DE:'Germany',FR:'France',NL:'Netherlands',BE:'Belgium',AT:'Austria',CH:'Switzerland',
  SE:'Sweden',NO:'Norway',DK:'Denmark',FI:'Finland',IE:'Ireland',IT:'Italy',ES:'Spain',
  PT:'Portugal',SG:'Singapore',HK:'Hong Kong',JP:'Japan',AE:'UAE',QA:'Qatar',SA:'Saudi Arabia',
  KW:'Kuwait',BH:'Bahrain',OM:'Oman',BR:'Brazil',MX:'Mexico',AR:'Argentina',CL:'Chile',
  CO:'Colombia',PL:'Poland',RO:'Romania',CZ:'Czech Republic',MY:'Malaysia',TH:'Thailand',
  ZA:'South Africa',TR:'Turkey',EG:'Egypt',MA:'Morocco',ID:'Indonesia',IN:'India',
  PH:'Philippines',VN:'Vietnam',BD:'Bangladesh',PK:'Pakistan',NG:'Nigeria',GH:'Ghana',KE:'Kenya',
};

const MONTHLY_PRICE_ID = import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID || STRIPE_PRICE_ID_DEFAULTS.monthly;

function getTier(countryCode: string): PriceTier {
  if (TIER_1.has(countryCode)) return 1;
  if (TIER_2.has(countryCode)) return 2;
  return 3;
}

function buildPrices(tier: PriceTier, countryCode: string, country: string): GeoPrices {
  const flag = COUNTRY_FLAG[countryCode] || '🌍';

  if (tier === 1) {
    return {
      tier, country, countryCode, flag,
      weekPass: { ...PRICING_TIER_1.weekPass },
      monthly: { ...PRICING_TIER_1.monthly, priceId: MONTHLY_PRICE_ID },
      lifetime: { ...PRICING_TIER_1.lifetime },
      savingsVs12Months: tier1SavingsVs12Months(),
      specialLabel: null,
    };
  }

  if (tier === 2) {
    return {
      tier, country, countryCode, flag,
      weekPass: { ...PRICING_TIER_2.weekPass },
      monthly: PRICING_TIER_2.monthly,
      lifetime: { ...PRICING_TIER_2.lifetime },
      savingsVs12Months: null,
      specialLabel: `${flag} Local price for ${country || 'your region'}`,
    };
  }

  return {
    tier, country, countryCode, flag,
    weekPass: { ...PRICING_TIER_3.weekPass },
    monthly: PRICING_TIER_3.monthly,
    lifetime: { ...PRICING_TIER_3.lifetime },
    savingsVs12Months: null,
    specialLabel: `${flag} Special price for ${country || 'your region'}`,
  };
}

const CACHE_KEY = 'cyp_geo_price_v2';
const CACHE_TTL = 24 * 60 * 60 * 1000;

export function useGeoPrice(): { prices: GeoPrices; loading: boolean } {
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<GeoPrices>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) return data;
      }
    } catch {}
    return buildPrices(1, 'GB', 'United Kingdom');
  });

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setLoading(false);
          return;
        }
      } catch {}
    }

    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const code = (data.country_code || 'GB').toUpperCase();
        const name = COUNTRY_NAME[code] || data.country_name || '';
        const tier = getTier(code);
        const result = buildPrices(tier, code, name);
        setPrices(result);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, ts: Date.now() }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { prices, loading };
}
