import { Hero } from '../types';

const API_BASE = 'https://api.opendota.com';

export const fetchHeroes = async (): Promise<Hero[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/heroStats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Important for avoiding CORS/403 errors in some environments
      credentials: 'omit',
      referrerPolicy: 'no-referrer', 
    });

    if (response.status === 403) {
      throw new Error('دسترسی به سرور محدود شده است. لطفاً VPN خود را بررسی کنید.');
    }

    if (!response.ok) {
      throw new Error(`خطا در دریافت اطلاعات: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Sort alphabetically
    return data.sort((a: Hero, b: Hero) => a.localized_name.localeCompare(b.localized_name));
  } catch (error: any) {
    console.error("Fetch error:", error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
       throw new Error('خطای شبکه: لطفاً اتصال اینترنت و VPN خود را بررسی کنید.');
    }
    throw error;
  }
};

export const getHeroImageUrl = (path: string) => {
  if (!path) return ''; 
  return `${API_BASE}${path}`;
};

export const getHeroVideoUrl = (internalName: string) => {
  const name = internalName.replace('npc_dota_hero_', '');
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${name}.webm`;
};

export const getAttributeColor = (attr: string) => {
  switch (attr) {
    case 'str': return 'text-red-500';
    case 'agi': return 'text-green-500';
    case 'int': return 'text-blue-400';
    case 'all': return 'text-orange-400';
    default: return 'text-slate-400';
  }
};

export const getAttributeName = (attr: string) => {
  switch (attr) {
    case 'str': return 'قدرتی (Strength)';
    case 'agi': return 'سرعتی (Agility)';
    case 'int': return 'هوش (Intelligence)';
    case 'all': return 'یونیورسال (Universal)';
    default: return attr;
  }
};