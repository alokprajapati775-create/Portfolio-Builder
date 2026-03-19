// client/src/utils/portfolioGenerator.js
// Universal Portfolio Generator — Browser & Server safe
// Sync'd with server.js feature set

export const THEME_PALETTES = {
  dark: {
    bg: '#0a0a1a', bgSecondary: '#111127', accent: '#7c3aed', accentAlt: '#06b6d4',
    text: '#f0f0f5', textSecondary: '#9ca3af', card: 'rgba(255,255,255,0.05)',
    gradient: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
  },
  light: {
    bg: '#f8fafc', bgSecondary: '#ffffff', accent: '#6366f1', accentAlt: '#8b5cf6',
    text: '#1e293b', textSecondary: '#64748b', card: 'rgba(0,0,0,0.03)',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  colorful: {
    bg: '#0f0c29', bgSecondary: '#1a1145', accent: '#f97316', accentAlt: '#ec4899',
    text: '#ffffff', textSecondary: '#c4b5fd', card: 'rgba(255,255,255,0.8)',
    gradient: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)',
  },
  luxury: {
    bg: '#0c0c0c', bgSecondary: '#1a1a1a', accent: '#d4a853', accentAlt: '#f5e6c8',
    text: '#f5f5f5', textSecondary: '#a0a0a0', card: 'rgba(212,168,83,0.08)',
    gradient: 'linear-gradient(135deg, #d4a853, #f5e6c8)',
  },
  minimal: {
    bg: '#ffffff', bgSecondary: '#fafafa', accent: '#171717', accentAlt: '#525252',
    text: '#171717', textSecondary: '#737373', card: 'rgba(0,0,0,0.04)',
    gradient: 'linear-gradient(135deg, #171717, #525252)',
  },
};

