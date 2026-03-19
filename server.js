const express = require('express');
const cors = require('cors');
const multer = require('multer');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists — use /tmp/ on Vercel serverless (read-only filesystem bypass)
const uploadsDir = process.env.VERCEL 
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

// Serve uploaded files
app.use('/api/uploads', express.static(uploadsDir));

// Upload profile image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    success: true,
    filename: req.file.filename,
    url: `/api/uploads/${req.file.filename}`,
  });
});

// Theme color palettes
const THEME_PALETTES = {
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
    text: '#ffffff', textSecondary: '#c4b5fd', card: 'rgba(255,255,255,0.08)',
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

// Generate portfolio HTML
function generatePortfolioHTML(data) {
  const defaultTheme = THEME_PALETTES.dark;
  let theme = { ...(data.themePalette || THEME_PALETTES[data.theme] || defaultTheme) };
  
  // Apply custom primary color override
  if (data.customPrimaryColor) {
    theme.accent = data.customPrimaryColor;
    theme.gradient = `linear-gradient(135deg, ${data.customPrimaryColor}, ${theme.accentAlt || theme.accent})`;
  }

  // Auto-detect light backgrounds and ensure proper contrast
  const hexLuminance = (hex) => {
    if (!hex || !hex.startsWith('#')) return 0;
    const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    return 0.299*r + 0.587*g + 0.114*b;
  };
  const bgLum = hexLuminance(theme.bg);
  const isLightBg = bgLum > 0.5;
  if (isLightBg) {
    // Force dark text on light backgrounds for WCAG compliance
    theme.text = theme.text && hexLuminance(theme.text) < 0.4 ? theme.text : '#111111';
    theme.textSecondary = theme.textSecondary && hexLuminance(theme.textSecondary) < 0.55 ? theme.textSecondary : '#555555';
    theme.card = theme.card || 'rgba(0,0,0,0.04)';
  }

  const animMode = data.animationMode || 'ambient';
  const noAnim = animMode === 'no-animation';
  const variant = data.backgroundVariant || data.animationVariant || 'aurora-waves';
  const cursorEffect = data.cursorEffect || 'default';
  const soundEnabled = data.soundEnabled === true;

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

  // ──── PHYSICS MODE ────
  if (animMode === 'physics') {

    // Cursor effects for physics mode
    if (cursorEffect === 'magnetic') {
      cursorScript = `<script>
        document.querySelectorAll('a, button, .social-link, .project-card').forEach(el => {
          el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            el.style.transform = 'translate(' + x*0.3 + 'px,' + y*0.3 + 'px)';
          });
          el.addEventListener('mouseleave', () => { el.style.transform = ''; el.style.transition = 'transform 0.4s ease'; });
        });
      </script>`;
    } else if (cursorEffect === 'spotlight') {
      cursorScript = `<style>
        .spotlight-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9998; pointer-events:none; mask-image:radial-gradient(circle 150px, transparent 80%, black 100%); -webkit-mask-image:radial-gradient(circle 150px, transparent 80%, black 100%); }
      </style>
      <div class="spotlight-overlay" id="spotlight"></div>
      <script>
        document.addEventListener('mousemove', e => {
          const s = document.getElementById('spotlight');
          if(s) { s.style.maskPosition = (e.clientX-150)+'px '+(e.clientY-150)+'px'; s.style.webkitMaskPosition = (e.clientX-150)+'px '+(e.clientY-150)+'px'; }
        });
      </script>`;
    } else if (cursorEffect === 'vortex') {
      cursorScript = `<canvas id="cursor-canvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;pointer-events:none;"></canvas>
      <script>
        const cc = document.getElementById('cursor-canvas'), ctx = cc.getContext('2d');
        cc.width = innerWidth; cc.height = innerHeight;
        let pts = [];
        document.addEventListener('mousemove', e => {
          for(let i=0;i<3;i++) pts.push({x:e.clientX,y:e.clientY,a:Math.random()*Math.PI*2,r:Math.random()*20+5,life:1,color:'${theme.accent}'});
        });
        function drawVortex(){
          ctx.clearRect(0,0,cc.width,cc.height);
          pts.forEach((p,i) => { p.life -= 0.02; p.a += 0.1; p.x += Math.cos(p.a)*2; p.y += Math.sin(p.a)*2;
            if(p.life <= 0){pts.splice(i,1);return;}
            ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
            ctx.fillStyle = p.color + Math.floor(p.life*255).toString(16).padStart(2,'0');
            ctx.fill();
          });
          requestAnimationFrame(drawVortex);
        }
        drawVortex();
        addEventListener('resize',()=>{cc.width=innerWidth;cc.height=innerHeight;});
      </script>`;
    } else if (cursorEffect === 'ribbon') {
      cursorScript = `<canvas id="ribbon-canvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;pointer-events:none;"></canvas>
      <script>
        const rc = document.getElementById('ribbon-canvas'), rctx = rc.getContext('2d');
        rc.width = innerWidth; rc.height = innerHeight;
        let trail = [];
        document.addEventListener('mousemove', e => { trail.push({x:e.clientX,y:e.clientY}); if(trail.length>80)trail.shift(); });
        function drawRibbon(){
          rctx.clearRect(0,0,rc.width,rc.height);
          if(trail.length > 2){
            rctx.beginPath(); rctx.moveTo(trail[0].x,trail[0].y);
            for(let i=1;i<trail.length-1;i++){
              const xc=(trail[i].x+trail[i+1].x)/2, yc=(trail[i].y+trail[i+1].y)/2;
              rctx.quadraticCurveTo(trail[i].x,trail[i].y,xc,yc);
            }
            rctx.strokeStyle='${theme.accent}'; rctx.lineWidth=3; rctx.lineCap='round'; rctx.stroke();
          }
          requestAnimationFrame(drawRibbon);
        }
        drawRibbon();
        addEventListener('resize',()=>{rc.width=innerWidth;rc.height=innerHeight;});
      </script>`;
    }

    // Physics background variants
    if (variant === 'webgl-fluid') {
      bgScript = `<canvas id="fluid-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;"></canvas>
      <script>
        const canvas = document.getElementById('fluid-canvas');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if(gl){
          gl.viewport(0, 0, canvas.width, canvas.height);
          let t = 0;
          const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}';
          const fs = 'precision mediump float;uniform float t;uniform vec2 r;uniform vec2 m;void main(){vec2 uv=gl_FragCoord.xy/r;float d=length(uv-m/r);vec3 c1=vec3(${parseInt(theme.accent.slice(1,3),16)/255.0},${parseInt(theme.accent.slice(3,5),16)/255.0},${parseInt(theme.accent.slice(5,7),16)/255.0});vec3 c2=vec3(${parseInt(theme.accentAlt.slice(1,3),16)/255.0},${parseInt(theme.accentAlt.slice(3,5),16)/255.0},${parseInt(theme.accentAlt.slice(5,7),16)/255.0});float wave=sin(uv.x*10.0+t)*sin(uv.y*8.0+t*0.7)*0.5+0.5;vec3 col=mix(c1,c2,wave)*smoothstep(0.5,0.0,d)*0.6;gl_FragColor=vec4(col,1.0);}';
          function cs(t,s){const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);return sh;}
          const prog=gl.createProgram();gl.attachShader(prog,cs(gl.VERTEX_SHADER,vs));gl.attachShader(prog,cs(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);gl.useProgram(prog);
          const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
          const p=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
          const tU=gl.getUniformLocation(prog,'t'),rU=gl.getUniformLocation(prog,'r'),mU=gl.getUniformLocation(prog,'m');
          let mx=canvas.width/2,my=canvas.height/2;
          document.addEventListener('mousemove',e=>{mx=e.clientX;my=canvas.height-e.clientY;});
          function render(){t+=0.016;gl.uniform1f(tU,t);gl.uniform2f(rU,canvas.width,canvas.height);gl.uniform2f(mU,mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(render);}
          render();
        }
        addEventListener('resize',()=>{canvas.width=innerWidth;canvas.height=innerHeight;if(gl)gl.viewport(0,0,canvas.width,canvas.height);});
      </script>`;

    } else if (variant === 'lanyard-card') {
      bgScript = `<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
<script>
  let w=innerWidth,h=innerHeight;
  const {Engine,Render,Runner,Composite,Bodies,Constraint,Mouse,MouseConstraint,Events,Body}=Matter;
  const engine=Engine.create(),world=engine.world;
  const render=Render.create({element:document.getElementById('physics-bg'),engine,options:{width:w,height:h,wireframes:false,background:'transparent'}});
  Render.run(render);Runner.run(Runner.create(),engine);
  const lanyardEl=document.getElementById('lanyard-card');
  const cardBody=Bodies.rectangle(w/2,250,300,450,{render:{visible:false},density:0.05,frictionAir:0.02});
  const anchor={x:w/2,y:-50};
  const rope=Constraint.create({pointA:anchor,bodyB:cardBody,pointB:{x:0,y:-180},stiffness:0.05,damping:0.01,render:{visible:true,strokeStyle:'${theme.accentAlt}',lineWidth:3}});
  Composite.add(world,[cardBody,rope]);
  Events.on(engine,'afterUpdate',()=>{if(cardBody&&lanyardEl)lanyardEl.style.transform='translate(-50%,-50%) translate('+cardBody.position.x+'px,'+cardBody.position.y+'px) rotate('+cardBody.angle+'rad)';});
  for(let i=0;i<12;i++){
    Composite.add(world,Bodies.circle(Math.random()*w,Math.random()*-1000,Math.random()*20+20,{restitution:0.8,render:{fillStyle:Math.random()>0.5?'${theme.accent}':'${theme.accentAlt}'}}));
  }
  const ground=Bodies.rectangle(w/2,h+50,w*2,100,{isStatic:true,render:{visible:false}});
  const wallL=Bodies.rectangle(-50,h/2,100,h*2,{isStatic:true,render:{visible:false}});
  const wallR=Bodies.rectangle(w+50,h/2,100,h*2,{isStatic:true,render:{visible:false}});
  Composite.add(world,[ground,wallL,wallR]);
  const mouse=Mouse.create(render.canvas),mc=MouseConstraint.create(engine,{mouse,constraint:{stiffness:0.1,render:{visible:false}}});
  Composite.add(world,mc);render.mouse=mouse;
  addEventListener('resize',()=>{w=innerWidth;h=innerHeight;render.canvas.width=w;render.canvas.height=h;Body.setPosition(ground,{x:w/2,y:h+50});});
  addEventListener('scroll', ()=>{
    const opacity = Math.max(0, 1 - window.scrollY / 300);
    if(lanyardEl) lanyardEl.style.opacity = opacity;
    const physicsBg = document.getElementById('physics-bg');
    if(physicsBg) physicsBg.style.opacity = opacity;
  });
</script>`;
      extraCSS += `
        #physics-bg{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:auto;}
        #lanyard-card{position:fixed;top:0;left:0;width:300px;height:450px;background:var(--card);border:1px solid rgba(255,255,255,0.1);border-radius:16px;backdrop-filter:blur(10px);padding:30px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10;pointer-events:none;box-shadow:0 20px 40px rgba(0,0,0,0.3);}
        #physics-clip{position:absolute;top:10px;width:40px;height:15px;background:rgba(255,255,255,0.8);border-radius:4px;}
        #physics-hole{position:absolute;top:14px;width:15px;height:5px;background:#222;border-radius:20px;}`;
      heroHTML = `
        <div id="physics-bg"></div>
        <div id="lanyard-card">
          <div id="physics-clip"></div><div id="physics-hole"></div>
          ${data.profileImage ? `<img src="${data.profileImage}" style="width:120px;height:120px;border-radius:50%;margin-bottom:20px;border:3px solid var(--accent);object-fit:cover;"/>` : `<div style="width:120px;height:120px;border-radius:50%;background:var(--accent);margin-bottom:20px;"></div>`}
          <h2 style="font-family:'Space Grotesk',sans-serif;font-size:1.5rem;text-align:center;margin-bottom:10px;">${data.name || 'Your Name'}</h2>
          <p style="text-align:center;color:var(--text2);font-weight:500;">${data.portfolioType || 'Developer'}</p>
          <p style="text-align:center;font-size:0.8rem;margin-top:20px;color:var(--text);opacity:0.8;">${data.bio || ''}</p>
          <button onclick="window.scrollTo({top: window.innerHeight, behavior: 'smooth'})" style="pointer-events:auto; margin-top:25px; padding:10px 24px; border-radius:8px; border:none; background:var(--accent); color:${isLightBg && hexLuminance(theme.accent) > 0.5 ? '#111' : '#fff'}; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:0.9rem; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">View Portfolio</button>
        </div>
        <section class="section hero" style="min-height:100vh;pointer-events:none;"></section>`;

    } else if (variant === 'particle-explosion') {
      bgScript = `<canvas id="part-canvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>
      <script>
        const pc=document.getElementById('part-canvas'),pctx=pc.getContext('2d');
        pc.width=innerWidth;pc.height=innerHeight;
        let particles=[];
        for(let i=0;i<200;i++)particles.push({x:Math.random()*pc.width,y:Math.random()*pc.height,vx:0,vy:0,r:Math.random()*3+1,c:Math.random()>0.5?'${theme.accent}':'${theme.accentAlt}'});
        let pmx=pc.width/2,pmy=pc.height/2;
        document.addEventListener('mousemove',e=>{pmx=e.clientX;pmy=e.clientY;});
        document.addEventListener('click',e=>{for(let i=0;i<30;i++){const a=Math.random()*Math.PI*2;particles.push({x:e.clientX,y:e.clientY,vx:Math.cos(a)*Math.random()*8,vy:Math.sin(a)*Math.random()*8,r:Math.random()*4+2,c:Math.random()>0.5?'${theme.accent}':'${theme.accentAlt}',life:1});}});
        function animP(){pctx.clearRect(0,0,pc.width,pc.height);particles.forEach((p,i)=>{
          if(p.life!==undefined){p.life-=0.02;if(p.life<=0){particles.splice(i,1);return;}}
          const dx=pmx-p.x,dy=pmy-p.y,dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<150&&dist>1){p.vx-=dx/dist*0.5;p.vy-=dy/dist*0.5;}
          p.vx*=0.98;p.vy*=0.98;p.x+=p.vx;p.y+=p.vy;
          if(p.x<0)p.x=pc.width;if(p.x>pc.width)p.x=0;if(p.y<0)p.y=pc.height;if(p.y>pc.height)p.y=0;
          const alpha=p.life!==undefined?p.life:0.6;
          pctx.beginPath();pctx.arc(p.x,p.y,p.r,0,Math.PI*2);pctx.fillStyle=p.c+Math.floor(alpha*255).toString(16).padStart(2,'0');pctx.fill();
        });requestAnimationFrame(animP);}
        animP();
        addEventListener('resize',()=>{pc.width=innerWidth;pc.height=innerHeight;});
      </script>`;

    } else if (variant === 'cursor-ripple') {
      bgScript = `<canvas id="ripple-canvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>
      <script>
        const rpc=document.getElementById('ripple-canvas'),rpctx=rpc.getContext('2d');
        rpc.width=innerWidth;rpc.height=innerHeight;
        let ripples=[];
        document.addEventListener('mousemove',e=>{if(Math.random()>0.7)ripples.push({x:e.clientX,y:e.clientY,r:0,maxR:80+Math.random()*60,life:1});});
        document.addEventListener('click',e=>{ripples.push({x:e.clientX,y:e.clientY,r:0,maxR:200,life:1});});
        function animR(){rpctx.clearRect(0,0,rpc.width,rpc.height);
          ripples=ripples.filter(r=>{r.r+=2;r.life=1-r.r/r.maxR;if(r.life<=0)return false;
            rpctx.beginPath();rpctx.arc(r.x,r.y,r.r,0,Math.PI*2);rpctx.strokeStyle='${theme.accent}'+Math.floor(r.life*180).toString(16).padStart(2,'0');rpctx.lineWidth=2;rpctx.stroke();return true;});
          requestAnimationFrame(animR);
        }
        animR();
        addEventListener('resize',()=>{rpc.width=innerWidth;rpc.height=innerHeight;});
      </script>`;

    } else if (variant === 'heat-distortion') {
      bgScript = `<canvas id="heat-canvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>
      <script>
        const hc=document.getElementById('heat-canvas'),hctx=hc.getContext('2d');
        hc.width=innerWidth;hc.height=innerHeight;
        let ht=0,hmx=innerWidth/2,hmy=innerHeight/2;
        document.addEventListener('mousemove',e=>{hmx=e.clientX;hmy=e.clientY;});
        function animH(){ht+=0.02;hctx.clearRect(0,0,hc.width,hc.height);
          for(let y=0;y<hc.height;y+=8){for(let x=0;x<hc.width;x+=8){
            const dx=x-hmx,dy=y-hmy,dist=Math.sqrt(dx*dx+dy*dy);
            const intensity=Math.max(0,1-dist/300);
            const offset=Math.sin(y*0.05+ht*3)*intensity*4;
            const alpha=intensity*0.08;
            if(alpha>0.01){hctx.fillStyle='${theme.accent}'+Math.floor(alpha*255).toString(16).padStart(2,'0');hctx.fillRect(x+offset,y,6,6);}
          }}
          requestAnimationFrame(animH);
        }
        animH();
        addEventListener('resize',()=>{hc.width=innerWidth;hc.height=innerHeight;});
      </script>`;

    } else if (variant === 'photo-wall-3d') {
      extraCSS += `
        #photo-wall{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;perspective:1200px;overflow:hidden;}
        .pw-card{position:absolute;width:200px;height:130px;background:var(--card);border:1px solid rgba(255,255,255,0.08);border-radius:10px;backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);font-size:0.8rem;box-shadow:0 8px 30px rgba(0,0,0,0.2);}`;
      const pwCards = (data.projects || []).map((p, i) => {
        const x = 10 + (i % 4) * 24;
        const y = 15 + Math.floor(i / 4) * 35;
        const rY = (Math.random() - 0.5) * 30;
        const rX = (Math.random() - 0.5) * 15;
        return `<div class="pw-card" style="left:${x}%;top:${y}%;transform:rotateY(${rY}deg) rotateX(${rX}deg);">${p.title || 'Project'}</div>`;
      }).join('');
      bgScript = `<div id="photo-wall">${pwCards}</div>
      <script>
        document.addEventListener('mousemove',e=>{
          const pw=document.getElementById('photo-wall');
          const rx=(e.clientY/innerHeight-0.5)*10;
          const ry=(e.clientX/innerWidth-0.5)*-10;
          pw.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)';
        });
      </script>`;

    } else if (variant === 'depth-parallax') {
      bgScript = `<div id="parallax-bg" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;">
        <div id="pl1" style="position:absolute;width:100%;height:100%;"></div>
        <div id="pl2" style="position:absolute;width:100%;height:100%;"></div>
        <div id="pl3" style="position:absolute;width:100%;height:100%;"></div>
      </div>
      <script>
        ['pl1','pl2','pl3'].forEach((id,i)=>{
          const el=document.getElementById(id);
          for(let j=0;j<(8-i*2);j++){
            const d=document.createElement('div');
            const s=Math.random()*60+20;
            d.style.cssText='position:absolute;width:'+s+'px;height:'+s+'px;border-radius:50%;background:${theme.accent}'+(20+i*10).toString(16).padStart(2,'0')+';left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;';
            el.appendChild(d);
          }
        });
        document.addEventListener('mousemove',e=>{
          const x=(e.clientX/innerWidth-0.5);
          const y=(e.clientY/innerHeight-0.5);
          document.getElementById('pl1').style.transform='translate('+(x*10)+'px,'+(y*10)+'px)';
          document.getElementById('pl2').style.transform='translate('+(x*25)+'px,'+(y*25)+'px)';
          document.getElementById('pl3').style.transform='translate('+(x*45)+'px,'+(y*45)+'px)';
        });
      </script>`;
    }

    // Default hero for physics if not lanyard
    if (variant !== 'lanyard-card') {
      heroHTML = `
        <section class="section hero">
          ${data.profileImage ? `<img class="hero-avatar fade-in" src="${data.profileImage}" alt="${data.name}" />` : ''}
          <span class="hero-badge fade-in">${data.portfolioType || 'Developer'} Portfolio</span>
          <h1 class="fade-in">${data.name || 'Your Name'}</h1>
          <p class="fade-in">${data.bio || 'Welcome to my portfolio. I create amazing digital experiences.'}</p>
        </section>`;
    }

  // ──── AMBIENT MODE ────
  } else if (animMode === 'ambient') {

    if (variant === 'aurora-waves') {
      bgScript = `<div id="aurora-bg"></div>
        <style>
          #aurora-bg{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;
            background:radial-gradient(ellipse at 30% 50%,${theme.accent}33 0%,transparent 60%),radial-gradient(ellipse at 70% 30%,${theme.accentAlt}33 0%,transparent 50%),radial-gradient(ellipse at 50% 80%,${theme.accent}22 0%,transparent 40%);
            filter:blur(60px);animation:aurora 12s infinite alternate;pointer-events:none;}
          @keyframes aurora{0%{transform:scale(1) translate(0,0);opacity:0.6;}50%{transform:scale(1.15) translate(5%,-5%);opacity:0.8;}100%{transform:scale(1.05) translate(-3%,8%);opacity:0.5;}}
        </style>`;
    } else if (variant === 'morphing-blob') {
      bgScript = `<div id="blobBg" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;filter:blur(60px);opacity:0.45;pointer-events:none;">
          <div style="position:absolute;top:15%;left:15%;width:45vw;height:45vw;background:${theme.accent};border-radius:30% 70% 70% 30%/30% 30% 70% 70%;mix-blend-mode:screen;animation:blob1 12s infinite alternate;"></div>
          <div style="position:absolute;top:45%;left:50%;width:35vw;height:35vw;background:${theme.accentAlt};border-radius:70% 30% 30% 70%/70% 70% 30% 30%;mix-blend-mode:screen;animation:blob2 14s infinite alternate-reverse;"></div>
          <div style="position:absolute;top:60%;left:20%;width:25vw;height:25vw;background:${theme.accent};border-radius:50%;mix-blend-mode:screen;animation:blob3 10s infinite alternate;opacity:0.5;"></div>
        </div>
        <style>
          @keyframes blob1{0%{transform:scale(1) translate(0,0);border-radius:30% 70% 70% 30%/30% 30% 70% 70%;}100%{transform:scale(1.1) translate(10%,-10%);border-radius:70% 30% 30% 70%/70% 70% 30% 30%;}}
          @keyframes blob2{0%{transform:scale(1) translate(0,0);}100%{transform:scale(0.9) translate(-15%,10%);}}
          @keyframes blob3{0%{transform:scale(1) translate(0,0);}100%{transform:scale(1.2) translate(20%,-15%);}}
        </style>`;
    } else if (variant === 'water-ripple') {
      bgScript = `<canvas id="water-canvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>
      <script>
        const wc=document.getElementById('water-canvas'),wctx=wc.getContext('2d');
        wc.width=innerWidth;wc.height=innerHeight;
        let wRipples=[],wt=0;
        function addAutoRipple(){wRipples.push({x:Math.random()*wc.width,y:Math.random()*wc.height,r:0,maxR:120+Math.random()*100,life:1});}
        setInterval(addAutoRipple,2000);addAutoRipple();
        function animW(){wt+=0.01;wctx.clearRect(0,0,wc.width,wc.height);
          wRipples=wRipples.filter(r=>{r.r+=1;r.life=1-r.r/r.maxR;if(r.life<=0)return false;
            wctx.beginPath();wctx.arc(r.x,r.y,r.r,0,Math.PI*2);wctx.strokeStyle='${theme.accent}'+Math.floor(r.life*100).toString(16).padStart(2,'0');wctx.lineWidth=2;wctx.stroke();
            wctx.beginPath();wctx.arc(r.x,r.y,r.r*0.7,0,Math.PI*2);wctx.strokeStyle='${theme.accentAlt}'+Math.floor(r.life*60).toString(16).padStart(2,'0');wctx.lineWidth=1;wctx.stroke();
            return true;});
          requestAnimationFrame(animW);
        }
        animW();
        addEventListener('resize',()=>{wc.width=innerWidth;wc.height=innerHeight;});
      </script>`;
    } else if (variant === 'bokeh-orbs') {
      bgScript = `<div id="bokeh-bg"></div>
        <style>
          #bokeh-bg{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;}
          .bokeh{position:absolute;border-radius:50%;filter:blur(20px);animation:bFloat 15s infinite ease-in-out alternate;}
          @keyframes bFloat{0%{transform:translateY(0) scale(1);}50%{transform:translateY(-60px) scale(1.15);}100%{transform:translateY(20px) scale(0.9);}}
        </style>
        <script>
          const bC=document.getElementById('bokeh-bg');
          for(let i=0;i<18;i++){
            const d=document.createElement('div');d.className='bokeh';
            const s=Math.random()*120+40;
            d.style.width=d.style.height=s+'px';
            d.style.left=Math.random()*100+'%';d.style.top=Math.random()*100+'%';
            d.style.animationDuration=(Math.random()*12+10)+'s';
            d.style.animationDelay=(Math.random()*-15)+'s';
            d.style.opacity=Math.random()*0.15+0.05;
            d.style.background=Math.random()>0.5?'${theme.accent}':'${theme.accentAlt}';
            bC.appendChild(d);
          }
        </script>`;
    } else if (variant === 'constellation') {
      bgScript = `<canvas id="const-canvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>
      <script>
        const csc=document.getElementById('const-canvas'),csctx=csc.getContext('2d');
        csc.width=innerWidth;csc.height=innerHeight;
        const stars=[];for(let i=0;i<100;i++)stars.push({x:Math.random()*csc.width,y:Math.random()*csc.height,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*2+1});
        function animC(){csctx.clearRect(0,0,csc.width,csc.height);
          stars.forEach(s=>{s.x+=s.vx;s.y+=s.vy;
            if(s.x<0)s.x=csc.width;if(s.x>csc.width)s.x=0;if(s.y<0)s.y=csc.height;if(s.y>csc.height)s.y=0;
            csctx.beginPath();csctx.arc(s.x,s.y,s.r,0,Math.PI*2);csctx.fillStyle='${theme.accent}99';csctx.fill();
          });
          stars.forEach((a,i)=>{stars.forEach((b,j)=>{if(i>=j)return;
            const d=Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2);
            if(d<120){csctx.beginPath();csctx.moveTo(a.x,a.y);csctx.lineTo(b.x,b.y);csctx.strokeStyle='${theme.accentAlt}'+Math.floor((1-d/120)*40).toString(16).padStart(2,'0');csctx.lineWidth=0.5;csctx.stroke();}
          });});
          requestAnimationFrame(animC);}
        animC();
        addEventListener('resize',()=>{csc.width=innerWidth;csc.height=innerHeight;});
      </script>`;
    } else if (variant === 'svg-draw') {
      bgScript = `<svg id="svg-draw" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;" viewBox="0 0 1200 800">
        <path d="M100,400 Q300,100 500,400 T900,400" stroke="${theme.accent}44" fill="none" stroke-width="2" class="draw-path"/>
        <path d="M50,200 Q350,500 650,200 T1150,200" stroke="${theme.accentAlt}44" fill="none" stroke-width="1.5" class="draw-path"/>
        <path d="M200,600 Q500,300 800,600 T1100,500" stroke="${theme.accent}33" fill="none" stroke-width="1" class="draw-path"/>
        <circle cx="300" cy="300" r="80" stroke="${theme.accent}22" fill="none" stroke-width="1" class="draw-path"/>
        <circle cx="800" cy="500" r="120" stroke="${theme.accentAlt}22" fill="none" stroke-width="1" class="draw-path"/>
      </svg>
      <style>
        .draw-path{stroke-dasharray:2000;stroke-dashoffset:2000;animation:drawLine 4s ease forwards;}
        .draw-path:nth-child(2){animation-delay:0.5s;}.draw-path:nth-child(3){animation-delay:1s;}.draw-path:nth-child(4){animation-delay:1.5s;}.draw-path:nth-child(5){animation-delay:2s;}
        @keyframes drawLine{to{stroke-dashoffset:0;}}
      </style>`;
    }

    // Ambient hero
    heroHTML = `
      <section class="section hero">
        ${data.profileImage ? `<img class="hero-avatar fade-in" src="${data.profileImage}" alt="${data.name}" />` : ''}
        <span class="hero-badge fade-in">${data.portfolioType || 'Developer'} Portfolio</span>
        <h1 class="fade-in">${data.name || 'Your Name'}</h1>
        <p class="fade-in">${data.bio || 'Welcome to my portfolio. I create amazing digital experiences.'}</p>
      </section>`;

  // ──── NO ANIMATION ────
  } else {
    if (variant === 'static-gradient') {
      extraCSS += `body { background: linear-gradient(135deg, var(--bg), var(--bg2), var(--bg)); background-attachment: fixed; }`;
    } else if (variant === 'static-grid') {
      extraCSS += `body { background-color: var(--bg); background-image: linear-gradient(var(--card) 1px, transparent 1px), linear-gradient(90deg, var(--card) 1px, transparent 1px); background-size: 40px 40px; }`;
    } else if (variant === 'static-dots') {
      extraCSS += `body { background-color: var(--bg); background-image: radial-gradient(var(--card) 2px, transparent 2px); background-size: 30px 30px; }`;
    }

    heroHTML = `
      <section class="section hero">
        ${data.profileImage ? `<img class="hero-avatar" src="${data.profileImage}" alt="${data.name}" />` : ''}
        <span class="hero-badge">${data.portfolioType || 'Developer'} Portfolio</span>
        <h1>${data.name || 'Your Name'}</h1>
        <p>${data.bio || 'Welcome to my portfolio. I create amazing digital experiences.'}</p>
      </section>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.name || 'Portfolio'} — ${data.portfolioType || 'Developer'} Portfolio</title>
  <meta name="description" content="${data.name || 'Portfolio'} is a ${data.portfolioType || 'developer'}${(data.skills || []).length > 0 ? ' specializing in ' + (data.skills || []).slice(0,3).join(', ') : ''}. ${data.bio || 'View portfolio, projects and contact information.'}">
  <meta name="keywords" content="${data.name || 'Portfolio'}, ${data.portfolioType || 'developer'}, portfolio${(data.skills || []).length > 0 ? ', ' + (data.skills || []).join(', ') : ''}">
  <meta name="author" content="${data.name || 'Portfolio'}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="${theme.accent}">
  <!-- Open Graph -->
  <meta property="og:title" content="${data.name || 'Portfolio'} — ${data.portfolioType || 'Developer'}">
  <meta property="og:description" content="${data.bio || 'View my portfolio, projects and contact information.'}">
  <meta property="og:type" content="website">
  ${data.profileImage ? `<meta property="og:image" content="${data.profileImage}">` : ''}
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${data.name || 'Portfolio'} — ${data.portfolioType || 'Developer'}">
  <meta name="twitter:description" content="${data.bio || 'View my portfolio, projects and contact information.'}">
  ${data.profileImage ? `<meta name="twitter:image" content="${data.profileImage}">` : ''}
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --bg: ${theme.bg}; --bg2: ${theme.bgSecondary}; --accent: ${theme.accent};
      --accent-alt: ${theme.accentAlt}; --text: ${theme.text}; --text2: ${theme.textSecondary};
      --card: ${theme.card}; --gradient: ${theme.gradient};
    }
    html { scroll-behavior: smooth; }
    body { font-family: ${theme.font === 'monospace' ? '"Fira Code", "Courier New", monospace' : theme.font === 'serif' ? '"Merriweather", "Georgia", serif' : "'Inter', sans-serif"}; background: var(--bg); color: var(--text); overflow-x: hidden; }

    .section { position: relative; z-index: 1; padding: 100px 5%; max-width: 1200px; margin: 0 auto; }

    /* Hero */
    .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
    .hero-badge { display: inline-block; padding: 8px 20px; border-radius: 50px; background: var(--card); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); font-size: 0.875rem; color: var(--text2); margin-bottom: 24px; }
    .hero h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 8vw, 6rem); font-weight: 800; line-height: 1.1; margin-bottom: 20px; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero p { font-size: 1.25rem; color: var(--text2); max-width: 600px; line-height: 1.7; }
    ${data.profileImage ? `.hero-avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent); margin-bottom: 24px; }` : ''}

    /* About */
    .about-content { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .about-text h2 { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; font-weight: 700; margin-bottom: 20px; }
    .about-text p { color: var(--text2); line-height: 1.8; font-size: 1.05rem; }

    /* Skills */
    .skills-grid { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-top: 40px; }
    .skill-card { padding: 14px 28px; border-radius: 12px; background: var(--card); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px); font-weight: 500; cursor: default; }
    ${!noAnim ? `.skill-card { transition: all 0.3s ease; } .skill-card:hover { transform: translateY(-4px) scale(1.05); border-color: var(--accent); box-shadow: 0 8px 30px rgba(124,58,237,0.2); }` : ''}
    .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; font-weight: 700; text-align: center; margin-bottom: 16px; }
    .section-subtitle { text-align: center; color: var(--text2); font-size: 1.1rem; margin-bottom: 40px; }

    /* Projects */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 30px; margin-top: 40px; }
    .project-card { border-radius: 16px; background: var(--card); border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(10px); overflow: hidden; }
    ${!noAnim ? `.project-card { transition: all 0.4s ease; } .project-card:hover { transform: translateY(-8px); border-color: var(--accent); box-shadow: 0 20px 60px rgba(124,58,237,0.15); } .project-content a { transition: opacity 0.3s; } .project-content a:hover { opacity: 0.8; }` : ''}
    .project-content { padding: 30px; }
    .project-content h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; margin-bottom: 12px; }
    .project-content p { color: var(--text2); line-height: 1.7; margin-bottom: 16px; }
    .project-content a { color: var(--accent); text-decoration: none; font-weight: 600; }

    /* Contact */
    .contact-info { text-align: center; margin-top: 30px; }
    .contact-info p { font-size: 1.1rem; color: var(--text2); margin-bottom: 10px; }
    .contact-info a { color: var(--accent); text-decoration: none; }
    .social-links { display: flex; gap: 16px; justify-content: center; margin-top: 30px; }
    .social-link { padding: 10px 24px; border-radius: 8px; background: var(--card); border: 1px solid rgba(255,255,255,0.08); color: var(--text); text-decoration: none; font-weight: 500; text-transform: capitalize; }
    ${!noAnim ? `.social-link { transition: all 0.3s ease; } .social-link:hover { border-color: var(--accent); transform: translateY(-2px); }` : ''}

    /* Footer */
    footer { text-align: center; padding: 40px; color: var(--text2); font-size: 0.875rem; position: relative; z-index: 1; border-top: 1px solid rgba(255,255,255,0.05); }

    /* Animations */
    ${!noAnim ? `.fade-in { opacity: 0; transform: translateY(30px); transition: all 0.8s ease; } .fade-in.visible { opacity: 1; transform: translateY(0); }` : '.fade-in { opacity: 1; }'}

    ${extraCSS}

    @media (max-width: 768px) {
      .about-content { grid-template-columns: 1fr; }
      .projects-grid { grid-template-columns: 1fr; }
      .section { padding: 60px 5%; }
    }
  </style>
</head>
<body>
  ${soundEnabled ? `
  <!-- Ambient Audio -->
  <audio id="ambient-audio" loop src="https://assets.mixkit.co/active_storage/sfx/228/228-preview.mp3"></audio>
  <button onclick="document.getElementById('ambient-audio').paused ? document.getElementById('ambient-audio').play() : document.getElementById('ambient-audio').pause()" style="position:fixed; bottom:20px; right:20px; z-index:100; background:var(--card); border:1px solid rgba(255,255,255,0.1); color:var(--text); padding:8px 12px; border-radius:20px; cursor:pointer; font-family:inherit; font-size:0.8rem; backdrop-filter:blur(10px);">🎵 Toggle Sound</button>
  ` : ''}

  ${heroHTML}

  <section class="section" id="about">
    <div class="about-content">
      <div class="about-text fade-in">
        <h2>About Me</h2>
        <p>${data.about || 'I am a passionate creator focused on building exceptional digital products and experiences.'}</p>
      </div>
    </div>
  </section>

  <section class="section" id="skills">
    <h2 class="section-title fade-in">Skills & Expertise</h2>
    <p class="section-subtitle fade-in">Technologies and tools I work with</p>
    <div class="skills-grid">${skillsHTML}</div>
  </section>

  <section class="section" id="projects">
    <h2 class="section-title fade-in">Featured Projects</h2>
    <p class="section-subtitle fade-in">A selection of my recent work</p>
    <div class="projects-grid">${projectsHTML}</div>
  </section>

  <section class="section" id="contact">
    <h2 class="section-title fade-in">Get In Touch</h2>
    <p class="section-subtitle fade-in">Let's work together on something great</p>
    <div class="contact-info fade-in">
      ${data.contact?.email ? `<p>📧 <a href="mailto:${data.contact.email}">${data.contact.email}</a></p>` : ''}
      ${data.contact?.phone ? `<p>📱 ${data.contact.phone}</p>` : ''}
      ${data.contact?.location ? `<p>📍 ${data.contact.location}</p>` : ''}
    </div>
    <div class="social-links fade-in">${socialsHTML}</div>
  </section>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${data.name || 'Portfolio'}. All rights reserved.</p>
  </footer>

  ${!noAnim ? `
  <!-- Floating Background Elements -->
  <div id="floating-bg" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;"></div>
  <script>
    (function(){
      const container = document.getElementById('floating-bg');
      if(!container) return;
      const colors = ['${theme.accent}', '${theme.accentAlt}'];
      for(let i=0; i<6; i++){
        const orb = document.createElement('div');
        const size = Math.random()*200+100;
        const color = colors[i % colors.length];
        orb.style.cssText = 'position:absolute;border-radius:50%;filter:blur(80px);opacity:0.08;animation:floatOrb '+(15+Math.random()*20)+'s ease-in-out infinite alternate;';
        orb.style.width = size+'px';
        orb.style.height = size+'px';
        orb.style.background = color;
        orb.style.left = Math.random()*100+'%';
        orb.style.top = Math.random()*100+'%';
        orb.style.animationDelay = -(Math.random()*20)+'s';
        container.appendChild(orb);
      }
    })();
  </script>
  <style>
    @keyframes floatOrb {
      0% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -40px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(10px, -10px) scale(1.05); }
    }
  </style>
  ` : ''}

  ${!noAnim ? `
  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    document.querySelectorAll('.project-card, .skill-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const centerX = rect.width / 2, centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20, rotateY = (centerX - x) / 20;
        card.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) translateY(-8px)\`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  </script>
  ` : ''}
  ${bgScript}
  ${cursorScript}
