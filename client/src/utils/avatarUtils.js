// ============================================================
//  PortfolioCraft — Avatar URL Generator
//  Uses DiceBear v7 — free, no API key, no CORS issues,
//  fully Vercel-compatible.
// ============================================================

const AVATAR_BASE =
  import.meta.env.VITE_AVATAR_API_BASE || 'https://api.dicebear.com/7.x';

// 'notionists' → clean, modern 3D-minimal cartoon style (recommended)
// 'avataaars'  → friendly illustrated cartoon
// 'big-smile'  → premium SaaS-style cartoon
const AVATAR_STYLE =
  import.meta.env.VITE_AVATAR_STYLE || 'notionists';

/**
 * Build a deterministic DiceBear avatar URL.
 * Same seed always returns the same avatar.
 */
export function getAvatarUrl(gender, role, index) {
  const seed = `portfoliocraft-${gender}-${role}-v4-${index}`;
  const params = new URLSearchParams({ seed, size: '200' });
  return `${AVATAR_BASE}/${AVATAR_STYLE}/svg?${params.toString()}`;
}

/**
 * Return an array of { id, url, gender, role } objects.
 */
export function getAvatarsForCategory(gender, role, count = 3) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${gender}-${role}-${i + 1}`,
    url: getAvatarUrl(gender, role, i + 1),
    gender,
    role,
  }));
}
