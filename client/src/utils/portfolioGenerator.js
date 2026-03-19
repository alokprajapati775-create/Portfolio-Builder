// portfolioGenerator.js — Premium 3D Animation Engine
// All animations work in iframe (isolated WebGL context pool)

export const THEME_PALETTES = {
  dark: { bg:'#0a0a1a',bgSecondary:'#111127',accent:'#7c3aed',accentAlt:'#06b6d4',text:'#f0f0f5',textSecondary:'#9ca3af',card:'rgba(255,255,255,0.05)',gradient:'linear-gradient(135deg,#7c3aed,#06b6d4)' },
  light: { bg:'#f8fafc',bgSecondary:'#ffffff',accent:'#6366f1',accentAlt:'#8b5cf6',text:'#1e293b',textSecondary:'#64748b',card:'rgba(0,0,0,0.03)',gradient:'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  colorful: { bg:'#0f0c29',bgSecondary:'#1a1145',accent:'#f97316',accentAlt:'#ec4899',text:'#ffffff',textSecondary:'#c4b5fd',card:'rgba(255,255,255,0.08)',gradient:'linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)' },
  luxury: { bg:'#0c0c0c',bgSecondary:'#1a1a1a',accent:'#d4a853',accentAlt:'#f5e6c8',text:'#f5f5f5',textSecondary:'#a0a0a0',card:'rgba(212,168,83,0.08)',gradient:'linear-gradient(135deg,#d4a853,#f5e6c8)' },
  minimal: { bg:'#ffffff',bgSecondary:'#fafafa',accent:'#171717',accentAlt:'#525252',text:'#171717',textSecondary:'#737373',card:'rgba(0,0,0,0.04)',gradient:'linear-gradient(135deg,#171717,#525252)' },
};

function hexToGl(hex) {
  if (!hex || hex.length < 7) return '0.5,0.5,0.5';
  return `${(parseInt(hex.slice(1,3),16)/255).toFixed(3)},${(parseInt(hex.slice(3,5),16)/255).toFixed(3)},${(parseInt(hex.slice(5,7),16)/255).toFixed(3)}`;
}

export function generatePortfolioHTML(data) {
  const theme = { ...(data.themePalette || THEME_PALETTES[data.theme] || THEME_PALETTES.dark) };
  if (data.customPrimaryColor) { theme.accent = data.customPrimaryColor; theme.gradient = `linear-gradient(135deg,${data.customPrimaryColor},${theme.accentAlt})`; }

  const animMode = data.animationMode || 'ambient';
  const variant  = data.backgroundVariant || 'aurora-waves';
  const noAnim   = animMode === 'no-animation';
  const a = theme.accent, a2 = theme.accentAlt, ga = hexToGl(a), ga2 = hexToGl(a2);

  /* ── skills / projects / socials ── */
  const skills = (data.skills||[]).map((s,i)=>`<div class="skill-chip reveal" style="transition-delay:${i*60}ms">${s}</div>`).join('');
  const projects = (data.projects||[]).map((p,i)=>`
    <div class="proj-card tilt-card reveal" style="transition-delay:${i*100}ms" data-tilt>
      <div class="proj-shine"></div>
      <div class="proj-body">
        <div class="proj-num">0${i+1}</div>
        <h3>${p.title||'Project'}</h3>
        <p>${p.description||''}</p>
        ${p.link?`<a class="proj-link" href="${p.link}" target="_blank">View Project <span>→</span></a>`:''}
      </div>
    </div>`).join('');
  const socials = Object.entries(data.socials||{}).filter(([,v])=>v).map(([k,u])=>`<a class="soc-btn" href="${u}" target="_blank">${k.charAt(0).toUpperCase()+k.slice(1)}</a>`).join('');

  /* ── Background definitions ── */
  let bgHTML='', bgCSS='', bgJS='';

  // AURORA WAVES (always-works CSS)
  if (!noAnim && (variant==='aurora-waves' || (animMode==='ambient' && !['morphing-blob','bokeh-orbs','constellation','water-ripple','svg-draw'].includes(variant)))) {
    bgHTML=`<div class="aurora-wrap"><div class="au o1"></div><div class="au o2"></div><div class="au o3"></div></div>`;
    bgCSS+=`.aurora-wrap{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}
    .au{position:absolute;border-radius:50%;filter:blur(110px);will-change:transform}
    .o1{width:75vmax;height:75vmax;background:${a};opacity:.22;top:-20%;left:-15%;animation:au1 22s ease-in-out infinite alternate}
    .o2{width:60vmax;height:60vmax;background:${a2};opacity:.18;bottom:-15%;right:-10%;animation:au2 28s ease-in-out infinite alternate-reverse}
    .o3{width:45vmax;height:45vmax;background:${a};opacity:.1;top:30%;left:35%;animation:au3 16s ease-in-out infinite alternate}
    @keyframes au1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(7%,6%) scale(1.2)}}
    @keyframes au2{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-7%,-5%) scale(.9)}}
    @keyframes au3{0%{transform:translate(0,0) scale(1)}100%{transform:translate(5%,-8%) scale(1.15)}}`;
  }

  // MORPHING BLOB
  if (!noAnim && variant==='morphing-blob') {
    bgHTML=`<div class="blob-wrap"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div></div>`;
    bgCSS+=`.blob-wrap{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}
    .blob{position:absolute;filter:blur(90px);opacity:.35;border-radius:30% 70% 70% 30%/30% 30% 70% 70%;}
    .b1{width:55vmax;height:55vmax;background:${a};top:0;left:0;animation:blob1 14s ease-in-out infinite alternate}
    .b2{width:45vmax;height:45vmax;background:${a2};bottom:0;right:0;animation:blob2 18s ease-in-out infinite alternate-reverse}
    .b3{width:35vmax;height:35vmax;background:${a};top:40%;left:30%;opacity:.2;animation:blob1 20s ease-in-out infinite}
    @keyframes blob1{0%{border-radius:30% 70% 70% 30%/30% 30% 70% 70%;transform:scale(1) rotate(0)}50%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}100%{border-radius:70% 30% 30% 70%/70% 70% 30% 30%;transform:scale(1.15) rotate(40deg)}}
    @keyframes blob2{0%{border-radius:40% 60% 60% 40%/40% 40% 60% 60%;transform:scale(1)}100%{border-radius:70% 30% 30% 70%/30% 60% 40% 70%;transform:scale(.88) rotate(-35deg)}}`;
  }

  // BOKEH ORBS
  if (!noAnim && variant==='bokeh-orbs') {
    const orbs = Array.from({length:22},(_,i)=>{
      const s=40+Math.floor(i*7%100),l=Math.floor(i*13%100),t=Math.floor(i*17%100),d=(i*0.7).toFixed(1),du=(10+i%10).toFixed(1),c=i%3===0?a:i%3===1?a2:a;
      return `<div style="position:absolute;width:${s}px;height:${s}px;left:${l}%;top:${t}%;background:${c};border-radius:50%;filter:blur(28px);opacity:${(0.06+i%4*0.04).toFixed(2)};animation:bokeh ${du}s ${d}s ease-in-out infinite alternate"></div>`;
    }).join('');
    bgHTML=`<div style="position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none">${orbs}</div>`;
    bgCSS+=`@keyframes bokeh{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-50px) scale(1.2)}}`;
  }

  // CONSTELLATION (Canvas 2D)
  if (!noAnim && variant==='constellation') {
    bgHTML=`<canvas id="cstC" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none"></canvas>`;
    bgJS+=`(function(){var c=document.getElementById('cstC'),x=c.getContext('2d');if(!x)return;c.width=innerWidth;c.height=innerHeight;var S=[];for(var i=0;i<130;i++)S.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.8+.4});function f(){x.clearRect(0,0,c.width,c.height);S.forEach(function(s,i){s.x+=s.vx;s.y+=s.vy;if(s.x<0)s.x=c.width;if(s.x>c.width)s.x=0;if(s.y<0)s.y=c.height;if(s.y>c.height)s.y=0;x.beginPath();x.arc(s.x,s.y,s.r,0,Math.PI*2);x.fillStyle='${a}cc';x.fill();S.forEach(function(b,j){if(i>=j)return;var d=Math.hypot(s.x-b.x,s.y-b.y);if(d<110){x.beginPath();x.moveTo(s.x,s.y);x.lineTo(b.x,b.y);x.strokeStyle='${a2}'+Math.floor((1-d/110)*38).toString(16).padStart(2,'0');x.lineWidth=.5;x.stroke();}});});requestAnimationFrame(f);}f();addEventListener('resize',function(){c.width=innerWidth;c.height=innerHeight;});}());`;
  }

  // WATER RIPPLE (Canvas 2D)
  if (!noAnim && variant==='water-ripple') {
    bgHTML=`<canvas id="wRip" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none"></canvas>`;
    bgJS+=`(function(){var c=document.getElementById('wRip'),x=c.getContext('2d');if(!x)return;c.width=innerWidth;c.height=innerHeight;var R=[];function add(px,py,mx){R.push({x:px,y:py,r:0,max:mx||100+Math.random()*80,life:1});}setInterval(function(){add(Math.random()*c.width,Math.random()*c.height);},1800);add(c.width/2,c.height/2);document.addEventListener('click',function(e){add(e.clientX,e.clientY,200);});function f(){x.clearRect(0,0,c.width,c.height);R=R.filter(function(r){r.r+=1.2;r.life=1-r.r/r.max;if(r.life<=0)return false;x.beginPath();x.arc(r.x,r.y,r.r,0,Math.PI*2);x.strokeStyle='${a}'+Math.floor(r.life*90).toString(16).padStart(2,'0');x.lineWidth=2;x.stroke();x.beginPath();x.arc(r.x,r.y,r.r*.5,0,Math.PI*2);x.strokeStyle='${a2}'+Math.floor(r.life*45).toString(16).padStart(2,'0');x.lineWidth=1;x.stroke();return true;});requestAnimationFrame(f);}f();addEventListener('resize',function(){c.width=innerWidth;c.height=innerHeight;});}());`;
  }

  // PARTICLE EXPLOSION (Canvas 2D)
  if (!noAnim && variant==='particle-explosion') {
    bgHTML=`<canvas id="prtC" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none"></canvas>`;
    bgJS+=`(function(){var c=document.getElementById('prtC'),x=c.getContext('2d');if(!x)return;c.width=innerWidth;c.height=innerHeight;var P=[],mx=c.width/2,my=c.height/2;for(var i=0;i<180;i++)P.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:0,vy:0,r:Math.random()*2.5+.5,c:i%2?'${a}':'${a2}'});document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});document.addEventListener('click',function(e){for(var i=0;i<25;i++){var a2=Math.random()*Math.PI*2;P.push({x:e.clientX,y:e.clientY,vx:Math.cos(a2)*Math.random()*8,vy:Math.sin(a2)*Math.random()*8,r:Math.random()*4+1,c:i%2?'${a}':'${a2}',life:1});}});function f(){x.clearRect(0,0,c.width,c.height);P.forEach(function(p,i){if(p.life!==undefined){p.life-=.022;if(p.life<=0){P.splice(i,1);return;}}var dx=mx-p.x,dy=my-p.y,d=Math.hypot(dx,dy);if(d<130&&d>1){p.vx-=dx/d*.45;p.vy-=dy/d*.45;}p.vx*=.98;p.vy*=.98;p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;var al=p.life!==undefined?p.life:.55;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle=p.c+Math.floor(al*210).toString(16).padStart(2,'0');x.fill();});requestAnimationFrame(f);}f();addEventListener('resize',function(){c.width=innerWidth;c.height=innerHeight;});}());`;
  }

  // CURSOR RIPPLE (Canvas 2D)
  if (!noAnim && variant==='cursor-ripple') {
    bgHTML=`<canvas id="crpC" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none"></canvas>`;
    bgJS+=`(function(){var c=document.getElementById('crpC'),x=c.getContext('2d');if(!x)return;c.width=innerWidth;c.height=innerHeight;var R=[];document.addEventListener('mousemove',function(e){if(Math.random()>.6)R.push({x:e.clientX,y:e.clientY,r:0,max:60+Math.random()*50,life:1});});document.addEventListener('click',function(e){R.push({x:e.clientX,y:e.clientY,r:0,max:180,life:1});});function f(){x.clearRect(0,0,c.width,c.height);R=R.filter(function(r){r.r+=3;r.life=1-r.r/r.max;if(r.life<=0)return false;x.beginPath();x.arc(r.x,r.y,r.r,0,Math.PI*2);x.strokeStyle='${a}'+Math.floor(r.life*180).toString(16).padStart(2,'0');x.lineWidth=2.5;x.stroke();return true;});requestAnimationFrame(f);}f();addEventListener('resize',function(){c.width=innerWidth;c.height=innerHeight;});}());`;
  }

  // HEAT DISTORTION (Canvas 2D)
  if (!noAnim && variant==='heat-distortion') {
    bgHTML=`<canvas id="htC" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none"></canvas>`;
    bgJS+=`(function(){var c=document.getElementById('htC'),x=c.getContext('2d');if(!x)return;c.width=innerWidth;c.height=innerHeight;var t=0,mx=c.width/2,my=c.height/2;document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});function f(){t+=.022;x.clearRect(0,0,c.width,c.height);for(var y=0;y<c.height;y+=10){for(var px=0;px<c.width;px+=10){var dx=px-mx,dy=y-my,d=Math.hypot(dx,dy),it=Math.max(0,1-d/300);var of=Math.sin(y*.045+t*2.8)*it*6;var al=it*.08;if(al>.01){x.fillStyle='${a}'+Math.floor(al*255).toString(16).padStart(2,'0');x.fillRect(px+of,y,8,8);}}}requestAnimationFrame(f);}f();addEventListener('resize',function(){c.width=innerWidth;c.height=innerHeight;});}());`;
  }

  // DEPTH PARALLAX
  if (!noAnim && variant==='depth-parallax') {
    const layers = [1,2,3].map(l=>{
      const items=Array.from({length:8-l*2},(_,i)=>{const s=20+i*l*8;return `<div style="position:absolute;width:${s}px;height:${s}px;border-radius:50%;background:${l%2?a:a2};opacity:${(.05+l*.03).toFixed(2)};left:${(i*31+l*13)%90}%;top:${(i*23+l*17)%80}%"></div>`;}).join('');
      return `<div id="pl${l}" style="position:absolute;inset:0">${items}</div>`;
    }).join('');
    bgHTML=`<div style="position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none">${layers}</div>`;
    bgJS+=`document.addEventListener('mousemove',function(e){var x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);[['pl1',8],['pl2',20],['pl3',40]].forEach(function(l){var el=document.getElementById(l[0]);if(el)el.style.transform='translate('+(x*l[1])+'px,'+(y*l[1])+'px)';});});`;
  }

  // SVG DRAW
  if (!noAnim && variant==='svg-draw') {
    bgHTML=`<svg style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <path d="M100,450 Q400,100 700,450 T1300,450" fill="none" stroke="${a}55" stroke-width="2" style="stroke-dasharray:2000;stroke-dashoffset:2000;animation:svgD 5s ease forwards"/>
      <path d="M0,600 Q360,200 720,600 T1440,500" fill="none" stroke="${a2}44" stroke-width="1.5" style="stroke-dasharray:2000;stroke-dashoffset:2000;animation:svgD 6.5s .3s ease forwards"/>
      <path d="M200,200 Q600,600 900,200 T1440,350" fill="none" stroke="${a}33" stroke-width="1" style="stroke-dasharray:2000;stroke-dashoffset:2000;animation:svgD 8s .8s ease forwards"/>
    </svg>`;
    bgCSS+=`@keyframes svgD{to{stroke-dashoffset:0}}`;
  }

  // WEBGL FLUID (with CSS fallback)
  if (!noAnim && variant==='webgl-fluid') {
    bgHTML=`<canvas id="wglC" style="position:fixed;inset:0;width:100%;height:100%;z-index:0"></canvas>
    <div id="wglFb" class="aurora-wrap" style="display:none"><div class="au o1"></div><div class="au o2"></div></div>`;
    bgCSS+=`.aurora-wrap{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}.au{position:absolute;border-radius:50%;filter:blur(110px)}
    .o1{width:70vmax;height:70vmax;background:${a};opacity:.22;top:-20%;left:-15%;animation:au1 22s ease-in-out infinite alternate}
    .o2{width:55vmax;height:55vmax;background:${a2};opacity:.18;bottom:-10%;right:-10%;animation:au2 28s ease-in-out infinite alternate-reverse}
    @keyframes au1{0%{transform:translate(0,0)}100%{transform:translate(7%,6%) scale(1.15)}}
    @keyframes au2{0%{transform:translate(0,0)}100%{transform:translate(-6%,-5%) scale(.9)}}`;
    bgJS+=`(function(){var cv=document.getElementById('wglC');if(!cv)return;var gl=null;try{gl=cv.getContext('webgl')||cv.getContext('experimental-webgl');}catch(e){}if(!gl){cv.style.display='none';var fb=document.getElementById('wglFb');if(fb)fb.style.display='block';return;}cv.width=innerWidth;cv.height=innerHeight;var t=0,mx=cv.width/2,my=cv.height/2;var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';var fs='precision mediump float;uniform float t;uniform vec2 r;uniform vec2 m;void main(){vec2 uv=gl_FragCoord.xy/r;float d=length(uv-m/r);vec3 c1=vec3(${ga});vec3 c2=vec3(${ga2});float w=sin(uv.x*8.+t)*sin(uv.y*6.+t*1.1)*.5+.5;vec3 col=mix(c1,c2,w)*smoothstep(.7,0.,d)*.9;float e=sin(t*.5+uv.x*12.)*.03+.97;gl_FragColor=vec4(col*e,1.);}';function cs(ty,s){var sh=gl.createShader(ty);gl.shaderSource(sh,s);gl.compileShader(sh);return sh;}var pr=gl.createProgram();gl.attachShader(pr,cs(gl.VERTEX_SHADER,vs));gl.attachShader(pr,cs(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);var pa=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(pa);gl.vertexAttribPointer(pa,2,gl.FLOAT,false,0,0);var tU=gl.getUniformLocation(pr,'t'),rU=gl.getUniformLocation(pr,'r'),mU=gl.getUniformLocation(pr,'m');document.addEventListener('mousemove',function(e){mx=e.clientX;my=cv.height-e.clientY;});function frame(){t+=.015;gl.viewport(0,0,cv.width,cv.height);gl.uniform1f(tU,t);gl.uniform2f(rU,cv.width,cv.height);gl.uniform2f(mU,mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(frame);}frame();cv.addEventListener('webglcontextlost',function(e){e.preventDefault();cv.style.display='none';var fb=document.getElementById('wglFb');if(fb)fb.style.display='block';});addEventListener('resize',function(){cv.width=innerWidth;cv.height=innerHeight;});}());`;
  }

  // LANYARD CARD (Matter.js Physics)
  if (!noAnim && variant==='lanyard-card') {
    bgHTML=`<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
    <canvas id="matterC" style="position:fixed;inset:0;z-index:1;pointer-events:none"></canvas>
    <div id="lanyardEl" class="lanyard-card">
      <div class="lc-pin"></div>
      ${data.profileImageUrl?`<img src="${data.profileImageUrl}" class="lc-img"/>`:`<div class="lc-img" style="background:linear-gradient(135deg,${a},${a2})"></div>`}
      <div class="lc-name">${data.name||'Your Name'}</div>
      <div class="lc-role">${data.portfolioType||'Creative Developer'}</div>
      <div class="lc-skills">${(data.skills||[]).slice(0,3).map(s=>`<span>${s}</span>`).join('')}</div>
      <button onclick="document.getElementById('skills').scrollIntoView({behavior:'smooth'})" class="lc-btn">View Portfolio ↓</button>
    </div>`;
    bgCSS+=`
    .lanyard-card{position:fixed;top:0;left:0;z-index:2;pointer-events:none;
      width:260px;height:380px;transform-origin:center center;
      background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);
      border-radius:22px;backdrop-filter:blur(20px);padding:28px;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      box-shadow:0 40px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.15);text-align:center;}
    .lc-pin{position:absolute;top:16px;width:50px;height:14px;background:rgba(255,255,255,0.75);border-radius:5px;}
    .lc-img{width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid ${a};margin-bottom:16px;display:block;}
    .lc-name{font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:700;color:${theme.text};margin-bottom:4px;}
    .lc-role{font-size:.8rem;font-weight:700;color:${a};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:16px;}
    .lc-skills{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:20px;}
    .lc-skills span{font-size:.65rem;padding:3px 8px;border-radius:6px;background:rgba(255,255,255,.08);color:${theme.textSecondary};}
    .lc-btn{padding:9px 20px;border:none;background:${a};color:#fff;border-radius:9px;font-weight:700;font-size:.82rem;cursor:pointer;pointer-events:auto;transition:all .2s;}
    .lc-btn:hover{transform:scale(1.05);box-shadow:0 4px 16px ${a}66;}`;
    bgJS+=`window.addEventListener('load',function(){setTimeout(function(){if(typeof Matter==='undefined')return;var M=Matter,eng=M.Engine.create(),world=eng.world;var cv=document.getElementById('matterC');if(!cv)return;cv.width=innerWidth;cv.height=innerHeight;var rend=M.Render.create({canvas:cv,engine:eng,options:{width:innerWidth,height:innerHeight,wireframes:false,background:'transparent'}});M.Render.run(rend);M.Runner.run(M.Runner.create(),eng);var lEl=document.getElementById('lanyardEl');var cB=M.Bodies.rectangle(innerWidth/2,220,260,380,{render:{visible:false},density:.04,frictionAir:.028,chamfer:{radius:20}});var ropA=M.Constraint.create({pointA:{x:innerWidth/2-60,y:-10},bodyB:cB,pointB:{x:-110,y:-160},stiffness:.07,damping:.02,render:{visible:true,strokeStyle:'${a}',lineWidth:4}});var ropB=M.Constraint.create({pointA:{x:innerWidth/2+60,y:-10},bodyB:cB,pointB:{x:110,y:-160},stiffness:.07,damping:.02,render:{visible:true,strokeStyle:'${a}',lineWidth:4}});var ground=M.Bodies.rectangle(innerWidth/2,innerHeight+60,innerWidth*2,80,{isStatic:true,render:{visible:false}});M.Composite.add(world,[cB,ropA,ropB,ground]);if(lEl)lEl.style.opacity='1';M.Events.on(eng,'afterUpdate',function(){if(!cB||!lEl)return;lEl.style.transform='translate(-50%,-50%) translate('+cB.position.x+'px,'+cB.position.y+'px) rotate('+cB.angle+'rad)';});var mouse=M.Mouse.create(rend.canvas),mc=M.MouseConstraint.create(eng,{mouse:mouse,constraint:{stiffness:.12,render:{visible:false}}});M.Composite.add(world,mc);rend.mouse=mouse;addEventListener('resize',function(){cv.width=innerWidth;cv.height=innerHeight;M.Body.setPosition(ground,{x:innerWidth/2,y:innerHeight+60});});},400);});`;
  }

  // PHOTO WALL 3D
  if (!noAnim && variant==='photo-wall-3d') {
    const cards=(data.projects||[{title:'Project 1'},{title:'Project 2'},{title:'Project 3'},{title:'Project 4'}]).slice(0,8).map((p,i)=>{
      const col=i%4,row=Math.floor(i/4),ry=((i%2?1:-1)*15+(i%3)*5).toFixed(0),rx=((i%3===0?1:-1)*7).toFixed(0);
      return `<div style="position:absolute;left:${5+col*24}%;top:${10+row*45}%;width:23%;height:38%;background:${theme.card};border:1px solid rgba(255,255,255,.09);border-radius:14px;backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;transform:rotateY(${ry}deg) rotateX(${rx}deg);box-shadow:0 15px 40px rgba(0,0,0,.4);font-weight:700;font-size:.85rem;color:${theme.textSecondary};padding:20px;text-align:center;">${p.title||'Project'}</div>`;
    }).join('');
    bgHTML=`<div id="photoWall" style="position:fixed;inset:0;z-index:0;perspective:1200px;transform-style:preserve-3d;pointer-events:none;overflow:hidden">${cards}</div>`;
    bgJS+=`document.addEventListener('mousemove',function(e){var pw=document.getElementById('photoWall');if(pw){var rx=(e.clientY/innerHeight-.5)*12,ry=(e.clientX/innerWidth-.5)*-12;pw.style.transform='perspective(1200px) rotateX('+rx+'deg) rotateY('+ry+'deg)';}});`;
  }

  // Static variants
  if (noAnim || variant==='static-gradient') bgCSS+=`body::before{content:'';position:fixed;inset:0;background:linear-gradient(160deg,${theme.bg},${theme.bgSecondary});z-index:0;}`;
  if (variant==='static-grid') bgCSS+=`body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:50px 50px;z-index:0}`;
  if (variant==='static-dots') bgCSS+=`body::before{content:'';position:fixed;inset:0;background-image:radial-gradient(rgba(255,255,255,.08) 2px,transparent 2px);background-size:32px 32px;z-index:0}`;

  /* ── Universal 3D enhancements (always added) ── */
  const universalJS = `
// Custom Glowing Cursor
(function(){
  var cur=document.createElement('div');cur.id='gcur';document.body.appendChild(cur);
  var trail=document.createElement('div');trail.id='gcurT';document.body.appendChild(trail);
  var px=innerWidth/2,py=innerHeight/2,tx=px,ty=py;
  document.addEventListener('mousemove',function(e){px=e.clientX;py=e.clientY;});
  function animCur(){tx+=(px-tx)*.18;ty+=(py-ty)*.18;cur.style.cssText='position:fixed;left:'+(px-8)+'px;top:'+(py-8)+'px;width:16px;height:16px;border-radius:50%;background:${a};pointer-events:none;z-index:99999;mix-blend-mode:screen;transition:transform .2s;';trail.style.cssText='position:fixed;left:'+(tx-20)+'px;top:'+(ty-20)+'px;width:40px;height:40px;border-radius:50%;border:2px solid ${a}66;pointer-events:none;z-index:99998;transition:width .3s,height .3s;';requestAnimationFrame(animCur);}
  animCur();
  document.querySelectorAll('a,button,.proj-card,.skill-chip,.soc-btn').forEach(function(el){el.addEventListener('mouseenter',function(){cur.style.transform='scale(2.5)';trail.style.width='60px';trail.style.height='60px';});el.addEventListener('mouseleave',function(){cur.style.transform='scale(1)';trail.style.width='40px';trail.style.height='40px';});});
})();

// 3D Tilt on project cards
(function(){
  document.querySelectorAll('.proj-card').forEach(function(card){
    card.style.transition='transform .25s ease,box-shadow .25s ease';
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform='perspective(700px) rotateX('+(-y*16)+'deg) rotateY('+(x*16)+'deg) scale(1.04)';
      card.style.boxShadow='0 20px 60px rgba(0,0,0,.5),'+(x*20)+'px '+(y*20)+'px 40px ${a}33';
      var sh=card.querySelector('.proj-shine');if(sh)sh.style.background='radial-gradient(circle at '+(x*100+50)+'% '+(y*100+50)+'%,rgba(255,255,255,.18),transparent 60%)';
    });
    card.addEventListener('mouseleave',function(){card.style.transform='perspective(700px) rotateX(0) rotateY(0) scale(1)';card.style.boxShadow='';var sh=card.querySelector('.proj-shine');if(sh)sh.style.background='none';});
  });
})();

// Holographic shimmer on skill chips
(function(){
  document.querySelectorAll('.skill-chip').forEach(function(el){
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100;
      el.style.background='radial-gradient(circle at '+x+'% '+y+'%,${a}44,${a2}22,transparent 70%)';
      el.style.borderColor='${a}88';el.style.transform='translateY(-4px) scale(1.06)';
    });
    el.addEventListener('mouseleave',function(){el.style.background='';el.style.borderColor='';el.style.transform='';});
  });
})();

// Scroll-triggered reveals with IntersectionObserver
(function(){
  var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('revealed');}});},{threshold:.12});
  document.querySelectorAll('.reveal,.proj-card,.skill-chip,.soc-btn').forEach(function(el){io.observe(el);});
})();

// Loading screen dismiss
window.addEventListener('load',function(){
  setTimeout(function(){var ls=document.getElementById('loadScreen');if(ls){ls.style.opacity='0';ls.style.pointerEvents='none';setTimeout(function(){ls.remove();},800);}},1200);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth',block:'start'});});});
`;

  const universalCSS = `
  /* Loading Screen */
  #loadScreen{position:fixed;inset:0;z-index:99999;background:${theme.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .8s ease}
  .ls-logo{font-family:'Space Grotesk',sans-serif;font-size:3rem;font-weight:800;background:${theme.gradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:lsPulse 1s ease-in-out infinite alternate}
  .ls-bar{width:200px;height:3px;background:rgba(255,255,255,.1);border-radius:2px;margin-top:24px;overflow:hidden}
  .ls-fill{height:100%;background:${theme.gradient};border-radius:2px;animation:lsFill 1.2s ease forwards}
  @keyframes lsPulse{0%{opacity:.6;transform:scale(.98)}100%{opacity:1;transform:scale(1)}}
  @keyframes lsFill{0%{width:0}100%{width:100%}}

  /* Reveal animations */
  .reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
  .reveal.revealed{opacity:1;transform:translateY(0)}
  .proj-card{opacity:0;transform:translateY(28px) rotateX(8deg);transition:opacity .7s ease,transform .7s ease,box-shadow .25s ease}
  .proj-card.revealed{opacity:1;transform:translateY(0) rotateX(0)}

  /* Glitch text animation */
  .glitch{position:relative;display:inline-block}
  .glitch::before,.glitch::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;background:${theme.gradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .glitch::before{left:2px;text-shadow:-2px 0 ${a};animation:glitch1 3s infinite}
  .glitch::after{left:-2px;text-shadow:2px 0 ${a2};animation:glitch2 3s infinite}
  @keyframes glitch1{0%,100%{clip-path:inset(100% 0 0 0)}10%{clip-path:inset(15% 0 60% 0)}20%{clip-path:inset(70% 0 10% 0)}30%{clip-path:inset(40% 0 80% 0)}40%{clip-path:inset(0 0 100% 0)}50%{clip-path:inset(100% 0 0 0)}}
  @keyframes glitch2{0%,100%{clip-path:inset(0 0 100% 0)}15%{clip-path:inset(80% 0 0 0)}25%{clip-path:inset(20% 0 50% 0)}35%{clip-path:inset(60% 0 20% 0)}45%{clip-path:inset(0 0 100% 0)}}

  /* Custom cursor hidden on mobile */
  @media(hover:none){#gcur,#gcurT{display:none!important}}
  `;

  const loadingScreen = `<div id="loadScreen"><div class="ls-logo">${data.name?.split(' ')[0]||'Portfolio'}</div><div class="ls-bar"><div class="ls-fill"></div></div></div>`;

  const navbar = `<nav class="pf-nav" id="pfNav">
    <div class="pf-nav-brand">${data.name?.split(' ')[0]||'Portfolio'}<span style="color:${a}">.</span></div>
    <div class="pf-nav-links">
      <a href="#skills">Skills</a>
      <a href="#projects">Projects</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>`;

  const navCSS = `
  .pf-nav{position:fixed;top:0;left:0;right:0;z-index:999;padding:0 6%;height:64px;display:flex;align-items:center;justify-content:space-between;
    background:rgba(${theme.bg==='#ffffff'?'255,255,255':'10,10,26'},.75);backdrop-filter:blur(18px);
    border-bottom:1px solid rgba(255,255,255,.06);transition:all .3s}
  .pf-nav.scrolled{box-shadow:0 4px 30px rgba(0,0,0,.3)}
  .pf-nav-brand{font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:800;color:${theme.text}}
  .pf-nav-links{display:flex;gap:28px}.pf-nav-links a{color:${theme.textSecondary};text-decoration:none;font-size:.9rem;font-weight:500;transition:color .2s}
  .pf-nav-links a:hover{color:${a}}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${data.name||'Portfolio'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet" crossorigin/>
  <style>
    :root{--bg:${theme.bg};--bg2:${theme.bgSecondary};--accent:${a};--accent2:${a2};--text:${theme.text};--text2:${theme.textSecondary};--card:${theme.card};--grad:${theme.gradient};--radius:16px;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden;cursor:none}
    @media(hover:none){body{cursor:auto}}
    .content{position:relative;z-index:5}
    .section{padding:110px 8% 80px;max-width:1300px;margin:0 auto}
    .section-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(2.5rem,5vw,3.8rem);font-weight:800;margin-bottom:50px;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

    /* Hero */
    .hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding-top:100px}
    .hero-avatar{width:130px;height:130px;border-radius:50%;object-fit:cover;border:4px solid ${a};margin-bottom:28px;box-shadow:0 0 0 8px ${a}20,0 20px 60px rgba(0,0,0,.4);animation:avatarIn 1s ease .3s both}
    @keyframes avatarIn{from{opacity:0;transform:scale(.8) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .hero h1{font-family:'Space Grotesk',sans-serif;font-size:clamp(4rem,10vw,8rem);font-weight:800;line-height:.9;margin-bottom:24px;animation:heroTitleIn .9s ease .5s both}
    @keyframes heroTitleIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    .hero-bio{font-size:1.3rem;color:var(--text2);max-width:640px;line-height:1.8;margin-bottom:48px;animation:heroTitleIn .9s ease .7s both}
    .scroll-cue{display:flex;flex-direction:column;align-items:flex-start;gap:8px;color:${theme.textSecondary};font-size:.8rem;letter-spacing:1.5px;text-transform:uppercase;animation:heroTitleIn .9s ease 1.2s both}
    .scroll-cue-line{width:1px;height:56px;background:linear-gradient(to bottom,${a},transparent);animation:scrollLine 2s ease infinite}
    @keyframes scrollLine{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}

    /* Skills */
    .skills-wrap{display:flex;flex-wrap:wrap;gap:12px}
    .skill-chip{padding:12px 26px;background:var(--card);border:1px solid rgba(255,255,255,.08);border-radius:100px;font-weight:600;font-size:.95rem;backdrop-filter:blur(10px);cursor:default;will-change:transform,background;transition:transform .2s,background .2s,border-color .2s}

    /* Projects */
    .proj-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:28px}
    .proj-card{position:relative;overflow:hidden;border-radius:20px;cursor:default;will-change:transform}
    .proj-shine{position:absolute;inset:0;pointer-events:none;z-index:1;border-radius:20px}
    .proj-body{position:relative;z-index:2;background:var(--card);border:1px solid rgba(255,255,255,.06);border-radius:20px;padding:40px;height:100%;transition:border-color .3s,background .3s}
    .proj-card:hover .proj-body{background:rgba(255,255,255,.07);border-color:${a}44}
    .proj-num{font-family:'Space Grotesk',sans-serif;font-size:3rem;font-weight:800;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;opacity:.3;margin-bottom:12px}
    .proj-body h3{font-family:'Space Grotesk',sans-serif;font-size:1.6rem;font-weight:700;margin-bottom:14px}
    .proj-body p{color:var(--text2);line-height:1.75;font-size:.95rem}
    .proj-link{display:inline-flex;align-items:center;gap:6px;margin-top:22px;color:${a};font-weight:700;text-decoration:none;transition:gap .2s}
    .proj-link:hover{gap:10px}

    /* Socials */
    .soc-row{display:flex;flex-wrap:wrap;gap:14px}
    .soc-btn{padding:14px 30px;background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:var(--text);text-decoration:none;font-weight:600;transition:all .25s;backdrop-filter:blur(10px)}
    .soc-btn:hover{background:${a};color:#fff;border-color:${a};transform:translateY(-4px);box-shadow:0 10px 30px ${a}55}

    ${navCSS}
    ${universalCSS}
    ${bgCSS}
  </style>
</head>
<body>
  ${loadingScreen}
  ${bgHTML}
  ${navbar}
  <div class="content">
    <section class="section hero">
      ${data.profileImageUrl?`<img src="${data.profileImageUrl}" class="hero-avatar" alt="${data.name}"/>`:''}
      <h1 class="glitch" data-text="${data.name||'Your Name'}">${data.name||'Your Name'}</h1>
      <p class="hero-bio">${data.bio||'Building extraordinary digital experiences that leave a lasting impression on the world.'}</p>
      <div class="scroll-cue"><span>Scroll</span><div class="scroll-cue-line"></div></div>
    </section>
    ${skills?`<section class="section" id="skills"><h2 class="section-title reveal">Expertise</h2><div class="skills-wrap">${skills}</div></section>`:''}
    ${projects?`<section class="section" id="projects"><h2 class="section-title reveal">Featured Work</h2><div class="proj-grid">${projects}</div></section>`:''}
    ${socials?`<section class="section" id="contact"><h2 class="section-title reveal">Let's Connect</h2><div class="soc-row">${socials}</div></section>`:''}
  </div>
  <script>
    // Navbar scroll effect
    window.addEventListener('scroll',function(){var n=document.getElementById('pfNav');if(n)n.classList.toggle('scrolled',window.scrollY>40);});
    ${bgJS}
    ${universalJS}
  </script>
</body>
</html>`;
}
