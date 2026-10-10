import"./modulepreload-polyfill-B5Qt9EMX.js";const c={rates:{12:.0075,24:.008,36:.0083,48:.0085},serviceFee:.01,processingFee:.02,docStampPer200:1.5,nthpFloor:5e3,minAmount:1e4,maxAmount:3e5,reloanPaidRatio:.3},Z=[12,24,36,48],E={maker:"j.reyes",checker:"a.lim"},ee={draft:"Draft",pending:"For approval",approved:"Approved",returned:"Returned"},d=e=>Math.round(e*100)/100,M=e=>e.reduce((t,a)=>t+a,0);function z(e){const t=c.rates[e.term]??c.rates[36],a=e.amount*t*e.term,o=(e.amount+a)/e.term,s=e.term-e.paid,r=o*s,l=a*(s*(s+1))/(e.term*(e.term+1));return{amort:d(o),balance:d(r),rebate:d(l),payoff:d(r-l),eligible:e.paid/e.term>=c.reloanPaidRatio}}function g(e){const t=c.rates[e.term],a=Number.isFinite(e.amount)?e.amount:0,o=d(a*t*e.term),s=d((a+o)/e.term),r=d(a*c.serviceFee),l=d(a*c.processingFee),f=Math.ceil(a/200)*c.docStampPer200,w=e.type==="reloan"?e.existing.filter(u=>e.payoff.includes(u.account)):[],k=w.map(z),B=d(M(k.map(u=>u.balance))),j=d(M(k.map(u=>u.rebate))),H=d(B-j),I=d(M(k.map(u=>u.amort))),N=d(e.nthp+I-s),Q=Math.max(0,e.nthp+I-c.nthpFloor),q=Math.min(c.maxAmount,Math.floor(Q*e.term/(1+t*e.term)/100)*100),O=d(a-r-l-f-H),h=[];return e.borrower.name.trim()||h.push("Borrower name is required (Borrower tab)."),a<c.minAmount&&h.push(`Loan amount must be at least ${i(c.minAmount)}.`),a>c.maxAmount&&h.push(`Loan amount can't exceed ${i(c.maxAmount)}.`),N<c.nthpFloor&&h.push(`Take-home pay after deduction would be ${i(N)}, below the ${i(c.nthpFloor)} floor. Max loanable at ${e.term} months is ${i(q)}.`),e.type==="reloan"&&(w.length===0&&h.push("Re-loan: select at least one existing loan to pay off."),w.forEach((u,X)=>{k[X].eligible||h.push(`Loan ${u.account} has ${u.paid}/${u.term} installments paid; re-loan needs ${c.reloanPaidRatio*100}% of the term paid.`)})),a>0&&O<=0&&h.push("Net proceeds must be positive."),{rate:t,interest:o,amort:s,serviceFee:r,processingFee:l,docStamp:f,oldBalance:B,rebate:j,payoff:H,freed:I,nthpAfter:N,maxLoanable:q,net:O,errors:h}}function te(e){const t=g(e),a=e.amount/e.term,o=t.interest/e.term,s=new Date;let r=d(e.amount+t.interest);return Array.from({length:e.term},(l,f)=>{const w=f===e.term-1?r:t.amort;r=d(r-w);const k=new Date(s.getFullYear(),s.getMonth()+f+2,0);return{no:f+1,due:k,principal:a,interest:o,amort:w,balance:r}})}const $=new Intl.NumberFormat("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2}),i=e=>`₱${$.format(e)}`,J=e=>new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),ae=e=>new Date(e).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}),m=e=>String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),v=e=>document.querySelector(e),oe=()=>({name:"",employeeId:"",position:"",agency:"",employedSince:"",mobile:"",coName:"",coRelation:""});function V(){return[{id:"LN-2026-0418",status:"pending",type:"reloan",term:36,amount:12e4,nthp:18250,borrower:{name:"Andrea Villanueva",employeeId:"EMP-20931",position:"Teacher III",agency:"Schools Division Office (demo)",employedSince:"2014-06-16",mobile:"0900 000 0418",coName:"Marco Villanueva",coRelation:"Spouse"},existing:[{account:"2000-1873-0021",released:"2024-08-15",amount:1e5,term:36,paid:20},{account:"2000-1990-0457",released:"2026-02-27",amount:3e4,term:12,paid:2}],payoff:["2000-1873-0021"],history:[{at:"2026-10-08T09:12:00",by:"j.reyes",action:"Created application"},{at:"2026-10-08T09:40:00",by:"j.reyes",action:"Submitted for approval"}]},{id:"LN-2026-0421",status:"draft",type:"new",term:24,amount:5e4,nthp:9800,borrower:{name:"Ramon dela Cruz",employeeId:"EMP-31877",position:"Administrative Aide IV",agency:"City Hall (demo)",employedSince:"2019-01-07",mobile:"0900 000 0421",coName:"",coRelation:""},existing:[],payoff:[],history:[{at:"2026-10-09T14:03:00",by:"j.reyes",action:"Created application"}]},{id:"LN-2026-0415",status:"returned",type:"new",term:36,amount:15e4,nthp:9200,borrower:{name:"Joel Paredes",employeeId:"EMP-27410",position:"Nurse II",agency:"Provincial Hospital (demo)",employedSince:"2017-03-01",mobile:"0900 000 0415",coName:"Ana Paredes",coRelation:"Parent"},existing:[],payoff:[],history:[{at:"2026-10-06T10:20:00",by:"j.reyes",action:"Created application"},{at:"2026-10-06T10:55:00",by:"j.reyes",action:"Submitted for approval"},{at:"2026-10-07T08:31:00",by:"a.lim",action:"Returned to maker",remarks:"Take-home pay after deduction falls below the floor. Lower the amount or extend the term."}]},{id:"LN-2026-0409",status:"approved",type:"reloan",term:48,amount:2e5,nthp:26500,borrower:{name:"Liza Manalo",employeeId:"EMP-11502",position:"Master Teacher I",agency:"Schools Division Office (demo)",employedSince:"2009-06-01",mobile:"0900 000 0409",coName:"Paolo Manalo",coRelation:"Spouse"},existing:[{account:"2000-1650-0112",released:"2023-11-30",amount:15e4,term:48,paid:34}],payoff:["2000-1650-0112"],history:[{at:"2026-10-02T13:15:00",by:"j.reyes",action:"Created application"},{at:"2026-10-02T13:48:00",by:"j.reyes",action:"Submitted for approval"},{at:"2026-10-03T09:02:00",by:"a.lim",action:"Approved"}]}]}const F="lendline-los-demo-v1";function ne(){try{const e=localStorage.getItem(F);if(e){const t=JSON.parse(e);if(Array.isArray(t.apps)&&t.apps.length)return t}}catch{}return{apps:V(),role:"maker"}}const R=ne(),n={apps:R.apps,role:R.role,selectedId:R.apps[0].id,tab:"loan",returning:!1};function b(){try{localStorage.setItem(F,JSON.stringify({apps:n.apps,role:n.role}))}catch{}}const A=()=>n.apps.find(e=>e.id===n.selectedId)??n.apps[0],D=e=>n.role==="maker"&&(e.status==="draft"||e.status==="returned");function S(e,t,a){e.history.push({at:new Date().toISOString(),by:E[n.role],action:t,remarks:a})}const _=e=>`<span class="badge badge-${e}">${ee[e]}</span>`;function re(){document.querySelectorAll("[data-role]").forEach(e=>{e.setAttribute("aria-pressed",String(e.dataset.role===n.role))}),v("#user").innerHTML=`<span class="avatar" aria-hidden="true">${E[n.role][0].toUpperCase()}</span>${E[n.role]} · <span class="muted">${n.role==="maker"?"Maker":"Checker"}</span>`,v("#new-btn").hidden=n.role!=="maker"}function x(){const e=n.role==="checker"?{pending:0,returned:1,draft:2,approved:3}:{returned:0,draft:1,pending:2,approved:3},t=[...n.apps].sort((a,o)=>e[a.status]-e[o.status]||o.id.localeCompare(a.id));v("#queue").innerHTML=t.map(a=>`
      <li>
        <button type="button" class="queue-item" data-select="${m(a.id)}" aria-current="${a.id===n.selectedId}">
          <span class="queue-row"><span class="mono">${m(a.id)}</span>${_(a.status)}</span>
          <span class="queue-name">${m(a.borrower.name||"New applicant")}</span>
          <span class="queue-row muted"><span>${a.type==="reloan"?"Re-loan":"New"} · ${a.term} mo</span><span class="num">${i(a.amount||0)}</span></span>
        </button>
      </li>`).join("")}function p(e,t,a,o){return`
    <label class="field">
      <span class="field-label">${e}</span>
      <input name="${t}" data-field="${t}" type="${o.type??"text"}" value="${m(a)}" ${o.disabled?"disabled":""} ${o.type==="number"?'inputmode="decimal" min="0" step="1000"':""} />
      ${o.hint?`<span class="field-hint">${o.hint}</span>`:""}
    </label>`}function P(e,t,a,o,s){return`
    <label class="field">
      <span class="field-label">${e}</span>
      <select name="${t}" data-field="${t}" ${s?"disabled":""}>
        ${o.map(([r,l])=>`<option value="${r}" ${String(r)===String(a)?"selected":""}>${l}</option>`).join("")}
      </select>
    </label>`}function W(e){const t=g(e),a=(o,s,r="")=>`<div class="calc-row ${r}"><dt>${o}</dt><dd class="num">${s}</dd></div>`;return`
    <dl class="calc">
      ${a("Add-on rate",`${(t.rate*100).toFixed(2)}% / mo`)}
      ${a("Total interest",i(t.interest))}
      ${a("Monthly amortization",i(t.amort),"calc-strong")}
      <div class="calc-sep"></div>
      ${a("Service fee (1%)",i(t.serviceFee))}
      ${a("Processing fee (2%)",i(t.processingFee))}
      ${a("Documentary stamp",i(t.docStamp))}
      ${e.type==="reloan"?`${a("Old balance",i(t.oldBalance))}
             ${a("Less: rebate (Rule of 78)",`−${i(t.rebate)}`)}
             ${a("Payoff of old loans",i(t.payoff))}`:""}
      <div class="calc-sep"></div>
      ${a("Net proceeds",i(t.net),"calc-total")}
      <div class="calc-sep"></div>
      ${a("Take-home pay after",i(t.nthpAfter),t.nthpAfter<c.nthpFloor?"calc-bad":"calc-good")}
      ${a("Max loanable",i(t.maxLoanable))}
    </dl>`}function Y(e){const{errors:t}=g(e);return t.length?`<ul class="check-list">${t.map(a=>`<li>${m(a)}</li>`).join("")}</ul>`:'<p class="check-ok">✓ Passes all checks</p>'}function se(e){const t=!D(e),a=t||e.type!=="reloan";return`
    <div class="loan-grid">
      <section class="panel">
        <h3>Application</h3>
        ${P("Loan type","type",e.type,[["new","New loan"],["reloan","Re-loan"]],t)}
        ${P("Term","term",e.term,Z.map(o=>[o,`${o} months`]),t)}
        ${p("Loan amount","amount",e.amount,{type:"number",disabled:t,hint:`${i(c.minAmount)} to ${i(c.maxAmount)}`})}
        ${p("Monthly take-home pay (NTHP)","nthp",e.nthp,{type:"number",disabled:t,hint:"After all current deductions"})}
      </section>

      <section class="panel panel-wide">
        <h3>Existing loans</h3>
        ${e.existing.length?`<div class="table-wrap"><table class="table">
                <thead><tr><th scope="col"><span class="sr-only">Pay off</span></th><th scope="col">Account</th><th scope="col">Released</th><th scope="col" class="num">Amount</th><th scope="col" class="num">Paid</th><th scope="col" class="num">Balance</th><th scope="col" class="num">Payoff</th></tr></thead>
                <tbody>
                ${e.existing.map(o=>{const s=z(o);return`<tr class="${s.eligible?"":"row-muted"}">
                      <td><input type="checkbox" data-payoff="${m(o.account)}" aria-label="Pay off ${m(o.account)}" ${e.payoff.includes(o.account)?"checked":""} ${a?"disabled":""} /></td>
                      <td class="mono">${m(o.account)}</td>
                      <td>${J(o.released)}</td>
                      <td class="num">${$.format(o.amount)}</td>
                      <td class="num">${o.paid}/${o.term}${s.eligible?"":' <span class="tag">Not eligible</span>'}</td>
                      <td class="num">${$.format(s.balance)}</td>
                      <td class="num">${$.format(s.payoff)}</td>
                    </tr>`}).join("")}
                </tbody></table></div>
                <p class="note">${e.type==="reloan"?"Tick the loans to pay off from the new proceeds. Unearned interest is rebated using the Rule of 78.":"Switch the loan type to <strong>Re-loan</strong> to pay these off."}</p>`:'<p class="empty">No existing loans on record.</p>'}
        <h3 class="mt">Checks</h3>
        <div id="errors">${Y(e)}</div>
      </section>

      <section class="panel">
        <h3>Computation</h3>
        <div id="computed">${W(e)}</div>
      </section>
    </div>`}function ie(e){const t=!D(e),a=e.borrower;return`
    <div class="form-grid">
      <section class="panel">
        <h3>Borrower</h3>
        ${p("Full name","borrower.name",a.name,{disabled:t})}
        ${p("Employee ID","borrower.employeeId",a.employeeId,{disabled:t})}
        ${p("Position","borrower.position",a.position,{disabled:t})}
        ${p("Agency / employer","borrower.agency",a.agency,{disabled:t})}
        ${p("Employed since","borrower.employedSince",a.employedSince,{type:"date",disabled:t})}
        ${p("Mobile","borrower.mobile",a.mobile,{disabled:t})}
      </section>
      <section class="panel">
        <h3>Co-obligor</h3>
        ${p("Full name","borrower.coName",a.coName,{disabled:t})}
        ${P("Relationship","borrower.coRelation",a.coRelation,[["","—"],["Spouse","Spouse"],["Parent","Parent"],["Sibling","Sibling"],["Other","Other"]],t)}
      </section>
    </div>`}function ce(e){return`
    <section class="panel">
      <h3>Amortization schedule <span class="muted">· monthly, every last day of the month</span></h3>
      <div class="table-wrap table-scroll"><table class="table">
        <thead><tr><th scope="col">#</th><th scope="col">Due date</th><th scope="col" class="num">Principal</th><th scope="col" class="num">Interest</th><th scope="col" class="num">Amortization</th><th scope="col" class="num">Balance</th></tr></thead>
        <tbody>
          ${te(e).map(a=>`<tr><td>${a.no}</td><td>${J(a.due)}</td><td class="num">${$.format(a.principal)}</td><td class="num">${$.format(a.interest)}</td><td class="num">${$.format(a.amort)}</td><td class="num">${$.format(a.balance)}</td></tr>`).join("")}
        </tbody>
      </table></div>
    </section>`}function le(e){return`
    <section class="panel">
      <h3>Audit trail</h3>
      <ol class="timeline">
        ${[...e.history].reverse().map(t=>`<li>
              <span class="timeline-dot" aria-hidden="true"></span>
              <div>
                <p><strong>${m(t.action)}</strong> <span class="muted">by ${m(t.by)}</span></p>
                <p class="muted small">${ae(t.at)}</p>
                ${t.remarks?`<p class="remark">“${m(t.remarks)}”</p>`:""}
              </div>
            </li>`).join("")}
      </ol>
    </section>`}function L(e){const{errors:t}=g(e),a=t.length===0;return n.role==="maker"?D(e)?`
      <p class="muted">${a?"Ready to submit.":`${t.length} issue${t.length>1?"s":""} to fix before submitting.`}</p>
      <div class="actions-btns">
        <button type="button" class="btn" data-action="save">Save draft</button>
        <button type="button" class="btn btn-primary" data-action="submit" ${a?"":"disabled"}>Submit for approval</button>
      </div>`:`<p class="muted">${e.status==="pending"?"Waiting for a checker. Switch to <strong>Checker</strong> above to review it.":"This application is closed."}</p>`:e.status!=="pending"?`<p class="muted">${e.status==="approved"?"Approved. Nothing left to review.":"Not submitted yet. Only applications that are <strong>For approval</strong> can be reviewed."}</p>`:n.returning?`
      <label class="field grow">
        <span class="field-label">Reason for returning</span>
        <input id="return-remarks" type="text" placeholder="Tell the maker what to fix" />
      </label>
      <div class="actions-btns">
        <button type="button" class="btn" data-action="cancel-return">Cancel</button>
        <button type="button" class="btn btn-danger" data-action="confirm-return">Return to maker</button>
      </div>`:`
    <p class="muted">${a?"All checks pass.":"This application fails checks and can’t be approved."}</p>
    <div class="actions-btns">
      <button type="button" class="btn" data-action="return">Return</button>
      <button type="button" class="btn btn-primary" data-action="approve" ${a?"":"disabled"}>Approve</button>
    </div>`}function C(){const e=A(),t=g(e),a=[...e.history].reverse().find(r=>r.action==="Returned to maker"),o=[["loan","Loan info"],["borrower","Borrower"],["schedule","Schedule"],["history","History"]],s={loan:se,borrower:ie,schedule:ce,history:le}[n.tab](e);v("#detail").innerHTML=`
    <div class="detail-head">
      <div>
        <p class="mono muted">${m(e.id)} · ${e.type==="reloan"?"Re-loan":"New loan"}</p>
        <h1>${m(e.borrower.name||"New applicant")}</h1>
        <p class="muted">${m([e.borrower.position,e.borrower.agency].filter(Boolean).join(" · ")||"No employment details yet")}</p>
      </div>
      <div class="head-figures">
        ${_(e.status)}
        <div><span class="muted small">Amount</span><strong class="num">${i(e.amount||0)}</strong></div>
        <div><span class="muted small">Monthly</span><strong class="num" id="head-amort">${i(t.amort)}</strong></div>
      </div>
    </div>

    ${e.status==="returned"&&(a!=null&&a.remarks)?`<div class="callout"><strong>Returned by ${m(a.by)}:</strong> ${m(a.remarks)}</div>`:""}

    <div class="tabs" role="tablist">
      ${o.map(([r,l])=>`<button type="button" role="tab" data-tab="${r}" aria-selected="${n.tab===r}">${l}</button>`).join("")}
    </div>

    <div class="tab-body" role="tabpanel">${s}</div>

    <div class="actions" id="actions">${L(e)}</div>`}function G(){const e=A(),t=document.getElementById("computed");t&&(t.innerHTML=W(e));const a=document.getElementById("errors");a&&(a.innerHTML=Y(e));const o=document.getElementById("head-amort");o&&(o.textContent=i(g(e).amort)),v("#actions").innerHTML=L(e)}function y(){re(),x(),C()}let U=0;function T(e){const t=v("#toast");t.textContent=e,t.classList.add("show"),clearTimeout(U),U=window.setTimeout(()=>t.classList.remove("show"),2200)}function K(e,t,a){if(t.startsWith("borrower.")){const o=t.slice(9);e.borrower[o]=a}else t==="type"?(e.type=a,e.type==="new"&&(e.payoff=[])):(t==="term"||t==="amount"||t==="nthp")&&(e[t]=a===""?0:Number(a))}document.addEventListener("click",e=>{var o,s;const t=e.target.closest("[data-action],[data-select],[data-tab],[data-role]");if(!t)return;const a=A();if(t.dataset.select){n.selectedId=t.dataset.select,n.returning=!1,y();return}if(t.dataset.tab){n.tab=t.dataset.tab,C();return}if(t.dataset.role){n.role=t.dataset.role,n.returning=!1,b(),y();return}switch(t.dataset.action){case"new":{const r=Math.max(...n.apps.map(f=>Number(f.id.split("-").pop())))+1,l={id:`LN-2026-${String(r).padStart(4,"0")}`,status:"draft",type:"new",term:36,amount:5e4,nthp:15e3,borrower:oe(),existing:[],payoff:[],history:[]};S(l,"Created application"),n.apps.push(l),n.selectedId=l.id,n.tab="borrower",b(),y(),(o=document.querySelector('[data-field="borrower.name"]'))==null||o.focus();break}case"save":S(a,"Saved draft"),b(),T("Draft saved"),x();break;case"submit":if(g(a).errors.length)return;a.status="pending",S(a,"Submitted for approval"),b(),T(`${a.id} submitted for approval`),y();break;case"approve":if(g(a).errors.length)return;a.status="approved",S(a,"Approved"),b(),T(`${a.id} approved`),y();break;case"return":n.returning=!0,v("#actions").innerHTML=L(a),(s=document.getElementById("return-remarks"))==null||s.focus();break;case"cancel-return":n.returning=!1,v("#actions").innerHTML=L(a);break;case"confirm-return":{const r=document.getElementById("return-remarks"),l=(r==null?void 0:r.value.trim())??"";if(!l){r==null||r.focus(),r==null||r.setAttribute("aria-invalid","true");return}a.status="returned",S(a,"Returned to maker",l),n.returning=!1,b(),T(`${a.id} returned to maker`),y();break}case"reset":try{localStorage.removeItem(F)}catch{}n.apps=V(),n.role="maker",n.selectedId=n.apps[0].id,n.tab="loan",n.returning=!1,y(),T("Demo reset");break}});document.addEventListener("input",e=>{const t=e.target;if(!t.dataset.field||t.tagName!=="INPUT")return;const a=A();K(a,t.dataset.field,t.value),b(),t.dataset.field==="borrower.name"&&x(),G()});document.addEventListener("change",e=>{const t=e.target,a=A();if(t instanceof HTMLSelectElement&&t.dataset.field)K(a,t.dataset.field,t.value),b(),x(),C();else if(t instanceof HTMLInputElement&&t.dataset.payoff){const o=t.dataset.payoff;a.payoff=t.checked?[...a.payoff,o]:a.payoff.filter(s=>s!==o),b(),G()}});document.addEventListener("keydown",e=>{var t;e.key==="Enter"&&e.target.id==="return-remarks"&&((t=document.querySelector('[data-action="confirm-return"]'))==null||t.click())});y();
