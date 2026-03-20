// ============================================================
//  PortfolioCraft — Avatar System
//  Professional anime-style static avatars
//  with background color customization.
// ============================================================

// ─── Avatar Base Data ───────────────────────────────────────
// Static anime avatar images stored in /public/avatars/
export const BASE_AVATARS = {
  male: [
    { id: 'male-1', name: 'Felix',   src: '/avatars/felix.png'   },
    { id: 'male-2', name: 'Adrian',  src: '/avatars/adrian.png'  },
    { id: 'male-3', name: 'Marcus',  src: '/avatars/marcus.png'  },
    { id: 'male-4', name: 'Jordan',  src: '/avatars/jordan.png'  },
    { id: 'male-5', name: 'Ryan',    src: '/avatars/ryan.jpg'    },
  ],
  female: [
    { id: 'female-1', name: 'Sophia', src: '/avatars/sophia.jpg' },
    { id: 'female-2', name: 'Emma',   src: '/avatars/emma.jpg'   },
    { id: 'female-3', name: 'Zara',   src: '/avatars/zara.jpg'   },
    { id: 'female-4', name: 'Luna',   src: '/avatars/luna.jpg'   },
    { id: 'female-5', name: 'Aria',   src: '/avatars/aria.jpg'   },
  ]
};

// ─── Customization Options ───────────────────────────────────
// Background color is the main customization for static images.
export const CUSTOMIZATION_OPTIONS = {
  backgroundColor: {
    label: 'Background',
    type: 'colors',
    options: [
      { label: 'Sky Blue',  value: 'b6e3f4' },
      { label: 'Purple',    value: 'c0aede' },
      { label: 'Lavender',  value: 'd1d4f9' },
      { label: 'Pink',      value: 'ffd5dc' },
      { label: 'Peach',     value: 'ffdfbf' },
      { label: 'Mint',      value: 'b5ead7' },
      { label: 'Yellow',    value: 'ffeaa7' },
      { label: 'Dark',      value: '2d2d4e' },
      { label: 'Black',     value: '111111' },
      { label: 'White',     value: 'ffffff' },
    ]
  },
};

// ─── Default customization ────────────────────────────────────
export const DEFAULT_CUSTOMIZATION = {
  backgroundColor: 'transparent', // use the avatar's original background
};

/**
 * For static avatars, just return the src path.
 * Background color is applied via CSS, not URL params.
 */
export function buildAvatarUrl(src, _customization = {}, _extra = {}) {
  return src;
}

/**
 * Legacy helper — returns a DiceBear URL for backward compat
 */
export function getAvatarUrl(gender, role, index) {
  const seed = `portfoliocraft-${gender}-${role}-v4-${index}`;
  return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&size=200`;
}

/**
 * Legacy helper — returns array of { id, url, gender, role }
 */
export function getAvatarsForCategory(gender, role, count = 3) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${gender}-${role}-${i + 1}`,
    url: getAvatarUrl(gender, role, i + 1),
    gender,
    role,
  }));
}