export function generatePortfolioHTML(data) {
  const defaultTheme = THEME_PALETTES.dark;
  let theme = { ...(data.themePalette || THEME_PALETTES[data.theme] || defaultTheme) };
  
  if (data.customPrimaryColor) {
    theme.accent = data.customPrimaryColor;
    theme.gradient = `linear-gradient(135deg, ${data.customPrimaryColor}, ${theme.accentAlt || theme.accent})`;
  }

  const hexLuminance = (hex) => {
    if (!hex || !hex.startsWith('#')) return 0;
    const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    return 0.299*r + 0.587*g + 0.114*b;
  };
  const isLightBg = hexLuminance(theme.bg) > 0.5;
  if (isLightBg) {
    theme.text = theme.text && hexLuminance(theme.text) < 0.4 ? theme.text : '#111111';
    theme.textSecondary = theme.textSecondary && hexLuminance(theme.textSecondary) < 0.55 ? theme.textSecondary : '#555555';
    theme.card = theme.card || 'rgba(0,0,0,0.04)';
  }

  const animMode = data.animationMode || 'ambient';
  const noAnim = animMode === 'no-animation';
  const variant = data.backgroundVariant || data.animationVariant || 'aurora-waves';
  const cursorEffect = data.cursorEffect || 'default';

  const skillsHTML = (data.skills || []).map((skill, i) => `
    <div class="skill-card" style="${!noAnim ? `animation-delay: ${i * 0.1}s` : ''}">
      <span class="skill-name">${skill}</span>
    </div>
  `).join('');

  const projectsHTML = (data.projects || []).map((p, i) => `
    <div class="project-card" style="${!noAnim ? `animation-delay: ${i * 0.15}s` : ''}">
      <div class="project-content">
        <h3>${p.title || 'Untitled'}</h3>
        <p>${p.description || ''}</p>
        ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">View Project →</a>` : ''}
      </div>
    </div>
  `).join('');

  const socialsHTML = Object.entries(data.socials || {}).filter(([, v]) => v).map(([key, url]) => `
    <a href="${url}" target="_blank" rel="noopener" class="social-link">${key}</a>
  `).join('');

  let bgScript = '';
  let heroHTML = '';
  let extraCSS = '';
  let cursorScript = '';

  // Utility to parse hex to 0-1 range for WebGL
  const hexToGl = (hex) => {
    const r = parseInt(hex.slice(1,3),16)/255.0;
    const g = parseInt(hex.slice(3,5),16)/255.0;
    const b = parseInt(hex.slice(5,7),16)/255.0;
    return `${r.toFixed(3)},${g.toFixed(3)},${b.toFixed(3)}`;
  };

  if (animMode === 'physics') {
    if (variant === 'webgl-fluid') {
      bgScript = `
      <canvas id="fluid-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;"></canvas>
      <script>
        const canvas = document.getElementById('fluid-canvas'), gl = canvas.getContext('webgl');
        if(gl){
          let t=0; const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}', 
          fs='precision mediump float;uniform float t;uniform vec2 r;uniform vec2 m;void main(){vec2 uv=gl_FragCoord.xy/r;float d=length(uv-m/r);vec3 c1=vec3(${hexToGl(theme.accent)});vec3 c2=vec3(${hexToGl(theme.accentAlt)});float wave=sin(uv.x*10.0+t)*sin(uv.y*8.0+t*0.7)*0.5+0.5;vec3 col=mix(c1,c2,wave)*smoothstep(0.5,0.0,d)*0.6;gl_FragColor=vec4(col,1.0);}';
          function cs(t,s){const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);return sh;}
          const prog=gl.createProgram();gl.attachShader(prog,cs(gl.VERTEX_SHADER,vs));gl.attachShader(prog,cs(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);gl.useProgram(prog);
          const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
          const p=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
          const tU=gl.getUniformLocation(prog,'t'),rU=gl.getUniformLocation(prog,'r'),mU=gl.getUniformLocation(prog,'m');
          let mx=innerWidth/2,my=innerHeight/2; document.addEventListener('mousemove',e=>{mx=e.clientX;my=innerHeight-e.clientY;});
          function render(){t+=0.016;gl.uniform1f(tU,t);gl.uniform2f(rU,innerWidth,innerHeight);gl.uniform2f(mU,mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(render);}
          render();
        }
        window.addEventListener('resize',()=>{canvas.width=innerWidth;canvas.height=innerHeight;if(gl)gl.viewport(0,0,innerWidth,innerHeight);});
        canvas.width=innerWidth;canvas.height=innerHeight;
      </script>`;
    } else if (variant === 'lanyard-card') {
      bgScript = `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
      <div id="physics-bg"></div>
      <div id="lanyard-card">
        <div id="physics-clip"></div><div id="physics-hole"></div>
        ${data.profileImageUrl ? `<img src="${data.profileImageUrl}" style="width:120px;height:120px;border-radius:50%;margin-bottom:20px;border:3px solid var(--accent);object-fit:cover;"/>` : `<div style="width:120px;height:120px;border-radius:50%;background:var(--accent);margin-bottom:20px;"></div>`}
        <h2 style="font-family:'Space Grotesk',sans-serif;font-size:1.5rem;text-align:center;margin-bottom:10px;color:var(--text);">${data.name || 'Your Name'}</h2>
        <p style="text-align:center;color:var(--text2);font-weight:500;">${data.portfolioType || 'Creative'}</p>
        <button onclick="window.scrollTo({top: window.innerHeight, behavior: 'smooth'})" style="margin-top:25px; padding:10px 24px; border-radius:8px; border:none; background:var(--accent); color:#fff; cursor:pointer; font-weight:600; pointer-events:auto;">View Portfolio</button>
      </div>
      <script>
        const {Engine,Render,Runner,Composite,Bodies,Constraint,Mouse,MouseConstraint,Events,Body}=Matter;
        const engine=Engine.create(),world=engine.world;
        const render=Render.create({element:document.getElementById('physics-bg'),engine,options:{width:innerWidth,height:innerHeight,wireframes:false,background:'transparent'}});
        Render.run(render); Runner.run(Runner.create(),engine);
        const lEl=document.getElementById('lanyard-card'),cB=Bodies.rectangle(innerWidth/2,250,300,450,{render:{visible:false},density:0.05,frictionAir:0.02});
        const rope=Constraint.create({pointA:{x:innerWidth/2,y:-50},bodyB:cB,pointB:{x:0,y:-180},stiffness:0.05,damping:0.01,render:{visible:true,strokeStyle:'${theme.accentAlt}',lineWidth:3}});
        Composite.add(world,[cB,rope]);
        Events.on(engine,'afterUpdate',()=>{if(cB&&lEl)lEl.style.transform='translate(-50%,-50%) translate('+cB.position.x+'px,'+cB.position.y+'px) rotate('+cB.angle+'rad)';});
        for(let i=0;i<12;i++)Composite.add(world,Bodies.circle(Math.random()*innerWidth,Math.random()*-1000,Math.random()*20+20,{render:{fillStyle:Math.random()>0.5?'${theme.accent}':'${theme.accentAlt}'}}));
        const ground=Bodies.rectangle(innerWidth/2,innerHeight+50,innerWidth*2,100,{isStatic:true,render:{visible:false}});
        Composite.add(world,ground);
        const mouse=Mouse.create(render.canvas),mc=MouseConstraint.create(engine,{mouse,constraint:{stiffness:0.1,render:{visible:false}}});
        Composite.add(world,mc); render.mouse=mouse;
      </script>`;
      extraCSS += `
        #physics-bg{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;}
        #lanyard-card{position:fixed;top:0;left:0;width:300px;height:450px;background:var(--card);border:1px solid rgba(255,255,255,0.1);border-radius:16px;backdrop-filter:blur(10px);padding:30px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10;pointer-events:none;box-shadow:0 20px 40px rgba(0,0,0,0.3);}
        #physics-clip{position:absolute;top:10px;width:40px;height:12px;background:rgba(255,255,255,0.8);border-radius:4px;}
      `;
      heroHTML = `<section class="section hero" style="min-height:100vh;pointer-events:none;"></section>`;
    }
  } else if (animMode === 'ambient') {
    if (variant === 'aurora-waves') {
      bgScript = `<div id="aurora-bg"></div>
        <style>
          #aurora-bg{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;
            background:radial-gradient(ellipse at 30% 50%,${theme.accent}33 0%,transparent 60%),radial-gradient(ellipse at 70% 30%,${theme.accentAlt}33 0%,transparent 50%);
            filter:blur(60px);animation:aurora 12s infinite alternate;pointer-events:none;}
          @keyframes aurora { from { transform: translate(0,0); } to { transform: translate(5%,5%); } }
        </style>`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.name || 'Portfolio'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root { 
      --bg: ${theme.bg}; --bg2: ${theme.bgSecondary}; --accent: ${theme.accent}; 
      --text: ${theme.text}; --text2: ${theme.textSecondary}; --card: ${theme.card}; 
      --gradient: ${theme.gradient};
      --font-main: 'Inter', sans-serif;
    }
    body { font-family: var(--font-main); background: var(--bg); color: var(--text); overflow-x: hidden; margin: 0; }
    .section { position: relative; z-index: 1; padding: 100px 5%; max-width: 1200px; margin: 0 auto; text-align: center; }
    .hero h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 8vw, 6rem); margin-bottom: 20px; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .skill-card { display: inline-block; padding: 12px 24px; background: var(--card); border-radius: 12px; margin: 8px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
    .project-card { background: var(--card); border-radius: 16px; padding: 30px; margin-bottom: 24px; text-align: left; border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(10px); transition: transform 0.3s; }
    .project-card:hover { transform: translateY(-5px); }
    .social-link { display: inline-block; margin: 8px; padding: 10px 20px; border-radius: 8px; background: var(--card); color: var(--text); text-decoration: none; border: 1px solid rgba(255,255,255,0.1); }
    ${extraCSS}
  </style>
</head>
<body>
  ${bgScript}
  ${heroHTML || `
    <section class="section hero" style="min-height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center;">
      ${data.profileImageUrl ? `<img src="${data.profileImageUrl}" style="width:140px;height:140px;border-radius:50%;object-fit:cover;border:3px solid var(--accent);margin-bottom:24px;box-shadow:0 10px 30px rgba(0,0,0,0.3);" />` : ''}
      <h1 class="fade-in">${data.name || 'Your Name'}</h1>
      <p style="font-size:1.4rem;color:var(--text2);margin-bottom:30px;">${data.bio || ''}</p>
    </section>
  `}
  <section class="section" id="skills">
    <h2 style="font-family:'Space Grotesk';font-size:3rem;margin-bottom:40px;">Expertise</h2>
    <div class="skills-grid">${skillsHTML}</div>
  </section>
  <section class="section" id="projects">
    <h2 style="font-family:'Space Grotesk';font-size:3rem;margin-bottom:40px;">Selected Projects</h2>
    <div class="projects-grid">${projectsHTML}</div>
  </section>
  <section class="section" id="contact">
    <h2 style="font-family:'Space Grotesk';font-size:2.5rem;margin-bottom:40px;">Get In Touch</h2>
    <div class="socials-grid">${socialsHTML}</div>
  </section>
</body>
</html>`;
}
