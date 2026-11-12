(function(){
  // hash options, e.g. #pink  #mint-dark  #violet-light
  function opts(){
    var t=location.hash.slice(1).split('-'),r=document.documentElement;
    var skin=['pink','mint','violet'].filter(function(s){return t.indexOf(s)>-1;})[0];
    var mode=['light','dark'].filter(function(s){return t.indexOf(s)>-1;})[0];
    skin&&skin!=='violet'?r.setAttribute('data-skin',skin):r.removeAttribute('data-skin');
    mode?r.setAttribute('data-theme',mode):r.removeAttribute('data-theme');
  }
  opts();addEventListener('hashchange',opts);

  var $=function(id){return document.getElementById(id);};
  var tb=$('tb'),pill=$('pill'),hit=$('hit'),glyph=$('glyph'),drop=$('drop'),dot=$('dot');
  var ics=[].slice.call(pill.querySelectorAll('.ic')),navs=[].slice.call(tb.querySelectorAll('.nav'));
  var PLUS='<svg viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" stroke="#fff" stroke-width="4.6" stroke-linecap="round" fill="none"/></svg>';
  glyph.innerHTML=PLUS;
  var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W=rm?70:14,FINAL=[144,90,36],NAVX=[38,82,242,286];
  var filt=[0,1,2,3].map(function(i){return document.querySelector('#b'+i+' feGaussianBlur');});
  function sp(z,w){return{x:0,v:0,t:0,z:z||1,w:w||W};}
  var m=sp(),c=[sp(),sp(),sp()],dy=sp(.55,rm?70:17),ds=sp(1,rm?70:18),dx=sp(.6,rm?70:15);
  dx.x=dx.t=NAVX[0];dy.x=dy.t=FINAL[2];
  var all=[m,c[0],c[1],c[2],dy,ds,dx];
  var open=false,sel=-1,nav=0,timers=[],close=0,raf=0,last=0,u=1;
  function measure(){u=tb.getBoundingClientRect().width/324;}
  measure();addEventListener('resize',function(){measure();render();});
  var clamp=function(x,a,b){return Math.max(a,Math.min(b,x));};
  function step(s,dt){var a=s.w*s.w*(s.t-s.x)-2*s.z*s.w*s.v;s.v+=a*dt;s.x+=s.v*dt;}
  function blur(i,v,k){
    var px=rm?0:Math.min(Math.abs(v)*k,7)*u,el=[glyph].concat(ics)[i];
    if(px<.15){el.style.filter='none';return;}
    filt[i].setAttribute('stdDeviation','0 '+px.toFixed(2));el.style.filter='url(#b'+i+')';
  }
  function render(){
    var h=72+108*m.x,g=clamp(m.x/.45,0,1);
    pill.style.height=h*u+'px';
    glyph.style.opacity=1-g;
    glyph.style.bottom=(h-36-12)*u+'px';
    glyph.style.transform='rotate('+(45*g)+'deg)';
    blur(0,m.v,1.5);
    ics.forEach(function(el,i){
      var s=c[i];
      el.style.bottom=(-4+(FINAL[i]+4)*s.x-24)*u+'px';
      el.style.opacity=clamp(s.x*3,0,1);
      blur(i+1,s.v,1.5);
    });
    // liquid drop: stretches with speed, squashes on arrival
    var st=rm?0:clamp(Math.abs(dy.v)/260,0,.9),sc=ds.x;
    drop.style.bottom=(dy.x-24)*u+'px';
    drop.style.opacity=clamp(sc*1.5,0,1)*clamp(m.x*2,0,1);
    drop.style.transform='scale('+(sc/(1+st*.55)).toFixed(3)+','+(sc*(1+st)).toFixed(3)+')';
    // gooey nav dot
    var w=5+(rm?0:Math.min(Math.abs(dx.v)*.035,34));
    dot.style.width=w*u+'px';dot.style.left=(dx.x-w/2)*u+'px';
  }
  function settled(s){return Math.abs(s.t-s.x)<.0005*(s===dx||s===dy?200:1)&&Math.abs(s.v)<.005*(s===dx||s===dy?200:1);}
  function frame(t){
    var dt=Math.min((t-last)/1000,1/30);last=t;
    var n=Math.max(1,Math.round(dt/(1/240)));
    for(var k=0;k<n;k++)all.forEach(function(s){step(s,dt/n);});
    render();
    if(all.every(settled)){all.forEach(function(s){s.x=s.t;s.v=0;});render();raf=0;return;}
    raf=requestAnimationFrame(frame);
  }
  function go(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}}

  function setOpen(o){
    open=o;hit.setAttribute('aria-expanded',o);
    timers.forEach(clearTimeout);timers=[];clearTimeout(close);
    m.t=o?1:0;
    c.forEach(function(s,i){
      if(o)timers.push(setTimeout(function(){s.t=1;go();},rm?0:45+i*55));else s.t=0;
    });
    ics.forEach(function(el){el.inert=!o;});
    go();
  }
  function select(i){
    clearTimeout(close);
    var again=(i===sel);
    if(again){sel=-1;ds.t=0;glyph.innerHTML=PLUS;}
    else{
      if(sel<0){dy.x=dy.t=FINAL[i];ds.x=0;}
      sel=i;dy.t=FINAL[i];ds.t=1;
      glyph.innerHTML=ics[i].querySelector('svg').outerHTML;
    }
    ics.forEach(function(el,j){el.setAttribute('aria-pressed',j===sel);});
    go();
    close=setTimeout(function(){setOpen(false);},again?350:700);
  }
  function setNav(i){
    nav=i;dx.t=NAVX[i];
    navs.forEach(function(n,j){n.setAttribute('aria-current',j===i);});
    var n=navs[i];n.classList.remove('pop');void n.offsetWidth;n.classList.add('pop');go();
  }
  hit.addEventListener('click',function(){setOpen(!open);});
  ics.forEach(function(el,i){el.addEventListener('click',function(){select(i);});});
  navs.forEach(function(n,i){n.addEventListener('click',function(){setNav(i);});});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&open){setOpen(false);hit.focus();}});
  document.addEventListener('pointerdown',function(e){if(open&&!tb.contains(e.target))setOpen(false);});
  render();
})();
