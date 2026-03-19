// portfolioGenerator.js — CSS-Primary Animation Engine
// All animations use CSS first, Canvas 2D as enhancement (no WebGL dependency)

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

export function generatePortfolioHTML(data) {
  const defaultTheme = THEME_PALETTES.dark;
  let theme = { ...(data.themePalette || THEME_PALETTES[data.theme] || defaultTheme) };

  if (data.customPrimaryColor) {
    theme.accent = data.customPrimaryColor;
    theme.gradient = `linear-gradient(135deg, ${data.customPrimaryColor}, ${theme.accentAlt || theme.accent})`;
  }

  const hexLuminance = (hex) => {
    if (!hex || !hex.startsWith('#')) return 0;
    const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };
  const isLightBg = hexLuminance(theme.bg) > 0.5;
  if (isLightBg) {
    theme.text = (theme.text && hexLuminance(theme.text) < 0.4) ? theme.text : '#111111';
    theme.textSecondary = (theme.textSecondary && hexLuminance(theme.textSecondary) < 0.55) ? theme.textSecondary : '#555555';
    theme.card = theme.card || 'rgba(0,0,0,0.04)';
  }

  const animMode = data.animationMode || 'ambient';
  const variant = data.backgroundVariant || 'aurora-waves';
  const noAnim = animMode === 'no-animation';

  const skillsHTML = (data.skills || []).map((skill, i) =>
    `<div class="skill-chip" style="animation-delay:${0.3 + i * 0.07}s">${skill}</div>`
  ).join('');

  const projectsHTML = (data.projects || []).map((p, i) =>
    `<div class="project-card" style="animation-delay:${0.5 + i * 0.12}s">
      <div class="project-inner">
        <h3>${p.title || 'Project'}</h3>
        <p>${p.description || ''}</p>
        ${p.link ? `<a class="project-link" href="${p.link}" target="_blank">View Project →</a>` : ''}
      </div>
    </div>`
  ).join('');

  const socialsHTML = Object.entries(data.socials || {}).filter(([, v]) => v).map(([k, url]) =>
    `<a class="social-btn" href="${url}" target="_blank">${k.charAt(0).toUpperCase() + k.slice(1)}</a>`
  ).join('');

  // ─── BACKGROUND SYSTEMS ───────────────────────────────────────────
  let bgHTML = '';
  let bgCSS = '';
  let bgJS = '';

  if (!noAnim) {
    if (animMode === 'ambient' || variant === 'aurora-waves') {
      // Pure CSS aurora — always works, zero dependencies
      bgHTML = `<div class="aurora-container">
        <div class="aurora-orb o1"></div>
        <div class="aurora-orb o2"></div>
        <div class="aurora-orb o3"></div>
      </div>`;
      bgCSS = `
        .aurora-container { position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;overflow:hidden;pointer-events:none; }
        .aurora-orb { position:absolute;border-radius:50%;filter:blur(100px);opacity:0.35;will-change:transform; }
        .o1 { width:70vmax;height:70vmax;background:${theme.accent};top:-20%;left:-20%;animation:aorbMove1 20s ease-in-out infinite alternate; }
        .o2 { width:55vmax;height:55vmax;background:${theme.accentAlt};bottom:-15%;right:-15%;animation:aorbMove2 25s ease-in-out infinite alternate-reverse; }
        .o3 { width:40vmax;height:40vmax;background:${theme.accent};top:30%;left:30%;opacity:0.15;animation:aorbMove3 15s ease-in-out infinite alternate; }
        @keyframes aorbMove1 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(8%,5%) scale(1.15)} }
        @keyframes aorbMove2 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(-8%,-5%) scale(0.9)} }
        @keyframes aorbMove3 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(5%,-8%) scale(1.2)} }
      `;
    }

    if (variant === 'morphing-blob') {
      bgHTML = `<div class="blob-wrap"><div class="blob-shape"></div><div class="blob-shape b2"></div></div>`;
      bgCSS = `
        .blob-wrap { position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;display:flex;align-items:center;justify-content:center;pointer-events:none;overflow:hidden; }
        .blob-shape { width:55vmax;height:55vmax;background:linear-gradient(45deg,${theme.accent},${theme.accentAlt});filter:blur(100px);opacity:0.35;border-radius:30% 70% 70% 30%/30% 30% 70% 70%;animation:blobMorph 14s ease-in-out infinite alternate; }
        .blob-shape.b2 { width:40vmax;height:40vmax;background:linear-gradient(135deg,${theme.accentAlt},${theme.accent});position:absolute;top:20%;right:10%;animation:blobMorph 18s ease-in-out infinite alternate-reverse; }
        @keyframes blobMorph {
          0%   { border-radius:30% 70% 70% 30%/30% 30% 70% 70%; transform:scale(1) rotate(0deg); }
          50%  { border-radius:50% 50% 30% 70%/60% 40% 60% 40%; transform:scale(1.1) rotate(30deg); }
          100% { border-radius:70% 30% 30% 70%/70% 70% 30% 30%; transform:scale(0.95) rotate(60deg); }
        }
      `;
    }

    if (variant === 'bokeh-orbs') {
      const orbs = Array.from({ length: 20 }, (_, i) => {
        const size = 40 + Math.floor(Math.random() * 100);
        const left = Math.floor(Math.random() * 100);
        const top = Math.floor(Math.random() * 100);
        const delay = (Math.random() * 10).toFixed(1);
        const dur = (12 + Math.random() * 10).toFixed(1);
        const color = i % 2 === 0 ? theme.accent : theme.accentAlt;
        return `<div style="position:absolute;width:${size}px;height:${size}px;left:${left}%;top:${top}%;background:${color};border-radius:50%;filter:blur(25px);opacity:${(0.05 + Math.random() * 0.15).toFixed(2)};animation:bokehFloat ${dur}s ${delay}s ease-in-out infinite alternate;"></div>`;
      }).join('');
      bgHTML = `<div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;">${orbs}</div>`;
      bgCSS = `@keyframes bokehFloat { 0%{transform:translateY(0) scale(1)} 100%{transform:translateY(-40px) scale(1.15)} }`;
    }

    if (variant === 'constellation') {
      bgHTML = `<canvas id="constCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>`;
      bgJS = `
        (function() {
          var c = document.getElementById('constCanvas'), ctx = c.getContext('2d');
          if(!c || !ctx) return;
          c.width = window.innerWidth; c.height = window.innerHeight;
          var stars = [], ACCENT = '${theme.accent}', ACCENT2 = '${theme.accentAlt}';
          for(var i=0; i<120; i++) stars.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-0.5)*0.25,vy:(Math.random()-0.5)*0.25,r:Math.random()*1.5+0.5});
          function step() {
            ctx.clearRect(0,0,c.width,c.height);
            stars.forEach(function(s){s.x+=s.vx;s.y+=s.vy;if(s.x<0)s.x=c.width;if(s.x>c.width)s.x=0;if(s.y<0)s.y=c.height;if(s.y>c.height)s.y=0;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=ACCENT+'aa';ctx.fill();});
            for(var a=0;a<stars.length;a++){for(var b=a+1;b<stars.length;b++){var dx=stars[a].x-stars[b].x,dy=stars[a].y-stars[b].y,d=Math.sqrt(dx*dx+dy*dy);if(d<100){ctx.beginPath();ctx.moveTo(stars[a].x,stars[a].y);ctx.lineTo(stars[b].x,stars[b].y);ctx.strokeStyle=ACCENT2+Math.floor((1-d/100)*35).toString(16).padStart(2,'0');ctx.lineWidth=0.5;ctx.stroke();}}}
            requestAnimationFrame(step);
          }
          step();
          window.addEventListener('resize',function(){c.width=window.innerWidth;c.height=window.innerHeight;});
        })();
      `;
    }

    if (variant === 'water-ripple') {
      bgHTML = `<canvas id="rippleCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>`;
      bgJS = `
        (function() {
          var c = document.getElementById('rippleCanvas'), ctx = c.getContext('2d');
          if(!c || !ctx) return;
          c.width = window.innerWidth; c.height = window.innerHeight;
          var ripples = [], ACCENT = '${theme.accent}';
          function addRipple() { ripples.push({x:Math.random()*c.width,y:Math.random()*c.height,r:0,max:100+Math.random()*80,life:1}); }
          setInterval(addRipple, 1800); addRipple();
          function step() {
            ctx.clearRect(0,0,c.width,c.height);
            ripples = ripples.filter(function(r){r.r+=0.8;r.life=1-r.r/r.max;if(r.life<=0)return false;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.strokeStyle=ACCENT+Math.floor(r.life*80).toString(16).padStart(2,'0');ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.arc(r.x,r.y,r.r*0.6,0,Math.PI*2);ctx.strokeStyle=ACCENT+Math.floor(r.life*40).toString(16).padStart(2,'0');ctx.lineWidth=0.5;ctx.stroke();return true;});
            requestAnimationFrame(step);
          }
          step();
          document.addEventListener('click',function(e){ripples.push({x:e.clientX,y:e.clientY,r:0,max:200,life:1});});
          window.addEventListener('resize',function(){c.width=window.innerWidth;c.height=window.innerHeight;});
        })();
      `;
    }

    if (variant === 'particle-explosion') {
      bgHTML = `<canvas id="partCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>`;
      bgJS = `
        (function() {
          var c = document.getElementById('partCanvas'), ctx = c.getContext('2d');
          if(!c || !ctx) return;
          c.width = window.innerWidth; c.height = window.innerHeight;
          var pts = [], mx = c.width/2, my = c.height/2, A = '${theme.accent}', B = '${theme.accentAlt}';
          for(var i=0;i<150;i++) pts.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:0,vy:0,r:Math.random()*2.5+0.5,c:i%2===0?A:B});
          document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
          document.addEventListener('click',function(e){for(var i=0;i<20;i++){var a=Math.random()*Math.PI*2;pts.push({x:e.clientX,y:e.clientY,vx:Math.cos(a)*Math.random()*6,vy:Math.sin(a)*Math.random()*6,r:Math.random()*3+1,c:i%2===0?A:B,life:1});}});
          function step() {
            ctx.clearRect(0,0,c.width,c.height);
            pts.forEach(function(p,i){
              if(p.life!==undefined){p.life-=0.025;if(p.life<=0){pts.splice(i,1);return;}}
              var dx=mx-p.x,dy=my-p.y,d=Math.sqrt(dx*dx+dy*dy);
              if(d<120&&d>1){p.vx-=dx/d*0.4;p.vy-=dy/d*0.4;}
              p.vx*=0.98;p.vy*=0.98;p.x+=p.vx;p.y+=p.vy;
              if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;
              var al=p.life!==undefined?p.life:0.5;
              ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
              ctx.fillStyle=p.c+Math.floor(al*200).toString(16).padStart(2,'0');ctx.fill();
            });
            requestAnimationFrame(step);
          }
          step();
          window.addEventListener('resize',function(){c.width=window.innerWidth;c.height=window.innerHeight;});
        })();
      `;
    }

    if (variant === 'cursor-ripple') {
      bgHTML = `<canvas id="cripCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>`;
      bgJS = `
        (function() {
          var c = document.getElementById('cripCanvas'), ctx = c.getContext('2d');
          if(!c || !ctx) return;
          c.width = window.innerWidth; c.height = window.innerHeight;
          var rings = [], A = '${theme.accent}';
          document.addEventListener('mousemove',function(e){if(Math.random()>0.65)rings.push({x:e.clientX,y:e.clientY,r:0,max:70+Math.random()*50,life:1});});
          document.addEventListener('click',function(e){rings.push({x:e.clientX,y:e.clientY,r:0,max:150,life:1});});
          function step(){
            ctx.clearRect(0,0,c.width,c.height);
            rings=rings.filter(function(r){r.r+=2.5;r.life=1-r.r/r.max;if(r.life<=0)return false;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.strokeStyle=A+Math.floor(r.life*160).toString(16).padStart(2,'0');ctx.lineWidth=2;ctx.stroke();return true;});
            requestAnimationFrame(step);
          }
          step();
          window.addEventListener('resize',function(){c.width=window.innerWidth;c.height=window.innerHeight;});
        })();
      `;
    }

    if (variant === 'depth-parallax') {
      const layers = [1, 2, 3].map(l => {
        const items = Array.from({ length: 6 - l }, (_, i) => {
          const s = 20 + Math.floor(Math.random() * 60);
          return `<div style="position:absolute;width:${s}px;height:${s}px;border-radius:50%;background:${theme.accent};opacity:${(0.06 + l * 0.03).toFixed(2)};left:${Math.floor(Math.random() * 90)}%;top:${Math.floor(Math.random() * 90)}%;"></div>`;
        }).join('');
        return `<div id="pl${l}" style="position:absolute;inset:0;">${items}</div>`;
      }).join('');
      bgHTML = `<div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;">${layers}</div>`;
      bgJS = `
        document.addEventListener('mousemove',function(e){
          var x=(e.clientX/window.innerWidth-0.5),y=(e.clientY/window.innerHeight-0.5);
          [['pl1',8],['pl2',18],['pl3',35]].forEach(function(l){var el=document.getElementById(l[0]);if(el)el.style.transform='translate('+(x*l[1])+'px,'+(y*l[1])+'px)';});
        });
      `;
    }

    if (variant === 'heat-distortion') {
      bgHTML = `<canvas id="heatCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>`;
      bgJS = `
        (function() {
          var c = document.getElementById('heatCanvas'), ctx = c.getContext('2d');
          if(!c||!ctx)return;
          c.width=window.innerWidth;c.height=window.innerHeight;
          var t=0,mx=c.width/2,my=c.height/2,A='${theme.accent}';
          document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
          function step(){t+=0.02;ctx.clearRect(0,0,c.width,c.height);
            for(var y=0;y<c.height;y+=10){for(var x=0;x<c.width;x+=10){var dx=x-mx,dy=y-my,d=Math.sqrt(dx*dx+dy*dy),intensity=Math.max(0,1-d/280);var offset=Math.sin(y*0.04+t*2.5)*intensity*5;var al=intensity*0.07;if(al>0.01){ctx.fillStyle=A+Math.floor(al*255).toString(16).padStart(2,'0');ctx.fillRect(x+offset,y,8,8);}}}
            requestAnimationFrame(step);}
          step();
          window.addEventListener('resize',function(){c.width=window.innerWidth;c.height=window.innerHeight;});
        })();
      `;
    }

    // WebGL Fluid — try WebGL, fallback to CSS aurora automatically
    if (variant === 'webgl-fluid') {
      bgHTML = `
        <canvas id="fluidCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;"></canvas>
        <div class="aurora-container css-fallback" style="display:none;">
          <div class="aurora-orb o1"></div>
          <div class="aurora-orb o2"></div>
        </div>`;
      bgCSS = `
        .aurora-orb { position:absolute;border-radius:50%;filter:blur(100px);opacity:0.35; }
        .o1 { width:70vmax;height:70vmax;background:${theme.accent};top:-20%;left:-20%;animation:aorbMove1 20s ease-in-out infinite alternate; }
        .o2 { width:55vmax;height:55vmax;background:${theme.accentAlt};bottom:-15%;right:-15%;animation:aorbMove2 25s ease-in-out infinite alternate-reverse; }
        @keyframes aorbMove1{0%{transform:translate(0,0)}100%{transform:translate(8%,5%)}}
        @keyframes aorbMove2{0%{transform:translate(0,0)}100%{transform:translate(-8%,-5%)}}
      `;
      bgJS = `
        (function() {
          var canvas = document.getElementById('fluidCanvas');
          if(!canvas) return;
          var gl = null;
          try { gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl'); } catch(e){}
          if(!gl) {
            canvas.style.display='none';
            document.querySelector('.css-fallback').style.display='block';
            return;
          }
          canvas.width = window.innerWidth; canvas.height = window.innerHeight;
          var t=0;
          var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
          var fs='precision mediump float;uniform float t;uniform vec2 r;uniform vec2 m;void main(){vec2 uv=gl_FragCoord.xy/r;float d=length(uv-m/r);vec3 c1=vec3(${hexToGlInline(theme.accent)});vec3 c2=vec3(${hexToGlInline(theme.accentAlt)});float w=sin(uv.x*8.0+t)*sin(uv.y*6.0+t*1.1)*0.5+0.5;gl_FragColor=vec4(mix(c1,c2,w)*smoothstep(0.65,0.0,d)*0.8,1.0);}';
          function csh(ty,src){var s=gl.createShader(ty);gl.shaderSource(s,src);gl.compileShader(s);return s;}
          var prog=gl.createProgram();
          gl.attachShader(prog,csh(gl.VERTEX_SHADER,vs));
          gl.attachShader(prog,csh(gl.FRAGMENT_SHADER,fs));
          gl.linkProgram(prog);gl.useProgram(prog);
          var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
          gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
          var p=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
          var tU=gl.getUniformLocation(prog,'t'),rU=gl.getUniformLocation(prog,'r'),mU=gl.getUniformLocation(prog,'m');
          var mx=canvas.width/2,my=canvas.height/2;
          document.addEventListener('mousemove',function(e){mx=e.clientX;my=canvas.height-e.clientY;});
          function render(){t+=0.015;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(tU,t);gl.uniform2f(rU,canvas.width,canvas.height);gl.uniform2f(mU,mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(render);}
          render();
          canvas.addEventListener('webglcontextlost',function(e){e.preventDefault();canvas.style.display='none';document.querySelector('.css-fallback').style.display='block';});
          window.addEventListener('resize',function(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;});
        })();
      `;
    }

    // Matter.js Lanyard — full physics fall-back to CSS card
    if (variant === 'lanyard-card') {
      bgHTML = `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
        <div id="physicsMount" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;"></div>
        <div id="lanyardCard">
          <div class="lc-clip"></div>
          ${data.profileImageUrl
            ? `<img src="${data.profileImageUrl}" class="lc-img" />`
            : `<div class="lc-img-placeholder"></div>`}
          <div class="lc-name">${data.name || 'Your Name'}</div>
          <div class="lc-role">${data.portfolioType || 'Professional'}</div>
          <button onclick="document.getElementById('skills').scrollIntoView({behavior:'smooth'})" class="lc-btn">View Portfolio ↓</button>
        </div>`;
      bgJS = `
        window.addEventListener('load', function() {
          setTimeout(function() {
            var lEl = document.getElementById('lanyardCard');
            if(typeof Matter === 'undefined') { if(lEl) lEl.style.cssText += 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);'; return; }
            var E=Matter,eng=E.Engine.create(),world=eng.world;
            var mount=document.getElementById('physicsMount');
            var rnd=E.Render.create({element:mount,engine:eng,options:{width:window.innerWidth,height:window.innerHeight,wireframes:false,background:'transparent'}});
            E.Render.run(rnd); E.Runner.run(E.Runner.create(),eng);
            var cB=E.Bodies.rectangle(window.innerWidth/2,200,280,420,{render:{visible:false},density:0.04,frictionAir:0.025,chamfer:{radius:20}});
            var rope=E.Constraint.create({pointA:{x:window.innerWidth/2,y:0},bodyB:cB,pointB:{x:0,y:-180},stiffness:0.07,damping:0.02,render:{visible:true,strokeStyle:'${theme.accent}',lineWidth:4}});
            E.Composite.add(world,[cB,rope]);
            E.Events.on(eng,'afterUpdate',function(){if(cB&&lEl)lEl.style.transform='translate(-50%,-50%) translate('+cB.position.x+'px,'+cB.position.y+'px) rotate('+cB.angle+'rad)';});
            var ground=E.Bodies.rectangle(window.innerWidth/2,window.innerHeight+60,window.innerWidth*2,100,{isStatic:true,render:{visible:false}});
            E.Composite.add(world,ground);
            var mouse=E.Mouse.create(rnd.canvas),mc=E.MouseConstraint.create(eng,{mouse:mouse,constraint:{stiffness:0.1,render:{visible:false}}});
            E.Composite.add(world,mc); rnd.mouse=mouse;
          }, 400);
        });
      `;
      bgCSS = `
        #lanyardCard { position:fixed;top:0;left:0;transform-origin:center center;z-index:10;
          width:280px;height:400px;background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.12);border-radius:24px;
          backdrop-filter:blur(18px);padding:30px;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          pointer-events:none;box-shadow:0 30px 70px rgba(0,0,0,0.4);text-align:center;
        }
        .lc-clip { position:absolute;top:14px;width:50px;height:14px;background:rgba(255,255,255,0.7);border-radius:4px; }
        .lc-img { width:110px;height:110px;border-radius:50%;object-fit:cover;border:4px solid ${theme.accent};margin-bottom:18px; }
        .lc-img-placeholder { width:110px;height:110px;border-radius:50%;background:linear-gradient(135deg,${theme.accent},${theme.accentAlt});margin-bottom:18px; }
        .lc-name { font-family:'Space Grotesk',sans-serif;font-size:1.5rem;font-weight:700;color:${theme.text};margin-bottom:6px; }
        .lc-role { font-size:0.85rem;font-weight:700;color:${theme.accent};text-transform:uppercase;letter-spacing:1px;margin-bottom:24px; }
        .lc-btn { padding:10px 22px;border:none;background:${theme.accent};color:#fff;border-radius:10px;font-weight:700;cursor:pointer;pointer-events:auto; }
      `;
    }

    if (variant === 'photo-wall-3d') {
      const cards = (data.projects || []).concat(
        Array.from({ length: Math.max(0, 6 - (data.projects || []).length) }, (_, i) => ({ title: `Project ${i + 1}` }))
      ).slice(0, 8).map((p, i) => {
        const cols = 4, rows = Math.ceil(8 / 4);
        const x = 5 + (i % cols) * 23, y = 10 + Math.floor(i / cols) * 42;
        const ry = ((i % 2 === 0 ? 1 : -1) * (15 + Math.floor(Math.random() * 10))).toFixed(0);
        const rx = ((i % 3 === 0 ? 1 : -1) * 5).toFixed(0);
        return `<div style="position:absolute;left:${x}%;top:${y}%;width:22%;height:36%;background:${theme.card};border:1px solid rgba(255,255,255,0.08);border-radius:12px;backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:${theme.textSecondary};transform:rotateY(${ry}deg) rotateX(${rx}deg);box-shadow:0 10px 30px rgba(0,0,0,0.3);">${p.title || 'Project'}</div>`;
      }).join('');
      bgHTML = `<div id="photoWall" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;perspective:1000px;transform-style:preserve-3d;pointer-events:none;overflow:hidden;">${cards}</div>`;
      bgJS = `
        document.addEventListener('mousemove',function(e){var pw=document.getElementById('photoWall');if(pw){var rx=(e.clientY/window.innerHeight-0.5)*12,ry=(e.clientX/window.innerWidth-0.5)*-12;pw.style.transform='perspective(1000px) rotateX('+rx+'deg) rotateY('+ry+'deg)';}});
      `;
    }

    if (variant === 'svg-draw') {
      bgHTML = `<svg style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path d="M100,450 Q400,100 700,450 T1300,450" fill="none" stroke="${theme.accent}44" stroke-width="2" class="draw-path" style="stroke-dasharray:2000;stroke-dashoffset:2000;animation:drawSVG 5s ease forwards;"/>
        <path d="M200,700 Q600,300 900,700 T1400,600" fill="none" stroke="${theme.accentAlt}33" stroke-width="1.5" class="draw-path" style="stroke-dasharray:2000;stroke-dashoffset:2000;animation:drawSVG 6s 0.5s ease forwards;"/>
        <path d="M50,200 Q400,500 800,200 T1440,300" fill="none" stroke="${theme.accent}22" stroke-width="1" style="stroke-dasharray:2000;stroke-dashoffset:2000;animation:drawSVG 7s 1s ease forwards;"/>
      </svg>`;
      bgCSS = `@keyframes drawSVG { to { stroke-dashoffset: 0; } }`;
    }

    if (variant === 'static-grid') {
      bgCSS = `body::before { content:''; position:fixed; inset:0; background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 50px 50px; z-index:0; pointer-events:none; }`;
    }
    if (variant === 'static-dots') {
      bgCSS = `body::before { content:''; position:fixed; inset:0; background-image: radial-gradient(rgba(255,255,255,0.08) 2px, transparent 2px); background-size: 32px 32px; z-index:0; pointer-events:none; }`;
    }
    if (variant === 'static-gradient') {
      bgCSS = `body { background: linear-gradient(160deg, ${theme.bg} 0%, ${theme.bgSecondary} 50%, ${theme.bg} 100%) !important; }`;
    }
  }

  const skillSection = skillsHTML ? `
    <section class="section" id="skills">
      <h2>Expertise</h2>
      <div class="skills-flex">${skillsHTML}</div>
    </section>` : '';

  const projectSection = projectsHTML ? `
    <section class="section" id="projects">
      <h2>Projects</h2>
      <div class="project-grid">${projectsHTML}</div>
    </section>` : '';

  const contactSection = socialsHTML ? `
    <section class="section" id="contact">
      <h2>Let's Connect</h2>
      <div class="socials-row">${socialsHTML}</div>
    </section>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.name || 'Portfolio'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" crossorigin />
  <style>
    :root {
      --bg: ${theme.bg};
      --bg2: ${theme.bgSecondary};
      --accent: ${theme.accent};
      --accent2: ${theme.accentAlt};
      --text: ${theme.text};
      --text2: ${theme.textSecondary};
      --card: ${theme.card};
      --grad: ${theme.gradient};
    }
    *, *::before, *::after { margin:0;padding:0;box-sizing:border-box; }
    html { scroll-behavior: smooth; }
    body { font-family:'Inter',sans-serif; background:var(--bg); color:var(--text); overflow-x:hidden; }
    
    .content { position:relative; z-index:5; }
    .section { padding:100px 8%; max-width:1300px; margin:0 auto; }
    .section h2 { font-family:'Space Grotesk',sans-serif; font-size:clamp(2.5rem,5vw,3.5rem); margin-bottom:50px; background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

    /* Hero */
    .hero { min-height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; }
    .hero-avatar { width:140px;height:140px;border-radius:50%;object-fit:cover;border:4px solid var(--accent);margin-bottom:28px;box-shadow:0 20px 50px rgba(0,0,0,0.3);animation:fadeUp 1s ease 0.2s both; }
    .hero h1 { font-family:'Space Grotesk',sans-serif; font-size:clamp(4rem,10vw,7.5rem); font-weight:700; line-height:0.9; background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:24px; animation:fadeUp 1s ease 0.4s both; }
    .hero-bio { font-size:1.35rem; color:var(--text2); max-width:660px; line-height:1.7; animation:fadeUp 1s ease 0.6s both; }
    .scroll-hint { margin-top:60px; color:var(--text2); font-size:0.85rem; letter-spacing:1px; text-transform:uppercase; animation:fadeUp 1s ease 1.2s both; }
    .scroll-hint::after { content:''; display:block; width:1px; height:50px; background:var(--accent); margin:12px auto 0; animation:scrollBar 2s ease infinite; }
    @keyframes scrollBar { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }

    /* Skills */
    .skills-flex { display:flex; flex-wrap:wrap; gap:12px; }
    .skill-chip { padding:12px 26px; background:var(--card); border:1px solid rgba(255,255,255,0.1); border-radius:100px; font-weight:600; font-size:0.95rem; backdrop-filter:blur(10px); animation:fadeUp 0.7s ease both; transition:all 0.2s; }
    .skill-chip:hover { background:var(--accent); color:#fff; border-color:var(--accent); transform:translateY(-3px); }
    
    /* Projects */
    .project-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:28px; }
    .project-card { background:var(--card); border:1px solid rgba(255,255,255,0.06); border-radius:20px; overflow:hidden; animation:fadeUp 0.7s ease both; transition:all 0.4s cubic-bezier(0.165,0.84,0.44,1); }
    .project-card:hover { transform:translateY(-10px); border-color:var(--accent); box-shadow:0 20px 50px rgba(0,0,0,0.3); }
    .project-inner { padding:36px; }
    .project-card h3 { font-family:'Space Grotesk',sans-serif; font-size:1.6rem; margin-bottom:14px; }
    .project-card p { color:var(--text2); line-height:1.7; font-size:0.95rem; }
    .project-link { display:inline-block; margin-top:20px; color:var(--accent); font-weight:700; text-decoration:none; }
    .project-link:hover { text-decoration:underline; }
    
    /* Socials */
    .socials-row { display:flex; flex-wrap:wrap; gap:12px; }
    .social-btn { padding:12px 28px; background:var(--card); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:var(--text); text-decoration:none; font-weight:600; transition:all 0.2s; }
    .social-btn:hover { background:var(--accent); color:#fff; transform:translateY(-3px); }
    
    /* Animations */
    @keyframes fadeUp { from{opacity:0;transform:translateY(25px)} to{opacity:1;transform:translateY(0)} }
    
    ${bgCSS}
  </style>
</head>
<body>
  ${bgHTML}
  <div class="content">
    <section class="section hero">
      ${data.profileImageUrl ? `<img src="${data.profileImageUrl}" class="hero-avatar" alt="${data.name}" />` : ''}
      <h1>${data.name || 'Your Name'}</h1>
      <p class="hero-bio">${data.bio || 'Building extraordinary digital experiences that leave a lasting impression.'}</p>
      <div class="scroll-hint">Scroll</div>
    </section>
    ${skillSection}
    ${projectSection}
    ${contactSection}
  </div>
  ${bgJS ? `<script>${bgJS}</script>` : ''}
</body>
</html>`;
}

// Inline helper for WebGL color (not exported)
function hexToGlInline(hex) {
  if (!hex || hex.length < 7) return '0.5,0.5,0.5';
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return `${r.toFixed(3)},${g.toFixed(3)},${b.toFixed(3)}`;
}
