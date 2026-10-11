import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as Dt,T as y,$ as M,t as ut,p as F,i as V,l as Pt,f as O,s as St,a as j,r as D,b as et,d as z,e as B,g as mt,h as m,j as q,m as g,k as J,n as at,o as A}from"./util-DKF3zq2Q.js";const S={workDaysPerYear:261,otMultiplier:1.25,maxOtHours:4,socialRate:.045,socialCap:3e4,healthRate:.025,housingFlat:200,slBackdateDays:30},x={VL:"Vacation leave",SL:"Sick leave",LWOP:"Leave without pay"},Lt={pending:"Pending",approved:"Approved",rejected:"Rejected",cancelled:"Cancelled"},Rt={pending:"info",approved:"good",rejected:"bad",cancelled:"neutral"},Mt=["Finance","HR & Admin","IT","Operations"],C={employee:"EMP-0007",hr:"EMP-0002"};function It(e){const t={[`${e}-01-01`]:"New Year’s Day",[`${e}-04-09`]:"Day of Valor",[`${e}-05-01`]:"Labor Day",[`${e}-06-12`]:"Independence Day",[`${e}-08-21`]:"Ninoy Aquino Day",[`${e}-11-01`]:"All Saints’ Day",[`${e}-11-30`]:"Bonifacio Day",[`${e}-12-08`]:"Immaculate Conception",[`${e}-12-25`]:"Christmas Day",[`${e}-12-30`]:"Rizal Day",[`${e}-12-31`]:"New Year’s Eve"},o=new Date(e,7,31);for(;o.getDay()!==1;)o.setDate(o.getDate()-1);return t[V(o)]="National Heroes Day",t}const Q=new Map;function st(e){const t=Number(e.slice(0,4));return Q.has(t)||Q.set(t,It(t)),Q.get(t)[e]}const vt=e=>{const t=F(e).getDay();return t!==0&&t!==6&&!st(e)};function W(e,t){const o=[];if(!e||!t||e>t)return o;for(let s=e,i=0;s<=t&&i<400;s=j(s,1),i++)vt(s)&&o.push(s);return o}function I(e){const t=F(e),o=t.getFullYear(),s=t.getMonth(),i=t.getDate()<=15?"A":"B",a=i==="A"?V(new Date(o,s,1)):V(new Date(o,s,16)),d=i==="A"?V(new Date(o,s,15)):V(new Date(o,s+1,0));return{key:`${e.slice(0,7)}-${i}`,from:a,to:d,label:`${O(a,!1)} – ${O(d)}`}}function jt(){const e=I(y),t=I(j(e.from,-1)),o=I(j(t.from,-1));return[e,t,o]}const ot=(e,t)=>e===t?O(e):`${O(e,!1)} – ${O(t)}`,G=e=>`<span class="badge badge-${Rt[e]}">${Lt[e]}</span>`,ht=e=>e.split(" ").map(t=>t[0]).slice(0,2).join("");function yt(){const e=a=>j(y,a),t=(a,d)=>`${e(a)}T${d}:00`,o=y.slice(0,4),s=[["EMP-0001","Carlo Mendoza","Operations Manager","Operations","2015-03-02",85e3,"Regular",12,9],["EMP-0002","Rina Bautista","HR Officer","HR & Admin","2017-07-10",42e3,"Regular",10.5,12],["EMP-0003","Paolo Ramos","Accountant II","Finance","2018-01-15",38500,"Regular",6,8],["EMP-0004","Jessa Lim","Payroll Specialist","Finance","2019-05-06",31e3,"Regular",9,11],["EMP-0005","Mark Villanueva","Systems Administrator","IT","2016-09-01",55e3,"Regular",4.5,7],["EMP-0006","Liza Gomez","Property Custodian","HR & Admin","2020-02-17",24e3,"Regular",8,10],["EMP-0007","Maria Santos","Operations Analyst","Operations","2021-08-02",33e3,"Regular",7.5,9],["EMP-0008","Kevin Tan","Software Developer","IT","2022-04-18",48e3,"Regular",3,6],["EMP-0009","Ana Reyes","Admin Assistant","HR & Admin","2025-11-03",19500,"Probationary",1.5,2],["EMP-0010","Joel Cruz","Field Coordinator","Operations","2023-06-05",26e3,"Regular",0,5]].map(([a,d,l,r,v,h,c,u,$])=>({id:a,name:d,position:l,dept:r,hired:v,monthly:h,status:c,email:`${d.toLowerCase().replace(/ /g,".")}@kalinaw.example`,balances:{VL:u,SL:$}})),i=(a,d,l,r,v,h,c,u)=>({id:a,empId:d,type:l,from:r,to:v,reason:h,status:c,history:u,days:W(r,v).length});return{employees:s,leaves:[i("LV-0101","EMP-0008","VL",e(-1),e(1),"Family trip","approved",[{at:t(-9,"09:10"),by:"Kevin Tan",action:"Filed vacation leave"},{at:t(-8,"10:02"),by:"Rina Bautista",action:"Approved"}]),i("LV-0102","EMP-0007","SL",e(-12),e(-12),"Fever","approved",[{at:t(-11,"08:15"),by:"Maria Santos",action:"Filed sick leave"},{at:t(-11,"13:40"),by:"Rina Bautista",action:"Approved"}]),i("LV-0103","EMP-0003","VL",e(7),e(9),"Out of town","pending",[{at:t(-1,"16:20"),by:"Paolo Ramos",action:"Filed vacation leave"}]),i("LV-0104","EMP-0010","LWOP",e(-3),e(-3),"Personal errand","approved",[{at:t(-6,"11:00"),by:"Joel Cruz",action:"Filed leave without pay"},{at:t(-5,"09:30"),by:"Rina Bautista",action:"Approved"}]),i("LV-0105","EMP-0009","VL",e(2),e(4),"Vacation","rejected",[{at:t(-4,"10:45"),by:"Ana Reyes",action:"Filed vacation leave"},{at:t(-3,"14:10"),by:"Rina Bautista",action:"Rejected",remarks:"Only 1.5 days of VL left. File the rest as leave without pay."}]),i("LV-0106","EMP-0007","VL",e(14),e(15),"Sister’s wedding","pending",[{at:t(0,"08:05"),by:"Maria Santos",action:"Filed vacation leave"}])],overtime:[{id:"OT-0201",empId:"EMP-0008",date:e(-2),hours:3,reason:"Production deploy",status:"approved",history:[{at:t(-2,"21:10"),by:"Kevin Tan",action:"Filed overtime"},{at:t(-1,"09:00"),by:"Rina Bautista",action:"Approved"}]},{id:"OT-0202",empId:"EMP-0007",date:e(-4),hours:2,reason:"Month-end report",status:"approved",history:[{at:t(-4,"19:30"),by:"Maria Santos",action:"Filed overtime"},{at:t(-3,"08:50"),by:"Rina Bautista",action:"Approved"}]},{id:"OT-0203",empId:"EMP-0004",date:e(-1),hours:4,reason:"Payroll reconciliation",status:"pending",history:[{at:t(-1,"22:05"),by:"Jessa Lim",action:"Filed overtime"}]},{id:"OT-0204",empId:"EMP-0007",date:e(-1),hours:1.5,reason:"Vendor call",status:"pending",history:[{at:t(-1,"19:15"),by:"Maria Santos",action:"Filed overtime"}]}],posts:[{id:"P-3",title:"Quarterly town hall",body:"All hands at the 5th floor training room, last Friday of the month, 3 PM. Bring questions for the leadership panel.",by:"Rina Bautista",at:t(-2,"10:00"),pinned:!0},{id:"P-2",title:"Leave filing reminder",body:`Vacation leave has to be filed before it starts.
Sick leave can be filed when you get back, up to 30 days after.`,by:"Rina Bautista",at:t(-6,"15:30")},{id:"P-1",title:"Network maintenance on Saturday",body:"VPN and shared drives will be down from 8 AM to 12 NN. Save your work Friday evening.",by:"Mark Villanueva",at:t(-8,"17:45")}],items:[{code:"SUP-001",name:"Bond paper, A4",unit:"ream",stock:42,reorder:20},{code:"SUP-002",name:"Ballpen, black",unit:"box",stock:6,reorder:10},{code:"SUP-003",name:"Printer toner",unit:"cartridge",stock:3,reorder:4},{code:"SUP-004",name:"Folder, long",unit:"pack",stock:25,reorder:10},{code:"SUP-005",name:"USB flash drive, 32 GB",unit:"piece",stock:8,reorder:5},{code:"SUP-006",name:"Isopropyl alcohol, 500 mL",unit:"bottle",stock:30,reorder:12}],reqs:[{id:"RQ-0301",empId:"EMP-0007",lines:[{code:"SUP-001",qty:2},{code:"SUP-004",qty:1}],purpose:"Monthly operations reports",status:"approved",slip:`RIS-${o}-0042`,history:[{at:t(-7,"09:20"),by:"Maria Santos",action:"Requested supplies"},{at:t(-7,"11:05"),by:"Rina Bautista",action:"Approved and issued",remarks:`Issue slip RIS-${o}-0042`}]},{id:"RQ-0302",empId:"EMP-0008",lines:[{code:"SUP-005",qty:2}],purpose:"Installer media for new laptops",status:"pending",history:[{at:t(-1,"14:30"),by:"Kevin Tan",action:"Requested supplies"}]},{id:"RQ-0303",empId:"EMP-0003",lines:[{code:"SUP-003",qty:5},{code:"SUP-001",qty:3}],purpose:"Finance printer, quarter-end statements",status:"pending",history:[{at:t(0,"08:40"),by:"Paolo Ramos",action:"Requested supplies"}]}],locked:[I(j(I(y).from,-1)).key]}}const nt="harbor-hris-demo-v1",bt=["dashboard","people","leave","payroll","supplies"];function Et(){return Pt(nt,e=>{var t,o;return!!((o=(t=e.data)==null?void 0:t.employees)!=null&&o.length)})??{data:yt(),role:"employee"}}const X=()=>({type:"VL",from:"",to:"",reason:""}),rt=Et(),ct=new URLSearchParams(location.search),n={data:rt.data,role:ct.get("as")==="hr"?"hr":ct.get("as")==="employee"?"employee":rt.role,view:bt.includes(location.hash.slice(1))?location.hash.slice(1):"dashboard",calMonth:`${y.slice(0,8)}01`,person:C.employee,search:"",dept:"",leaveTab:"leave",leaveDraft:X(),otDraft:{date:y,hours:2,reason:""},cutoff:I(y).key,payslip:C.employee,cart:{},purpose:"",rejecting:null,slip:null},qt=()=>St(nt,{data:n.data,role:n.role}),p=()=>n.data,w=e=>p().employees.find(t=>t.id===e),k=()=>w(C[n.role]),f=()=>n.role==="hr",T=(e,t)=>({at:new Date().toISOString(),by:k().name,action:e,remarks:t}),U=(e,t)=>`${e}-${String(Math.max(0,...t.map(o=>Number(o.split("-").pop())))+1).padStart(4,"0")}`,H=e=>p().locked.includes(I(e).key),At=()=>p().leaves.filter(e=>e.status==="pending").length+p().overtime.filter(e=>e.status==="pending").length+p().reqs.filter(e=>e.status==="pending").length;function ft(e,t){const o=w(e),s=W(t.from,t.to),i=[];!t.from||!t.to?i.push("Pick the start and end dates."):t.from>t.to?i.push("The end date is before the start date."):s.length||i.push("That range has no working days (weekends and holidays don’t count)."),t.from&&t.type!=="SL"&&t.from<y&&i.push(`${x[t.type]} has to be filed before it starts.`),t.from&&t.type==="SL"&&t.from<j(y,-30)&&i.push(`Sick leave can only be filed up to ${S.slBackdateDays} days after the fact.`);let a=1/0;if(t.type!=="LWOP"){const l=et(p().leaves.filter(r=>r.empId===e&&r.type===t.type&&r.status==="pending").map(r=>r.days));a=o.balances[t.type]-l,s.length>a&&i.push(`Only ${a} day${a===1?"":"s"} of ${x[t.type].toLowerCase()} available${l?` (${l} held by pending requests)`:""}.`)}const d=p().leaves.find(l=>l.empId===e&&(l.status==="pending"||l.status==="approved")&&t.from&&t.to&&l.from<=t.to&&l.to>=t.from);return d&&i.push(`Overlaps ${d.id} (${ot(d.from,d.to)}).`),t.type==="LWOP"&&s.some(H)&&i.push("Payroll for part of that range is already locked."),t.reason.trim()||i.push("Add a reason."),{days:s,available:a,errors:i}}function $t(e,t){const o=[];return t.date?t.date>y?o.push("Overtime is filed after it’s rendered, not before."):H(t.date)&&o.push("Payroll for that date is already locked."):o.push("Pick the date you worked overtime."),(!(t.hours>0)||t.hours>S.maxOtHours)&&o.push(`Hours must be between 0.5 and ${S.maxOtHours}.`),p().overtime.some(s=>s.empId===e&&s.date===t.date&&s.status!=="rejected"&&s.status!=="cancelled")&&o.push("You already filed overtime for that date."),t.reason.trim()||o.push("Add a reason."),o}function Tt(e){const o=[[333333,91770.7,.35],[83333,16770.7,.3],[33333,4270.7,.25],[16667,937.5,.2],[10417,0,.15]].find(([s])=>e>s);return o?D(o[1]+(e-o[0])*o[2]):0}function Y(e,t){const o=e.monthly*12/S.workDaysPerYear,s=o/8,i=D(e.monthly/2),a=et(p().overtime.filter(b=>b.empId===e.id&&b.status==="approved"&&b.date>=t.from&&b.date<=t.to).map(b=>b.hours)),d=D(s*S.otMultiplier*a),l=p().leaves.filter(b=>b.empId===e.id&&b.type==="LWOP"&&b.status==="approved").flatMap(b=>W(b.from,b.to)).filter(b=>b>=t.from&&b<=t.to).length,r=D(o*l),v=D(i+d-r),h=D(Math.min(e.monthly,S.socialCap)*S.socialRate/2),c=D(e.monthly*S.healthRate/2),u=S.housingFlat/2,$=D(v-h-c-u),E=Tt($),L=D(h+c+u+E);return{daily:D(o),hourly:D(s),basic:i,otHours:a,otPay:d,lwopDays:l,lwop:r,gross:v,social:h,health:c,housing:u,taxable:$,tax:E,deductions:L,net:D(v-L)}}function Z(e,t,o=!0,s=""){var i;return((i=n.rejecting)==null?void 0:i.kind)===e&&n.rejecting.id===t?`<div class="inline-input">
      <input id="reject-remarks" type="text" placeholder="Reason" aria-label="Reason for rejecting" />
      <button type="button" class="btn btn-sm btn-danger" data-action="confirm-reject">Reject</button>
      <button type="button" class="btn btn-sm" data-action="cancel-reject">Cancel</button>
    </div>`:`<div class="btns">
    <button type="button" class="btn btn-sm btn-primary" data-action="approve" data-kind="${e}" data-id="${m(t)}" ${o?"":`disabled title="${m(s)}"`}>Approve</button>
    <button type="button" class="btn btn-sm" data-action="reject" data-kind="${e}" data-id="${m(t)}">Reject</button>
  </div>`}function Ot(){const e=p().leaves.filter(a=>a.status==="approved"&&a.from<=y&&a.to>=y),t=(()=>{for(let a=j(y,1),d=0;d<370;a=j(a,1),d++){const l=st(a);if(l)return{date:a,name:l}}return null})(),o=k(),s=p().leaves.filter(a=>a.empId===o.id&&a.status==="pending").length+p().overtime.filter(a=>a.empId===o.id&&a.status==="pending").length+p().reqs.filter(a=>a.empId===o.id&&a.status==="pending").length,i=f()?[A("Headcount",String(p().employees.length),`${p().employees.filter(a=>a.status==="Probationary").length} probationary`),A("On leave today",String(e.length),e.map(a=>w(a.empId).name.split(" ")[0]).join(", ")||"Everyone’s in"),A("Waiting for approval",String(At()),"Leave, overtime and supplies"),A("Low-stock items",String(p().items.filter(a=>a.stock<=a.reorder).length),"At or below reorder level")]:[A("Vacation leave",`${o.balances.VL} d`,"Available balance"),A("Sick leave",`${o.balances.SL} d`,"Available balance"),A("My pending requests",String(s),"Leave, overtime and supplies"),A("Next holiday",t?O(t.date,!1):"—",(t==null?void 0:t.name)??"")];return`
    <div class="view-head">
      <div><h1>Good day, ${m(o.name.split(" ")[0])}</h1><p>${F(y).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p></div>
    </div>
    <div class="kpis">${i.join("")}</div>
    <div class="grid-main">
      <section class="panel">${Ft()}</section>
      <section class="panel">
        <h3>Bulletin board</h3>
        ${f()?`<div class="stack" style="gap:8px">
                ${q("Title","post.title","",{attrs:'id="post-title" maxlength="80"'})}
                <label class="field"><span class="field-label">Message</span><textarea id="post-body" maxlength="600"></textarea></label>
                <div class="spread"><label class="small"><input type="checkbox" id="post-pin" /> Pin to top</label><button type="button" class="btn btn-sm btn-primary" data-action="post">Post</button></div>
              </div>`:""}
        <ul class="posts">
          ${[...p().posts].sort((a,d)=>+!!d.pinned-+!!a.pinned||d.at.localeCompare(a.at)).map(a=>`<li class="post ${a.pinned?"pinned":""}">
                <div class="spread"><h4>${a.pinned?"📌 ":""}${m(a.title)}</h4>${f()?`<button type="button" class="btn btn-sm" data-action="pin" data-id="${m(a.id)}">${a.pinned?"Unpin":"Pin"}</button>`:""}</div>
                <p>${m(a.body)}</p>
                <p class="muted small">${m(a.by)} · ${mt(a.at)}</p>
              </li>`).join("")}
        </ul>
      </section>
    </div>`}function Ft(){const e=F(n.calMonth),t=e.getFullYear(),o=e.getMonth(),s=j(n.calMonth,-e.getDay()),i=new Date(t,o+1,0),a=Math.ceil((e.getDay()+i.getDate())/7)*7,d=(h,c)=>(h-e.getDay()+7)%7+1+(c-1)*7,l=i.getDate()-(i.getDay()-5+7)%7,r={[d(1,1)]:"Ops team review",[d(3,2)]:"Fire drill",15:"Payroll cutoff",[l]:"Town hall, 3 PM",[i.getDate()]:"Payroll cutoff"},v=Array.from({length:a},(h,c)=>{const u=j(s,c),$=F(u),E=$.getMonth()===o,L=[],b=st(u);return b&&L.push(`<span class="ev ev-holiday" title="${m(b)}">${m(b)}</span>`),E&&r[$.getDate()]&&L.push(`<span class="ev ev-task">${r[$.getDate()]}</span>`),p().leaves.filter(N=>N.status==="approved"&&N.from<=u&&N.to>=u&&vt(u)).forEach(N=>{const lt=w(N.empId).name;L.push(`<span class="ev ev-leave" title="${m(lt)} · ${x[N.type]}">${m(lt.split(" ")[0])} · ${N.type}</span>`)}),`<div class="cal-day ${[!E&&"out",($.getDay()===0||$.getDay()===6)&&"weekend",u===y&&"today"].filter(Boolean).join(" ")}"><span class="cal-num">${$.getDate()}</span>${L.join("")}</div>`});return`
    <div class="cal-head">
      <h3>${e.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</h3>
      <button type="button" class="btn btn-sm" data-action="cal" data-step="-1" aria-label="Previous month">‹</button>
      <button type="button" class="btn btn-sm" data-action="cal" data-step="0">Today</button>
      <button type="button" class="btn btn-sm" data-action="cal" data-step="1" aria-label="Next month">›</button>
    </div>
    <div class="cal">
      ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(h=>`<div class="cal-dow">${h}</div>`).join("")}
      ${v.join("")}
    </div>
    <div class="legend"><span><span class="ev ev-holiday">Holiday</span></span><span><span class="ev ev-leave">On leave</span></span><span><span class="ev ev-task">Task</span></span></div>`}function Nt(){const e=n.search.trim().toLowerCase(),t=p().employees.filter(i=>(!n.dept||i.dept===n.dept)&&(!e||`${i.name} ${i.position} ${i.id}`.toLowerCase().includes(e))),o=i=>f()||i.id===k().id,s=w(n.person);return`
    <div class="view-head">
      <div><h1>People</h1><p>${f()?"Employee records, with pay and leave details.":"Company directory. You can see your own pay and leave details."}</p></div>
    </div>
    <div class="grid-main">
      <section class="panel">
        <div class="row">
          ${q("Search","search",n.search,{attrs:'placeholder="Name, position or ID" id="search"'})}
          ${at("Department","dept",n.dept,[["","All departments"],...Mt.map(i=>[i,i])])}
        </div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">ID</th><th scope="col">Name</th><th scope="col">Position</th><th scope="col">Department</th><th scope="col">Status</th>${f()?'<th scope="col" class="num">Monthly rate</th>':""}</tr></thead>
          <tbody>
            ${t.map(i=>`<tr data-open="person" data-id="${i.id}" aria-selected="${i.id===n.person}">
                    <td class="mono">${i.id}</td><td><strong>${m(i.name)}</strong></td><td>${m(i.position)}</td><td>${m(i.dept)}</td>
                    <td><span class="badge badge-${i.status==="Regular"?"good":"warn"}">${i.status}</span></td>
                    ${f()?`<td class="num">${g.format(i.monthly)}</td>`:""}
                  </tr>`).join("")||'<tr><td colspan="6" class="empty">No one matches.</td></tr>'}
          </tbody>
        </table></div>
        <p class="note">${J(t.length,"employee")}. Select a row to open the record.</p>
      </section>

      <section class="panel">
        <div class="profile-head">
          <span class="avatar" aria-hidden="true">${ht(s.name)}</span>
          <div><h3 style="text-transform:none;letter-spacing:0;color:var(--ink);font-size:16px">${m(s.name)}</h3><p class="muted">${m(s.position)} · ${m(s.dept)}</p></div>
        </div>
        <dl class="kv">
          <div><dt>Employee ID</dt><dd class="mono">${s.id}</dd></div>
          <div><dt>Email</dt><dd>${m(s.email)}</dd></div>
          <div><dt>Date hired</dt><dd>${O(s.hired)}</dd></div>
          <div><dt>Employment</dt><dd>${s.status}</dd></div>
          ${o(s)?`<div><dt>Monthly rate</dt><dd class="num">${B(s.monthly)}</dd></div><div><dt>Daily rate</dt><dd class="num">${B(Y(s,I(y)).daily)}</dd></div>`:""}
        </dl>
        ${o(s)?`<h3 class="mt">Leave balances</h3>
               <div class="balances"><div><span class="muted small">Vacation</span><strong>${s.balances.VL} d</strong></div><div><span class="muted small">Sick</span><strong>${s.balances.SL} d</strong></div></div>
               <h3 class="mt">Recent leave</h3>
               ${p().leaves.filter(i=>i.empId===s.id).slice(-4).reverse().map(i=>`<div class="spread"><span>${i.type} · ${ot(i.from,i.to)}</span>${G(i.status)}</div>`).join("")||'<p class="empty">No leave filed.</p>'}`:`<p class="note">Pay and leave details are only visible to HR and to ${m(s.name.split(" ")[0])}.</p>`}
      </section>
    </div>`}function K(e,t,o){const s=e.history[e.history.length-1];return`<tr>
    <td class="mono">${e.id}</td>
    ${t?`<td><strong>${m(w(e.empId).name)}</strong><br><span class="muted small">${m(w(e.empId).dept)}</span></td>`:""}
    <td>${e.type}</td>
    <td>${ot(e.from,e.to)}</td>
    <td class="num">${e.days}</td>
    <td class="wrap">${m(e.reason)}${s!=null&&s.remarks?`<br><span class="muted small">“${m(s.remarks)}”</span>`:""}</td>
    <td>${G(e.status)}</td>
    <td>${o}</td>
  </tr>`}function _(e,t,o){const s=e.history[e.history.length-1];return`<tr>
    <td class="mono">${e.id}</td>
    ${t?`<td><strong>${m(w(e.empId).name)}</strong></td>`:""}
    <td>${O(e.date)}</td>
    <td class="num">${e.hours}</td>
    <td class="wrap">${m(e.reason)}${s!=null&&s.remarks?`<br><span class="muted small">“${m(s.remarks)}”</span>`:""}</td>
    <td>${G(e.status)}</td>
    <td>${o}</td>
  </tr>`}function Ct(){const e=`<div class="tabs" role="tablist">
    <button type="button" role="tab" data-leave-tab="leave" aria-selected="${n.leaveTab==="leave"}">Leave</button>
    <button type="button" role="tab" data-leave-tab="ot" aria-selected="${n.leaveTab==="ot"}">Overtime</button>
  </div>`,t=`<div class="view-head"><div><h1>Leave &amp; overtime</h1><p>${f()?"Approve requests. Approved leave comes off the balance; approved overtime and unpaid leave flow into payroll.":"File leave and overtime, and track their status."}</p></div></div>`;if(f()){const a=r=>`<thead><tr>${r.map(v=>`<th scope="col" ${v==="Days"||v==="Hours"?'class="num"':""}>${v}</th>`).join("")}</tr></thead>`;if(n.leaveTab==="leave"){const r=p().leaves.filter(h=>h.status==="pending"),v=p().leaves.filter(h=>h.status!=="pending").reverse();return`${t}${e}
        <section class="panel"><h3>Waiting for approval <span class="muted">· ${r.length}</span></h3>
          ${r.length?`<div class="table-wrap"><table class="table">${a(["ID","Employee","Type","Dates","Days","Reason","Status",""])}<tbody>
            ${r.map(h=>{const c=w(h.empId),u=h.type==="LWOP"?1/0:c.balances[h.type],$=h.days>u,E=h.type==="LWOP"&&W(h.from,h.to).some(H),L=$?`Balance is ${u} d`:E?"Payroll locked":"";return K(h,!0,Z("leave",h.id,!L,L)+(L?`<span class="tag">${L}</span>`:""))}).join("")}
          </tbody></table></div>`:'<p class="empty">Nothing to approve. 🎉</p>'}
        </section>
        <section class="panel"><h3>Decided</h3><div class="table-wrap"><table class="table">${a(["ID","Employee","Type","Dates","Days","Reason","Status",""])}<tbody>${v.map(h=>K(h,!0,"")).join("")}</tbody></table></div></section>`}const d=p().overtime.filter(r=>r.status==="pending"),l=p().overtime.filter(r=>r.status!=="pending").reverse();return`${t}${e}
      <section class="panel"><h3>Waiting for approval <span class="muted">· ${d.length}</span></h3>
        ${d.length?`<div class="table-wrap"><table class="table">${a(["ID","Employee","Date","Hours","Reason","Status",""])}<tbody>${d.map(r=>_(r,!0,Z("ot",r.id,!H(r.date),"Payroll locked")+(H(r.date)?'<span class="tag">Payroll locked</span>':""))).join("")}</tbody></table></div>`:'<p class="empty">Nothing to approve. 🎉</p>'}
      </section>
      <section class="panel"><h3>Decided</h3><div class="table-wrap"><table class="table">${a(["ID","Employee","Date","Hours","Reason","Status",""])}<tbody>${l.map(r=>_(r,!0,"")).join("")}</tbody></table></div></section>`}const o=k(),s=(a,d)=>`<button type="button" class="btn btn-sm" data-action="cancel" data-kind="${a}" data-id="${d}">Cancel</button>`;if(n.leaveTab==="leave"){const a=n.leaveDraft;return`${t}${e}
      <div class="grid-main">
        <section class="panel">
          <h3>My leave requests</h3>
          <div class="table-wrap"><table class="table">
            <thead><tr><th scope="col">ID</th><th scope="col">Type</th><th scope="col">Dates</th><th scope="col" class="num">Days</th><th scope="col">Reason</th><th scope="col">Status</th><th scope="col"></th></tr></thead>
            <tbody>${p().leaves.filter(d=>d.empId===o.id).reverse().map(d=>K(d,!1,d.status==="pending"?s("leave",d.id):"")).join("")||'<tr><td colspan="7" class="empty">No requests yet.</td></tr>'}</tbody>
          </table></div>
        </section>
        <section class="panel">
          <h3>File leave</h3>
          <div class="balances"><div><span class="muted small">Vacation</span><strong>${o.balances.VL} d</strong></div><div><span class="muted small">Sick</span><strong>${o.balances.SL} d</strong></div></div>
          ${at("Type","leave.type",a.type,Object.keys(x).map(d=>[d,x[d]]))}
          <div class="row">
            ${q("From","leave.from",a.from,{type:"date"})}
            ${q("To","leave.to",a.to,{type:"date"})}
          </div>
          ${q("Reason","leave.reason",a.reason,{attrs:'maxlength="120"'})}
          <div id="leave-preview">${gt()}</div>
        </section>
      </div>`}const i=n.otDraft;return`${t}${e}
    <div class="grid-main">
      <section class="panel">
        <h3>My overtime</h3>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">ID</th><th scope="col">Date</th><th scope="col" class="num">Hours</th><th scope="col">Reason</th><th scope="col">Status</th><th scope="col"></th></tr></thead>
          <tbody>${p().overtime.filter(a=>a.empId===o.id).reverse().map(a=>_(a,!1,a.status==="pending"?s("ot",a.id):"")).join("")||'<tr><td colspan="6" class="empty">No overtime filed.</td></tr>'}</tbody>
        </table></div>
      </section>
      <section class="panel">
        <h3>File overtime</h3>
        <div class="row">
          ${q("Date worked","ot.date",i.date,{type:"date",attrs:`max="${y}"`})}
          ${q("Hours","ot.hours",i.hours,{type:"number",attrs:`min="0.5" max="${S.maxOtHours}" step="0.5" inputmode="decimal"`})}
        </div>
        ${q("Reason","ot.reason",i.reason,{attrs:'maxlength="120"'})}
        <div id="ot-preview">${kt()}</div>
      </section>
    </div>`}function gt(){const{days:e,available:t,errors:o}=ft(k().id,n.leaveDraft),s=n.leaveDraft.from&&n.leaveDraft.to&&n.leaveDraft.from<=n.leaveDraft.to?W(n.leaveDraft.from,n.leaveDraft.to).length!==Math.round((F(n.leaveDraft.to).getTime()-F(n.leaveDraft.from).getTime())/864e5)+1:!1;return`
    <dl class="kv">
      <div><dt>Working days</dt><dd>${e.length}</dd></div>
      ${n.leaveDraft.type!=="LWOP"?`<div><dt>Balance after approval</dt><dd>${t-e.length} d</dd></div>`:`<div><dt>Salary deduction</dt><dd>${B(Y(k(),I(y)).daily*e.length)}</dd></div>`}
    </dl>
    ${s?'<p class="note">Weekends and holidays in this range aren’t counted.</p>':""}
    ${z(o)}
    <div class="btns" style="justify-content:flex-end"><button type="button" class="btn btn-primary" data-action="file-leave" ${o.length?"disabled":""}>Submit request</button></div>`}function kt(){const e=$t(k().id,n.otDraft),t=Y(k(),I(y));return`
    <dl class="kv">
      <div><dt>Hourly rate</dt><dd>${B(t.hourly)}</dd></div>
      <div><dt>Overtime pay (×${S.otMultiplier})</dt><dd>${B(D(t.hourly*S.otMultiplier*(n.otDraft.hours||0)))}</dd></div>
    </dl>
    ${z(e)}
    <div class="btns" style="justify-content:flex-end"><button type="button" class="btn btn-primary" data-action="file-ot" ${e.length?"disabled":""}>Submit overtime</button></div>`}function Ht(){const e=jt(),t=e.find(r=>r.key===n.cutoff)??e[0],o=p().locked.includes(t.key),s=p().employees.map(r=>({e:r,p:Y(r,t)})),i=f()?w(n.payslip):k(),a=Y(i,t),d=r=>g.format(et(s.map(v=>v.p[r]))),l=`
    <section class="panel">
      <div class="spread"><h3>Payslip</h3><button type="button" class="btn btn-sm no-print" data-action="print">Print</button></div>
      <div><strong>${m(i.name)}</strong><p class="muted small">${i.id} · ${m(i.position)}</p><p class="muted small">Period: ${t.label}</p></div>
      <dl class="kv">
        <div><dt>Basic pay (½ of ${B(i.monthly)})</dt><dd class="num">${g.format(a.basic)}</dd></div>
        <div><dt>Overtime · ${a.otHours} h × ${g.format(a.hourly)} × ${S.otMultiplier}</dt><dd class="num">${g.format(a.otPay)}</dd></div>
        ${a.lwopDays?`<div><dt>Unpaid leave · ${J(a.lwopDays,"day")}</dt><dd class="num">−${g.format(a.lwop)}</dd></div>`:""}
        <div class="total"><dt>Gross pay</dt><dd class="num">${g.format(a.gross)}</dd></div>
        <div><dt>Social insurance</dt><dd class="num">${g.format(a.social)}</dd></div>
        <div><dt>Health insurance</dt><dd class="num">${g.format(a.health)}</dd></div>
        <div><dt>Housing fund</dt><dd class="num">${g.format(a.housing)}</dd></div>
        <div><dt>Withholding tax</dt><dd class="num">${g.format(a.tax)}</dd></div>
        <div class="total"><dt>Net pay</dt><dd class="num">${B(a.net)}</dd></div>
      </dl>
      <p class="note">Rates and the tax table are simplified and made up for the demo.</p>
    </section>`;return`
    <div class="view-head">
      <div><h1>Payroll</h1><p>Semi-monthly. Approved overtime and unpaid leave in the period are picked up automatically.</p></div>
      <div class="row no-print">
        ${at("Cutoff","cutoff",t.key,e.map(r=>[r.key,`${r.label}${p().locked.includes(r.key)?" · locked":""}`]))}
        ${f()?`<button type="button" class="btn ${o?"":"btn-primary"}" data-action="lock" ${o?"disabled":""}>${o?"Locked":"Lock payroll"}</button>`:""}
      </div>
    </div>
    ${f()?`<div class="grid-main">
            <section class="panel no-print">
              <div class="spread"><h3>Payroll register</h3><span class="badge badge-${o?"good":"warn"}">${o?"Locked":"Open"}</span></div>
              <div class="table-wrap"><table class="table">
                <thead><tr><th scope="col">Employee</th><th scope="col" class="num">Basic</th><th scope="col" class="num">OT</th><th scope="col" class="num">Unpaid</th><th scope="col" class="num">Gross</th><th scope="col" class="num">Deductions</th><th scope="col" class="num">Net pay</th></tr></thead>
                <tbody>${s.map(({e:r,p:v})=>`<tr data-open="payslip" data-id="${r.id}" aria-selected="${r.id===i.id}">
                      <td><strong>${m(r.name)}</strong><br><span class="muted small">${m(r.position)}</span></td>
                      <td class="num">${g.format(v.basic)}</td><td class="num">${v.otPay?g.format(v.otPay):"—"}</td><td class="num">${v.lwop?`−${g.format(v.lwop)}`:"—"}</td>
                      <td class="num">${g.format(v.gross)}</td><td class="num">${g.format(v.deductions)}</td><td class="num"><strong>${g.format(v.net)}</strong></td>
                    </tr>`).join("")}</tbody>
                <tfoot><tr><td>Total · ${J(s.length,"employee")}</td><td class="num">${d("basic")}</td><td class="num">${d("otPay")}</td><td class="num">${d("lwop")}</td><td class="num">${d("gross")}</td><td class="num">${d("deductions")}</td><td class="num">${d("net")}</td></tr></tfoot>
              </table></div>
              <p class="note">${o?"This cutoff is locked. Figures are final.":"Select a row to see the payslip. Lock the cutoff once figures are final."}</p>
            </section>
            ${l}
          </div>`:`<div class="grid-2">${l}</div>`}`}function it(){const e=s=>p().items.find(i=>i.code===s),t=Object.entries(n.cart).filter(([,s])=>s>0),o=[];return t.length||o.push("Add at least one item."),t.forEach(([s,i])=>{i>e(s).stock&&o.push(`Only ${e(s).stock} ${e(s).unit} of ${e(s).name} in stock.`)}),n.purpose.trim()||o.push("Add a purpose."),o}function pt(){const e=it();M("#req-checks").innerHTML=z(e),M("#file-req").disabled=e.length>0}function Bt(){var h;const e=p().items,t=c=>e.find(u=>u.code===c),o=c=>c.lines.filter(u=>t(u.code).stock<u.qty),s=c=>c.lines.map(u=>`${u.qty} ${t(u.code).unit} ${m(t(u.code).name)}`).join("<br>"),i=(c,u)=>`<tr>
    <td class="mono">${c.id}</td>${f()?`<td><strong>${m(w(c.empId).name)}</strong></td>`:""}
    <td class="wrap">${s(c)}</td><td class="wrap">${m(c.purpose)}</td><td>${G(c.status)}</td><td>${u}</td></tr>`,a=c=>c.slip?`<button type="button" class="btn btn-sm" data-action="slip" data-id="${c.id}">${c.slip}</button>`:"",d=`<thead><tr><th scope="col">ID</th>${f()?'<th scope="col">Requested by</th>':""}<th scope="col">Items</th><th scope="col">Purpose</th><th scope="col">Status</th><th scope="col"></th></tr></thead>`,l=n.slip?p().reqs.find(c=>c.id===n.slip):null,r=l!=null&&l.slip?`<section class="doc">
        <div class="doc-head">
          <div><p class="muted small">Kalinaw Holdings (demo) · Property and Supply</p><h2>Requisition and Issue Slip</h2></div>
          <div style="text-align:right"><p class="mono">${l.slip}</p><p class="muted small">${mt(l.history[l.history.length-1].at)}</p></div>
        </div>
        <dl class="kv"><div><dt>Requested by</dt><dd>${m(w(l.empId).name)} · ${m(w(l.empId).dept)}</dd></div><div><dt>Purpose</dt><dd>${m(l.purpose)}</dd></div></dl>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">Stock no.</th><th scope="col">Description</th><th scope="col">Unit</th><th scope="col" class="num">Requested</th><th scope="col" class="num">Issued</th></tr></thead>
          <tbody>${l.lines.map(c=>`<tr><td class="mono">${c.code}</td><td>${m(t(c.code).name)}</td><td>${t(c.code).unit}</td><td class="num">${c.qty}</td><td class="num">${c.qty}</td></tr>`).join("")}</tbody>
        </table></div>
        <div class="signatures">
          <div><strong>${m(w(l.empId).name)}</strong>Requested by</div>
          <div><strong>${m(((h=l.history.find(c=>c.action.startsWith("Approved")))==null?void 0:h.by)??"")}</strong>Approved by</div>
          <div><strong>Liza Gomez</strong>Issued by</div>
        </div>
        <div class="btns no-print"><button type="button" class="btn btn-primary" data-action="print">Print slip</button><button type="button" class="btn" data-action="close-slip">Close</button></div>
      </section>`:"";if(f()){const c=p().reqs.filter(u=>u.status==="pending");return`
      <div class="view-head"><div><h1>Supplies</h1><p>Approve requisitions. Approving issues the items, takes them off stock and creates an issue slip.</p></div></div>
      ${r}
      <div class="grid-main">
        <div class="stack">
          <section class="panel"><h3>Waiting for approval <span class="muted">· ${c.length}</span></h3>
            ${c.length?`<div class="table-wrap"><table class="table">${d}<tbody>${c.map(u=>{const $=o(u);return i(u,Z("req",u.id,!$.length,"Not enough stock")+($.length?`<span class="tag">Short: ${$.map(E=>m(t(E.code).name)).join(", ")}</span>`:""))}).join("")}</tbody></table></div>`:'<p class="empty">Nothing to approve. 🎉</p>'}
          </section>
          <section class="panel"><h3>Decided</h3><div class="table-wrap"><table class="table">${d}<tbody>${p().reqs.filter(u=>u.status!=="pending").reverse().map(u=>i(u,a(u))).join("")||'<tr><td colspan="6" class="empty">None yet.</td></tr>'}</tbody></table></div></section>
        </div>
        <section class="panel">
          <h3>Inventory</h3>
          <div class="table-wrap"><table class="table">
            <thead><tr><th scope="col">Item</th><th scope="col" class="num">On hand</th><th scope="col"></th></tr></thead>
            <tbody>${e.map(u=>`<tr><td>${m(u.name)}<br><span class="muted small mono">${u.code} · per ${u.unit}</span></td><td class="num">${u.stock}</td><td>${u.stock<=u.reorder?'<span class="badge badge-warn">Reorder</span>':""}</td></tr>`).join("")}</tbody>
          </table></div>
          <button type="button" class="btn btn-sm" data-action="restock">Receive delivery (+20 each low item)</button>
        </section>
      </div>`}const v=it();return`
    <div class="view-head"><div><h1>Supplies</h1><p>Request office supplies. Property approves and issues them with a requisition and issue slip.</p></div></div>
    ${r}
    <div class="grid-main">
      <section class="panel">
        <h3>My requisitions</h3>
        <div class="table-wrap"><table class="table">${d}<tbody>${p().reqs.filter(c=>c.empId===k().id).reverse().map(c=>i(c,c.status==="pending"?`<button type="button" class="btn btn-sm" data-action="cancel" data-kind="req" data-id="${c.id}">Cancel</button>`:a(c))).join("")||'<tr><td colspan="5" class="empty">No requisitions yet.</td></tr>'}</tbody></table></div>
      </section>
      <section class="panel">
        <h3>New requisition</h3>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">Item</th><th scope="col" class="num">In stock</th><th scope="col" class="num">Qty</th></tr></thead>
          <tbody>${e.map(c=>`<tr><td>${m(c.name)}<br><span class="muted small">per ${c.unit}</span></td><td class="num">${c.stock}</td><td class="num"><input class="qty" type="number" min="0" max="99" step="1" inputmode="numeric" data-cart="${c.code}" value="${n.cart[c.code]??0}" aria-label="Quantity of ${m(c.name)}" /></td></tr>`).join("")}</tbody>
        </table></div>
        ${q("Purpose","purpose",n.purpose,{attrs:'maxlength="120"'})}
        <div id="req-checks">${z(v)}</div>
        <div class="btns" style="justify-content:flex-end"><button type="button" class="btn btn-primary" data-action="file-req" id="file-req" ${v.length?"disabled":""}>Submit requisition</button></div>
      </section>
    </div>`}function Vt(){document.querySelectorAll("[data-role]").forEach(t=>t.setAttribute("aria-pressed",String(t.dataset.role===n.role)));const e=k();M("#user").innerHTML=`<span class="avatar" aria-hidden="true">${ht(e.name)}</span>${m(e.name)} · <span class="muted">${f()?"HR admin":"Employee"}</span>`}function dt(){const e=[["dashboard","Dashboard",0],["people",f()?"Employees":"People",0],["leave","Leave & overtime",f()?p().leaves.filter(t=>t.status==="pending").length+p().overtime.filter(t=>t.status==="pending").length:0],["payroll",f()?"Payroll":"My payslip",0],["supplies","Supplies",f()?p().reqs.filter(t=>t.status==="pending").length:0]];M("#nav").innerHTML=e.map(([t,o,s])=>`<button type="button" data-view="${t}" ${n.view===t?'aria-current="page"':""}><span>${o}</span>${s?`<span class="count" aria-label="${s} pending">${s}</span>`:""}</button>`).join("")}function R(){M("#view").innerHTML={dashboard:Ot,people:Nt,leave:Ct,payroll:Ht,supplies:Bt}[n.view]()}function wt(){Vt(),dt(),R()}function P(e){qt(),wt(),e&&ut(e)}function tt(e,t){return(e==="leave"?p().leaves:e==="ot"?p().overtime:p().reqs).find(o=>o.id===t)}function xt(e,t){const o=tt(e,t);if(!(!o||o.status!=="pending"))if(e==="leave"){const s=o,i=w(s.empId);if(s.type==="LWOP"&&W(s.from,s.to).some(H))return;if(s.type!=="LWOP"){if(s.days>i.balances[s.type])return;i.balances[s.type]=D(i.balances[s.type]-s.days)}s.status="approved",s.history.push(T("Approved")),P(`${s.id} approved · ${i.name.split(" ")[0]}’s ${s.type} is now ${s.type==="LWOP"?"set":`${i.balances[s.type]} d`}`)}else if(e==="ot"){if(H(o.date))return;o.status="approved",o.history.push(T("Approved")),P(`${o.id} approved · added to payroll`)}else{const s=o;if(s.lines.some(l=>p().items.find(r=>r.code===l.code).stock<l.qty))return;s.lines.forEach(l=>p().items.find(r=>r.code===l.code).stock-=l.qty);const a=y.slice(0,4),d=p().reqs.map(l=>l.slip).filter(l=>!!(l!=null&&l.startsWith(`RIS-${a}`)));s.slip=U(`RIS-${a}`,d),s.status="approved",s.history.push(T("Approved and issued",`Issue slip ${s.slip}`)),n.slip=s.id,P(`${s.id} issued · ${s.slip}`)}}document.addEventListener("click",e=>{var i;const t=e.target.closest("[data-action],[data-view],[data-role],[data-open],[data-leave-tab]");if(!t)return;if(t.dataset.view){n.view=t.dataset.view,n.rejecting=null,n.slip=null,history.replaceState(null,"",`${location.pathname}#${n.view}`),dt(),R();return}if(t.dataset.role){n.role=t.dataset.role,n.rejecting=null,n.person=C[n.role],n.payslip=C[n.role],history.replaceState(null,"",`${location.pathname}#${n.view}`),P();return}if(t.dataset.leaveTab){n.leaveTab=t.dataset.leaveTab,n.rejecting=null,R();return}if(t.dataset.open){t.dataset.open==="person"?n.person=t.dataset.id:n.payslip=t.dataset.id,R();return}const{kind:o,id:s}=t.dataset;switch(t.dataset.action){case"cal":{const a=Number(t.dataset.step),d=F(n.calMonth);n.calMonth=a===0?`${y.slice(0,8)}01`:V(new Date(d.getFullYear(),d.getMonth()+a,1)),R();break}case"post":{const a=M("#post-title").value.trim(),d=M("#post-body").value.trim();if(!a||!d){ut("Add a title and a message");return}p().posts.push({id:U("P",p().posts.map(l=>l.id)),title:a,body:d,by:k().name,at:new Date().toISOString(),pinned:M("#post-pin").checked}),P("Posted to the bulletin board");break}case"pin":{const a=p().posts.find(d=>d.id===s);a&&(a.pinned=!a.pinned),P();break}case"file-leave":{const a=n.leaveDraft,{days:d,errors:l}=ft(k().id,a);if(l.length)return;const r={id:U("LV",p().leaves.map(v=>v.id)),empId:k().id,type:a.type,from:a.from,to:a.to,days:d.length,reason:a.reason.trim(),status:"pending",history:[T(`Filed ${x[a.type].toLowerCase()}`)]};p().leaves.push(r),n.leaveDraft=X(),P(`${r.id} filed. Switch to HR admin to approve it.`);break}case"file-ot":{const a=n.otDraft;if($t(k().id,a).length)return;const d={id:U("OT",p().overtime.map(l=>l.id)),empId:k().id,date:a.date,hours:a.hours,reason:a.reason.trim(),status:"pending",history:[T("Filed overtime")]};p().overtime.push(d),n.otDraft={date:y,hours:2,reason:""},P(`${d.id} filed`);break}case"file-req":{const a=Object.entries(n.cart).filter(([,l])=>l>0).map(([l,r])=>({code:l,qty:r}));if(it().length)return;const d={id:U("RQ",p().reqs.map(l=>l.id)),empId:k().id,lines:a,purpose:n.purpose.trim(),status:"pending",history:[T("Requested supplies")]};p().reqs.push(d),n.cart={},n.purpose="",P(`${d.id} submitted`);break}case"cancel":{const a=o&&s?tt(o,s):void 0;(a==null?void 0:a.status)==="pending"&&(a.status="cancelled",a.history.push(T("Cancelled")),P(`${a.id} cancelled`));break}case"approve":o&&s&&xt(o,s);break;case"reject":o&&s&&(n.rejecting={kind:o,id:s}),R(),(i=document.getElementById("reject-remarks"))==null||i.focus();break;case"cancel-reject":n.rejecting=null,R();break;case"confirm-reject":{const a=document.getElementById("reject-remarks"),d=(a==null?void 0:a.value.trim())??"";if(!d||!n.rejecting){a==null||a.setAttribute("aria-invalid","true"),a==null||a.focus();return}const l=tt(n.rejecting.kind,n.rejecting.id);n.rejecting=null,l&&(l.status="rejected",l.history.push(T("Rejected",d)),P(`${l.id} rejected`));break}case"lock":{const a=I(n.cutoff.endsWith("A")?`${n.cutoff.slice(0,7)}-01`:`${n.cutoff.slice(0,7)}-16`);p().locked.includes(a.key)||p().locked.push(a.key),P(`Payroll for ${a.label} locked`);break}case"restock":p().items.forEach(a=>{a.stock<=a.reorder&&(a.stock+=20)}),P("Delivery received");break;case"slip":n.slip=s??null,R(),window.scrollTo({top:0,behavior:"smooth"});break;case"close-slip":n.slip=null,R();break;case"print":window.print();break;case"reset":Dt(nt),Object.assign(n,{data:yt(),role:"employee",person:C.employee,payslip:C.employee,leaveDraft:X(),cart:{},purpose:"",rejecting:null,slip:null}),P("Demo reset");break}});document.addEventListener("input",e=>{const t=e.target,o=t.dataset.field;if(t.dataset.cart){n.cart[t.dataset.cart]=Math.max(0,Math.floor(Number(t.value)||0)),pt();return}if(!(!o||t.tagName==="SELECT"))if(o==="search"){n.search=t.value,R();const s=M("#search");s.focus(),s.setSelectionRange(s.value.length,s.value.length)}else if(o.startsWith("leave.")){const s=o.slice(6);if(n.leaveDraft[s]=t.value,s==="from"&&(!n.leaveDraft.to||n.leaveDraft.to<t.value)){n.leaveDraft.to=t.value;const i=document.querySelector('[data-field="leave.to"]');i&&(i.value=t.value)}M("#leave-preview").innerHTML=gt()}else if(o.startsWith("ot.")){const s=o.slice(3);s==="hours"?n.otDraft.hours=Number(t.value):n.otDraft[s]=t.value,M("#ot-preview").innerHTML=kt()}else o==="purpose"&&(n.purpose=t.value,pt())});document.addEventListener("change",e=>{const t=e.target;if(t.tagName!=="SELECT")return;const o=t.dataset.field;if(o==="dept")n.dept=t.value;else if(o==="leave.type")n.leaveDraft.type=t.value;else if(o==="cutoff")n.cutoff=t.value;else return;R()});document.addEventListener("keydown",e=>{var t;e.key==="Enter"&&e.target.id==="reject-remarks"&&((t=document.querySelector('[data-action="confirm-reject"]'))==null||t.click())});window.addEventListener("hashchange",()=>{const e=location.hash.slice(1);bt.includes(e)&&e!==n.view&&(n.view=e,dt(),R())});wt();
