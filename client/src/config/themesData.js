export const categoryThemes = {
  developer: [
    { id: 'dev-terminal', name: 'Terminal Dark', colors: ['#0D1117', '#00FF00', '#30363D'], font: 'monospace', skeleton: 'header-sidebar', tags: ['Dark', 'Code'], compatibility: 'Pairs best with Matrix Rain' },
    { id: 'dev-neon', name: 'Neon Grid', colors: ['#09090B', '#8B5CF6', '#06B6D4'], font: 'monospace', skeleton: 'grid', tags: ['Neon', 'Cyber'], compatibility: 'Pairs best with Particle Field' },
    { id: 'dev-hacker', name: 'Hacker Green', colors: ['#000000', '#4AF626', '#1A1A1A'], font: 'monospace', skeleton: 'list', tags: ['Retro', 'Hacker'], compatibility: 'Pairs best with Matrix Rain' },
    { id: 'dev-synthwave', name: 'Synthwave', colors: ['#2B213A', '#FF2A6D', '#05D9E8'], font: 'sans-serif', skeleton: 'cards', tags: ['Vibrant', '80s'], compatibility: 'Pairs best with Fluid Grid' },
    { id: 'dev-ocean', name: 'Ocean Code', colors: ['#011627', '#82AAFF', '#C792EA'], font: 'monospace', skeleton: 'header-split', tags: ['Deep', 'Calm'], compatibility: 'Pairs best with Ripple Effect' },
    { id: 'dev-dracula', name: 'Dracula', colors: ['#282A36', '#FF79C6', '#BD93F9'], font: 'monospace', skeleton: 'sidebar', tags: ['Dark', 'Vibrant'], compatibility: 'Pairs best with Aurora' },
    { id: 'dev-monokai', name: 'Monokai', colors: ['#272822', '#F92672', '#A6E22E'], font: 'monospace', skeleton: 'header-main', tags: ['Classic', 'Warm'], compatibility: 'Pairs best with Floating Blobs' },
    { id: 'dev-nord', name: 'Nord', colors: ['#2E3440', '#88C0D0', '#81A1C1'], font: 'sans-serif', skeleton: 'minimal', tags: ['Ice', 'Clean'], compatibility: 'Pairs best with Snow Particles' },
    { id: 'dev-cobalt', name: 'Cobalt', colors: ['#193549', '#FFC600', '#0088FF'], font: 'monospace', skeleton: 'split', tags: ['Blue', 'Bright'], compatibility: 'Pairs best with Ripple Effect' },
    { id: 'dev-github', name: 'Git Dark', colors: ['#0D1117', '#58A6FF', '#238636'], font: 'sans-serif', skeleton: 'list', tags: ['Standard', 'Familiar'], compatibility: 'Pairs best with Static Grid' },
  ],
  designer: [
    { id: 'des-editorial', name: 'Editorial Minimal', colors: ['#FFFFFF', '#121212', '#E0E0E0'], font: 'serif', skeleton: 'masonry', tags: ['Light', 'Clean'], compatibility: 'Pairs best with Static Noise' },
    { id: 'des-swiss', name: 'Swiss Poster', colors: ['#F4F4F4', '#E30512', '#1A1A1A'], font: 'sans-serif', skeleton: 'grid-tight', tags: ['Bold', 'Red'], compatibility: 'Pairs best with Geometric Landscape' },
    { id: 'des-bauhaus', name: 'Bauhaus', colors: ['#EED3A1', '#D32E2E', '#285493'], font: 'sans-serif', skeleton: 'asymmetric', tags: ['Artistic', 'Primary'], compatibility: 'Pairs best with Magnetic Objects' },
    { id: 'des-monotone', name: 'Monotone Bold', colors: ['#111111', '#F4F4F4', '#737373'], font: 'sans-serif', skeleton: 'hero-large', tags: ['Dark', 'Massive'], compatibility: 'Pairs best with Fluid Distortion' },
    { id: 'des-pastel', name: 'Pastel Studio', colors: ['#FDFBF7', '#FFB5A7', '#FCD5CE'], font: 'sans-serif', skeleton: 'cards-soft', tags: ['Soft', 'Warm'], compatibility: 'Pairs best with Bokeh Orbs' },
    { id: 'des-brutalism', name: 'Neo Brutalism', colors: ['#FFE066', '#FF6B6B', '#2B2D42'], font: 'monospace', skeleton: 'border-heavy', tags: ['Edgy', 'Yellow'], compatibility: 'Pairs best with Interactive Tilt' },
    { id: 'des-elegance', name: 'Dark Elegance', colors: ['#1A1A24', '#D4AF37', '#F8F8F8'], font: 'serif', skeleton: 'minimal-center', tags: ['Luxury', 'Gold'], compatibility: 'Pairs best with Floating Constellation' },
    { id: 'des-memphis', name: 'Memphis', colors: ['#FFFFFF', '#FF00FF', '#00FFFF'], font: 'sans-serif', skeleton: 'scattered', tags: ['80s', 'Playful'], compatibility: 'Pairs best with Geometric Lines' },
    { id: 'des-serene', name: 'Serene Space', colors: ['#F4F1DE', '#E07A5F', '#3D405B'], font: 'serif', skeleton: 'gallery', tags: ['Earthy', 'Calm'], compatibility: 'Pairs best with Ripple Field' },
    { id: 'des-avant', name: 'Avant Garde', colors: ['#000000', '#FFFFFF', '#FF3366'], font: 'sans-serif', skeleton: 'split-diagonal', tags: ['Sharp', 'Contrast'], compatibility: 'Pairs best with Interactive Globe' },
  ],
  freelancer: [
    { id: 'free-trust', name: 'Trust Blue', colors: ['#FFFFFF', '#2563EB', '#F1F5F9'], font: 'sans-serif', skeleton: 'header-main', tags: ['Clean', 'Blue'], compatibility: 'Pairs best with Static Gradient' },
    { id: 'free-warm', name: 'Warm Sand', colors: ['#FDFBF7', '#D4A373', '#FAEDCD'], font: 'serif', skeleton: 'cards', tags: ['Earthy', 'Friendly'], compatibility: 'Pairs best with Bokeh Orbs' },
    { id: 'free-obsidian', name: 'Obsidian Clean', colors: ['#18181B', '#E4E4E7', '#3F3F46'], font: 'sans-serif', skeleton: 'split', tags: ['Dark', 'Sleek'], compatibility: 'Pairs best with Subtle Grid' },
    { id: 'free-sage', name: 'Sage Green', colors: ['#F4F7F6', '#84A59D', '#F6BD60'], font: 'sans-serif', skeleton: 'minimal', tags: ['Muted', 'Green'], compatibility: 'Pairs best with Depth Parallax' },
    { id: 'free-slate', name: 'Modern Slate', colors: ['#F8FAFC', '#334155', '#94A3B8'], font: 'sans-serif', skeleton: 'header-sidebar', tags: ['Grey', 'Professional'], compatibility: 'Pairs best with Wave Mesh' },
    { id: 'free-amber', name: 'Amber Glow', colors: ['#FFFFF0', '#D97706', '#FEF3C7'], font: 'sans-serif', skeleton: 'list', tags: ['Warm', 'Yellow'], compatibility: 'Pairs best with Floating Particles' },
    { id: 'free-corp', name: 'Corporate Grey', colors: ['#FAFAFA', '#525252', '#E5E5E5'], font: 'sans-serif', skeleton: 'grid', tags: ['Minimal', 'Grey'], compatibility: 'Pairs best with Static Lines' },
    { id: 'free-white', name: 'Simple White', colors: ['#FFFFFF', '#000000', '#F3F4F6'], font: 'sans-serif', skeleton: 'minimal-center', tags: ['Light', 'High Contrast'], compatibility: 'Pairs best with Noise Texture' },
    { id: 'free-navy', name: 'Navy Gold', colors: ['#0A192F', '#D4AF37', '#CCD6F6'], font: 'serif', skeleton: 'cards', tags: ['Premium', 'Dark'], compatibility: 'Pairs best with Aurora Background' },
    { id: 'free-terra', name: 'Terracotta', colors: ['#F9F5F0', '#E27D60', '#E8A87C'], font: 'sans-serif', skeleton: 'gallery', tags: ['Rustic', 'Orange'], compatibility: 'Pairs best with Liquid Hover' },
  ],
  business: [
    { id: 'biz-exec', name: 'Executive Navy', colors: ['#0B1120', '#38BDF8', '#0F172A'], font: 'sans-serif', skeleton: 'header-main', tags: ['Corporate', 'Dark'], compatibility: 'Pairs best with Interactive Globe' },
    { id: 'biz-enterprise', name: 'Enterprise Slate', colors: ['#1E293B', '#CBD5E1', '#0F172A'], font: 'sans-serif', skeleton: 'cards', tags: ['Professional', 'Grey'], compatibility: 'Pairs best with Constellation Field' },
    { id: 'biz-global', name: 'Global Tech', colors: ['#FFFFFF', '#0EA5E9', '#F1F5F9'], font: 'sans-serif', skeleton: 'grid', tags: ['Light', 'Blue'], compatibility: 'Pairs best with Ripple Effect' },
    { id: 'biz-capital', name: 'Capital Grey', colors: ['#F9FAFB', '#111827', '#D1D5DB'], font: 'serif', skeleton: 'minimal', tags: ['Finance', 'Light'], compatibility: 'Pairs best with Static Pattern' },
    { id: 'biz-boardroom', name: 'Boardroom', colors: ['#000000', '#FFFFFF', '#333333'], font: 'sans-serif', skeleton: 'split', tags: ['Monochrome', 'Dark'], compatibility: 'Pairs best with Geometric Tilt' },
    { id: 'biz-azure', name: 'Corporate Azure', colors: ['#F0F9FF', '#0284C7', '#E0F2FE'], font: 'sans-serif', skeleton: 'list', tags: ['Software', 'Blue'], compatibility: 'Pairs best with Wave Gradient' },
    { id: 'biz-trustmark', name: 'Trustmark', colors: ['#FEFEFE', '#B91C1C', '#FEE2E2'], font: 'sans-serif', skeleton: 'header-sidebar', tags: ['Red', 'Bold'], compatibility: 'Pairs best with Depth Parallax' },
    { id: 'biz-office', name: 'Minimal Office', colors: ['#FAFAFA', '#262626', '#E5E5E5'], font: 'sans-serif', skeleton: 'cards', tags: ['Clean', 'Light'], compatibility: 'Pairs best with Noise Layout' },
    { id: 'biz-finance', name: 'Financial Green', colors: ['#F0FDF4', '#16A34A', '#DCFCE7'], font: 'sans-serif', skeleton: 'grid', tags: ['Success', 'Green'], compatibility: 'Pairs best with Aurora Mesh' },
    { id: 'biz-pro', name: 'Professional Blue', colors: ['#EFF6FF', '#2563EB', '#DBEAFE'], font: 'sans-serif', skeleton: 'minimal-center', tags: ['Trust', 'Blue'], compatibility: 'Pairs best with Liquid Nodes' },
  ],
  student: [
    { id: 'edu-mint', name: 'Bright Mint', colors: ['#F2FFF5', '#2DD4BF', '#CCFBF1'], font: 'sans-serif', skeleton: 'cards-soft', tags: ['Fresh', 'Green'], compatibility: 'Pairs best with Bokeh Orbs' },
    { id: 'edu-peach', name: 'Peach Pop', colors: ['#FFF1F2', '#FB7185', '#FFE4E6'], font: 'sans-serif', skeleton: 'minimal', tags: ['Warm', 'Pink'], compatibility: 'Pairs best with Floating Blobs' },
    { id: 'edu-campus', name: 'Campus Classic', colors: ['#FFFFFF', '#4F46E5', '#E0E7FF'], font: 'sans-serif', skeleton: 'header-main', tags: ['Academic', 'Blue'], compatibility: 'Pairs best with Particle Field' },
    { id: 'edu-study', name: 'Study Dark', colors: ['#171717', '#A78BFA', '#262626'], font: 'monospace', skeleton: 'list', tags: ['Night', 'Purple'], compatibility: 'Pairs best with Constellation' },
    { id: 'edu-sunset', name: 'Sunset Gradient', colors: ['#FFFAF0', '#F59E0B', '#FEF3C7'], font: 'sans-serif', skeleton: 'grid', tags: ['Vibrant', 'Orange'], compatibility: 'Pairs best with Aurora Mesh' },
    { id: 'edu-notebook', name: 'Notebook', colors: ['#FAFAFA', '#000000', '#DBDBDB'], font: 'serif', skeleton: 'split', tags: ['Minimal', 'Light'], compatibility: 'Pairs best with Noise Texture' },
    { id: 'edu-lavender', name: 'Lavender', colors: ['#FAF5FF', '#A855F7', '#F3E8FF'], font: 'sans-serif', skeleton: 'cards', tags: ['Soft', 'Purple'], compatibility: 'Pairs best with Ripple Hover' },
    { id: 'edu-sky', name: 'Sky Blue', colors: ['#F0F9FF', '#38BDF8', '#E0F2FE'], font: 'sans-serif', skeleton: 'minimal-center', tags: ['Airy', 'Blue'], compatibility: 'Pairs best with Magnetic Objects' },
    { id: 'edu-lemon', name: 'Lemonade', colors: ['#FEFCE8', '#EAB308', '#FEF9C3'], font: 'sans-serif', skeleton: 'masonry', tags: ['Bright', 'Yellow'], compatibility: 'Pairs best with Liquid Distort' },
    { id: 'edu-berry', name: 'Berry', colors: ['#FDF2F8', '#EC4899', '#FCE7F3'], font: 'sans-serif', skeleton: 'gallery', tags: ['Pink', 'Rich'], compatibility: 'Pairs best with Geometric Landscape' },
  ],
  creative: [
    { id: 'art-cyber', name: 'Cyber Pop', colors: ['#000000', '#FF00FF', '#00FFFF'], font: 'monospace', skeleton: 'asymmetric', tags: ['Extreme', 'Neon'], compatibility: 'Pairs best with Matrix Rain' },
    { id: 'art-abstract', name: 'Abstract Art', colors: ['#F0EDEE', '#0A0908', '#22333B'], font: 'serif', skeleton: 'scattered', tags: ['Monochrome', 'Artistic'], compatibility: 'Pairs best with Liquid Hover' },
    { id: 'art-fluid', name: 'Fluid Gradient', colors: ['#22092C', '#F05941', '#BE3144'], font: 'sans-serif', skeleton: 'hero-large', tags: ['Red', 'Deep'], compatibility: 'Pairs best with Ripple Cursor' },
    { id: 'art-retro', name: 'Funky Retro', colors: ['#F5F5DC', '#FF6F61', '#6B5B95'], font: 'serif', skeleton: 'cards', tags: ['70s', 'Warm'], compatibility: 'Pairs best with Wave Nodes' },
    { id: 'art-space', name: 'Deep Space', colors: ['#090A0F', '#7E22CE', '#C084FC'], font: 'sans-serif', skeleton: 'masonry', tags: ['Purple', 'Dark'], compatibility: 'Pairs best with Asteroid Particles' },
    { id: 'art-bubblegum', name: 'Bubblegum', colors: ['#FFC0CB', '#FF69B4', '#FF1493'], font: 'sans-serif', skeleton: 'grid-tight', tags: ['Pink', 'Pop'], compatibility: 'Pairs best with Morphing Blobs' },
    { id: 'art-lime', name: 'Electric Lime', colors: ['#111111', '#CCFF00', '#333333'], font: 'monospace', skeleton: 'border-heavy', tags: ['Edgy', 'Green'], compatibility: 'Pairs best with Interactive Tilt' },
    { id: 'art-magma', name: 'Magma', colors: ['#120136', '#FC5185', '#3FC1C9'], font: 'sans-serif', skeleton: 'split-diagonal', tags: ['Hot', 'Dark'], compatibility: 'Pairs best with Aurora Background' },
    { id: 'art-acid', name: 'Acid Dream', colors: ['#000000', '#39FF14', '#111111'], font: 'monospace', skeleton: 'gallery', tags: ['Toxic', 'Code'], compatibility: 'Pairs best with Matrix Rain' },
    { id: 'art-prism', name: 'Prism', colors: ['#FFFFFF', '#000000', '#A855F7'], font: 'sans-serif', skeleton: 'minimal', tags: ['Rainbow', 'Clean'], compatibility: 'Pairs best with Bokeh Orbs' },
  ],
};

export const allThemes = [
  ...categoryThemes.developer.slice(0, 6),
  ...categoryThemes.designer.slice(0, 6),
  ...categoryThemes.freelancer.slice(0, 6),
  ...categoryThemes.business.slice(0, 6),
  ...categoryThemes.student.slice(0, 6),
  ...categoryThemes.creative.slice(0, 6),
];

export function getAnimationTokens(selectedTheme) {
  if (!selectedTheme || !selectedTheme.colors) {
    return {
      background: '#0a0a1a', primary: '#7c3aed', secondary: '#06b6d4',
      glow: '#7c3aedCC', particle: '#7c3aed99',
      gradient: ['#7c3aed', '#06b6d4'],
      overlay: '#0a0a1aDD', muted: '#06b6d455'
    };
  }
  const [bg, primary, secondary] = selectedTheme.colors;
  return {
    background: bg,
    primary: primary,
    secondary: secondary,
    glow: primary + 'CC',
    particle: primary + '99',
    gradient: [primary, secondary],
    overlay: bg + 'DD',
    muted: secondary + '55'
  };
}
