// api/index.js
// Vercel Serverless Function — CommonJS format

const generatePortfolioHTML = (builderState) => {
  const name = builderState?.personalInfo?.name || 'Your Name';
  const title = builderState?.personalInfo?.title || 'Professional';
  const bio = builderState?.personalInfo?.bio || '';
  const email = builderState?.personalInfo?.email || '';
  const location = builderState?.personalInfo?.location || '';
  const bgColor = builderState?.selectedTheme?.colors?.[0] || '#0D0D1A';
  const primaryColor = builderState?.selectedTheme?.colors?.[1] || '#7C3AED';
  const secondaryColor = builderState?.selectedTheme?.colors?.[2] || '#06B6D4';
  const font = builderState?.selectedTheme?.font || 'sans-serif';
  const projects = builderState?.projects || [];
  const skills = builderState?.skills || [];

  const fontStack = {
    'monospace': '"Fira Code", "Courier New", monospace',
    'serif': '"Playfair Display", Georgia, serif',
    'sans-serif': '"Inter", "Helvetica Neue", sans-serif'
  }[font] || '"Inter", sans-serif';

  const getTextColor = (hex) => {
    try {
      const r = parseInt(hex.slice(1,3), 16);
      const g = parseInt(hex.slice(3,5), 16);
      const b = parseInt(hex.slice(5,7), 16);
      const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
      return lum > 0.5 ? '#111111' : '#FFFFFF';
    } catch { return '#FFFFFF'; }
  };

  const textColor = getTextColor(bgColor);
  const btnTextColor = getTextColor(primaryColor);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - ${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: ${bgColor};
      color: ${textColor};
      font-family: ${fontStack};
      min-height: 100vh;
    }
    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      padding: 16px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: ${bgColor}cc;
      backdrop-filter: blur(10px);
      z-index: 100;
      border-bottom: 1px solid ${primaryColor}22;
    }
    nav .logo { font-weight: 700; color: ${primaryColor}; }
    nav .nav-links { display: flex; gap: 24px; }
    nav .nav-links a {
      color: ${textColor};
      text-decoration: none;
      opacity: 0.8;
      font-size: 0.9rem;
    }
    nav .nav-links a:hover { color: ${primaryColor}; opacity: 1; }
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 100px 20px 60px;
    }
    .hero h1 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      margin-bottom: 12px;
      color: ${textColor};
    }
    .hero .role {
      font-size: 1.2rem;
      color: ${primaryColor};
      margin-bottom: 20px;
    }
    .hero .bio {
      max-width: 600px;
      opacity: 0.75;
      line-height: 1.7;
      margin-bottom: 36px;
      font-size: 1rem;
    }
    .cta-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .btn {
      padding: 13px 30px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.85; }
    .btn-primary {
      background: ${primaryColor};
      color: ${btnTextColor};
    }
    .btn-secondary {
      border: 2px solid ${primaryColor};
      color: ${primaryColor};
      background: transparent;
    }
    .section {
      padding: 80px 40px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: ${primaryColor};
      margin-bottom: 12px;
    }
    .section-divider {
      width: 60px;
      height: 4px;
      background: ${primaryColor};
      border-radius: 2px;
      margin-bottom: 40px;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    .project-card {
      background: ${primaryColor}11;
      border: 1px solid ${primaryColor}33;
      border-radius: 16px;
      padding: 28px;
      transition: transform 0.2s, border-color 0.2s;
    }
    .project-card:hover {
      transform: translateY(-4px);
      border-color: ${primaryColor}88;
    }
    .project-card h3 {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 10px;
      color: ${textColor};
    }
    .project-card p {
      opacity: 0.7;
      line-height: 1.6;
      font-size: 0.95rem;
    }
    .skills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .skill-tag {
      background: ${primaryColor}22;
      color: ${primaryColor};
      border: 1px solid ${primaryColor}44;
      padding: 8px 20px;
      border-radius: 100px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .contact-box {
      background: ${primaryColor}11;
      border: 1px solid ${primaryColor}33;
      border-radius: 16px;
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 600px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
      opacity: 0.85;
      font-size: 1rem;
    }
    footer {
      text-align: center;
      padding: 30px;
      opacity: 0.4;
      font-size: 0.85rem;
      border-top: 1px solid ${primaryColor}22;
    }
  </style>
</head>
<body>

  <nav>
    <div class="logo">${name}</div>
    <div class="nav-links">
      <a href="#projects">Projects</a>
      <a href="#skills">Skills</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <section class="hero">
    <h1>${name}</h1>
    <p class="role">${title}</p>
    ${bio ? `<p class="bio">${bio}</p>` : ''}
    <div class="cta-row">
      <a href="#projects" class="btn btn-primary">View My Work</a>
      <a href="#contact" class="btn btn-secondary">Get In Touch</a>
    </div>
  </section>

  <section class="section" id="projects">
    <h2 class="section-title">Projects</h2>
    <div class="section-divider"></div>
    <div class="projects-grid">
      ${projects.length > 0
        ? projects.map(p => `
            <div class="project-card">
              <h3>${p.name || 'Project'}</h3>
              <p>${p.description || 'Project description'}</p>
              ${p.link
                ? `<a href="${p.link}" class="btn btn-primary"
                    style="margin-top:16px;font-size:0.85rem;padding:8px 18px;">
                    View Project
                   </a>`
                : ''
              }
            </div>
          `).join('')
        : `
          <div class="project-card">
            <h3>Project One</h3>
            <p>Add your project description here</p>
          </div>
          <div class="project-card">
            <h3>Project Two</h3>
            <p>Add your project description here</p>
          </div>
          <div class="project-card">
            <h3>Project Three</h3>
            <p>Add your project description here</p>
          </div>
        `
      }
    </div>
  </section>

  <section class="section" id="skills">
    <h2 class="section-title">Skills</h2>
    <div class="section-divider"></div>
    <div class="skills-wrap">
      ${skills.length > 0
        ? skills.map(s => `<span class="skill-tag">${s}</span>`).join('')
        : `
          <span class="skill-tag">Add your skills</span>
          <span class="skill-tag">in the builder</span>
        `
      }
    </div>
  </section>

  <section class="section" id="contact">
    <h2 class="section-title">Get In Touch</h2>
    <div class="section-divider"></div>
    <div class="contact-box">
      ${email
        ? `<div class="contact-item">📧 <span>${email}</span></div>`
        : ''
      }
      ${location
        ? `<div class="contact-item">📍 <span>${location}</span></div>`
        : ''
      }
      <div class="contact-item">
        💼 <span>Open to opportunities</span>
      </div>
    </div>
  </section>

  <footer>
    Built with PortfolioCraft
  </footer>

</body>
</html>`;
};

// Vercel serverless function handler
// IMPORTANT: Must use module.exports — NOT export default
// api folder uses CommonJS not ESM

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const builderState = req.body || {};
    const html = generatePortfolioHTML(builderState);

    // Return JSON containing the HTML string — Fixes "Unexpected token <" errors on frontend
    return res.status(200).json({ 
      success: true, 
      html: html 
    });

  } catch (error) {
    console.error('Handler error:', error.message);
    return res.status(500).json({
      error: 'Failed to generate portfolio',
      message: error.message
    });
  }
};