</body>
</html>`;
}

// Generate portfolio endpoint
app.post('/api/generate', (req, res) => {
  try {
    if (req.body.profileImageUrl) {
      req.body.profileImage = req.body.profileImageUrl;
    }
    const html = generatePortfolioHTML(req.body);
    res.json({ success: true, html });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper — fetch external URL and return base64 data URI
async function fetchAsBase64(url) {
  const https = require('https');
  const http  = require('http');
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const mime = res.headers['content-type'] || 'image/svg+xml';
        resolve(`data:${mime};base64,${buf.toString('base64')}`);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Generate initials avatar SVG as fallback
function initialsAvatar(name, color = '#7C3AED') {
  const initial = name ? name[0].toUpperCase() : '?';
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <circle cx="100" cy="100" r="100" fill="${color}"/>
      <text x="100" y="100" font-family="sans-serif" font-size="80" font-weight="bold"
        fill="white" text-anchor="middle" dominant-baseline="central">${initial}</text>
    </svg>`
  )}`;
}

// Download portfolio as zip
app.post('/api/download', async (req, res) => {
  try {
    let imageFilename = '';
    const originalUrl = req.body.profileImageUrl;

    if (originalUrl && originalUrl.startsWith('/api/uploads/')) {
      // Locally uploaded file — embed relative path and bundle file in ZIP
      imageFilename = 'profile' + path.extname(originalUrl);
      req.body.profileImage = './' + imageFilename;
    } else if (originalUrl && (originalUrl.startsWith('http://') || originalUrl.startsWith('https://'))) {
      // External URL (DiceBear, etc.) — fetch and embed as base64 so ZIP works offline
      try {
        const base64 = await fetchAsBase64(originalUrl);
        req.body.profileImage = base64;
      } catch (e) {
        console.warn('Avatar fetch failed, using initials fallback:', e.message);
        req.body.profileImage = initialsAvatar(req.body.name, '#7C3AED');
      }
    } else if (!originalUrl) {
      // No image — generate initials avatar
      req.body.profileImage = initialsAvatar(req.body.name, '#7C3AED');
    }

    const html = generatePortfolioHTML(req.body);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=portfolio.zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    archive.append(html, { name: 'index.html' });
    archive.append('# Portfolio\nGenerated with PortfolioCraft AI Builder', { name: 'README.md' });

    // Bundle local uploaded image file if present
    if (imageFilename) {
      const originalFilename = originalUrl.replace('/api/uploads/', '');
      const filepath = path.join(uploadsDir, originalFilename);
      if (fs.existsSync(filepath)) {
        archive.file(filepath, { name: imageFilename });
      }
    }

    archive.finalize();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get theme palettes
app.get('/api/themes', (req, res) => {
  res.json(THEME_PALETTES);
});

// Serve static client build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

// Only listen if not running in a serverless environment like Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n  🚀 PortfolioCraft API running at http://localhost:${PORT}\n`);
  });
}

// Export for Vercel
module.exports = app;
