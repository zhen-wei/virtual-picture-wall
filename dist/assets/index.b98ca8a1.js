var E=Object.defineProperty;var F=(s,e,t)=>e in s?E(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var h=(s,e,t)=>(F(s,typeof e!="symbol"?e+"":e,t),t);const b=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}};b();(function(){const s=["paint","largest-contentful-paint","layout-shift","first-input","longtask"];new PerformanceObserver(e=>{for(const t of e.getEntries())switch(t.entryType){case"paint":console.log("FP: \u767D\u5C4F\u6642\u9593"),console.log("FP:",t.startTime);break;case"largest-contentful-paint":console.log("LCP: \u986F\u793A\u6700\u5927\u5167\u5BB9\u5143\u7D20\u6240\u9700\u6642\u9593 \u2013 \u8F09\u5165\u901F\u5EA6 ( Good: \u22642500ms Poor: >4000ms )"),console.log("LCP:",t.startTime);break;case"first-input":console.log("FID: \u9996\u6B21\u8F38\u5165 ( Good: \u2264100ms Poor: >300ms )"),console.log("FID:",t.startTime);break;case"layout-shift":console.log("CLS: \u914D\u7F6E\u8F49\u79FB - \u9801\u9762\u7A69\u5B9A\u6027 ( Good: \u22640.1 Poor: >0.25 )"),console.log("CLS:",t.value);break;case"longtask":console.log("\u9577\u4EFB\u52D9"),console.log(t)}}).observe({entryTypes:s})})();const C=function(){let s=0;return function(e,t){clearTimeout(s),s=setTimeout(e,t)}}();class B{constructor(e){h(this,"masonryElement");h(this,"columns");h(this,"gap");h(this,"elementList");h(this,"elementListY");h(this,"itemsHeight");this.masonryElement=e.masonryElement,this.columns=e.columns,this.gap=e.gap,this.elementList=[],this.elementListY=new Float64Array(this.columns),this.itemsHeight=new Float64Array(this.columns)}render(e,...t){const{itemsHeight:i,masonryElement:n,elementList:o}=this;if(t.length){const{gap:l,columns:r}=this,m=this.elementList.length-1;if(o.push(...t),this.elementList.length>this.elementListY.length){const u=new Float64Array(this.elementList.length);u.set(this.elementListY),this.elementListY=u}const d=(n.getBoundingClientRect().width-l*(r-1))/r|0;t.forEach((u,y)=>{let p=i.indexOf(Math.min(...i));this.elementListY[m+y]=i[p],u.style.width=`${d}px`,u.style.left=`${(d+l)*p}px`,u.style.top=`${i[p]}px`;const v=u.getBoundingClientRect();i[p]+=v.height*d/v.width+l}),n.style.height=`${Math.max(...i)}px`}const c=this.elementListY.findIndex(l=>l>=e-window.innerHeight),a=o.slice(c,c+25);for(let l=0;l<a.length;l++){const r=n.children[l],m=a[l];r?r!==m&&r.replaceWith(m):n.appendChild(a[l])}}resize(e={}){window.scrollTo(0,0),e.gap&&(this.gap=e.gap),e.columns&&(this.elementListY.fill(0),this.columns===e.columns?this.itemsHeight.fill(0):(this.itemsHeight=new Float64Array(e.columns),this.columns=e.columns));const{itemsHeight:t,masonryElement:i,columns:n,gap:o}=this;this.elementList.length=25,i.replaceChildren(...this.elementList);const c=(i.getBoundingClientRect().width-o*(n-1))/n|0;this.elementList.forEach((a,l)=>{let r=t.indexOf(Math.min(...t));this.elementListY[l]=t[r],a.style.width=`${c}px`,a.style.left=`${(c+o)*r}px`,a.style.top=`${t[r]}px`;const m=a.getBoundingClientRect();t[r]+=m.height*c/m.width+o}),i.style.height=`${Math.max(...t)}px`}}const L=document.querySelector(".masonry-layout"),$=document.createElement("template"),g=new B({masonryElement:L,columns:x(),gap:16});async function I(){const s=await fetch("./data.json");if(s.ok)return await s.json();throw new Error(`code: ${s.status}, ${s.statusText}`)}async function Y(s){const e=s[0];if(e.isIntersecting)try{const t=await I();f.unobserve(e.target),$.innerHTML=t.map(o=>{const{titel:c,width:a,height:l,src:r,types:m}=o,d=m.length-1;return`
        <li class="item">
          <div class="content">
              <picture>
                ${m.map((u,y)=>y===d?`<img loading="lazy" width="${a}" height="${l}" src="${r}.${u}" alt="${c}"/>`:`<source srcset="${r}.${u}" type="image/${u}">`).join(`
`)}
              </picture>
              <p>${c}</p>
          </div>
        </li>`}).join("");const i=$.content,n=i.querySelectorAll("li");L.appendChild(i),g.render(window.scrollY,...n),f.observe(n[n.length-1])}catch(t){console.error(t)}}const f=new IntersectionObserver(Y);f.observe(L);function x(){const s=[480,800,1024,1200],e=s.findIndex(t=>window.innerWidth<=t);return e===-1?s.length+1:e+1}function w(){g.render(window.scrollY)}function P(){window.removeEventListener("scroll",w),C(()=>{f.disconnect(),g.resize({columns:x()}),f.observe(g.elementList[g.elementList.length-1]),window.addEventListener("scroll",w)},200)}window.addEventListener("scroll",w);window.addEventListener("resize",P);
