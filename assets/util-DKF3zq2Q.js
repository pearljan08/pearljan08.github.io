const n=t=>String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),m=t=>document.querySelector(t),p=t=>Math.round(t*100)/100,$=t=>t.reduce((e,a)=>e+a,0),f=(t,e)=>`${t} ${e}${t===1?"":"s"}`,d=new Intl.NumberFormat("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2}),g=t=>`₱${d.format(t)}`,c=t=>String(t).padStart(2,"0"),i=t=>`${t.getFullYear()}-${c(t.getMonth()+1)}-${c(t.getDate())}`,r=t=>{const[e,a,s]=t.split("-").map(Number);return new Date(e,a-1,s)},h=(t,e)=>{const a=r(t);return a.setDate(a.getDate()+e),i(a)},S=i(new Date);function y(t,e=!0){return r(t).toLocaleDateString("en-US",{month:"short",day:"numeric",...e?{year:"numeric"}:{}})}const D=t=>new Date(t).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});let l=0;function b(t){const e=m("#toast");e.textContent=t,e.classList.add("show"),clearTimeout(l),l=window.setTimeout(()=>e.classList.remove("show"),2400)}function v(t,e){try{const a=localStorage.getItem(t);if(a){const s=JSON.parse(a);if(e(s))return s}}catch{}return null}function w(t,e){try{localStorage.setItem(t,JSON.stringify(e))}catch{}}function k(t){try{localStorage.removeItem(t)}catch{}}function T(t,e,a,s={}){return`
    <label class="field">
      <span class="field-label">${t}</span>
      <input data-field="${e}" type="${s.type??"text"}" value="${n(a)}" ${s.attrs??""} />
      ${s.hint?`<span class="field-hint">${s.hint}</span>`:""}
    </label>`}function x(t,e,a,s){return`
    <label class="field">
      <span class="field-label">${t}</span>
      <select data-field="${e}">
        ${s.map(([o,u])=>`<option value="${n(o)}" ${o===a?"selected":""}>${n(u)}</option>`).join("")}
      </select>
    </label>`}const F=(t,e="Ready to submit")=>t.length?`<ul class="check-list">${t.map(a=>`<li>${n(a)}</li>`).join("")}</ul>`:`<p class="check-ok">✓ ${e}</p>`,I=(t,e,a="")=>`<div class="kpi"><span>${t}</span><strong>${e}</strong>${a?`<small>${a}</small>`:""}</div>`;export{m as $,S as T,h as a,$ as b,k as c,F as d,g as e,y as f,D as g,n as h,i,T as j,f as k,v as l,d as m,x as n,I as o,r as p,p as r,w as s,b as t};
