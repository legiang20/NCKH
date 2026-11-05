// ================= TRẮC NGHIỆM (sinh câu hỏi từ chính cây đang hiển thị) =================
let Q=null,QS=[0,0];
const wk=()=>{const m={},list=[];(function f(n,d,k,p){if(!n)return;const e={n,d,k,p};m[n.id]=e;list.push(e);f(n.l,d+1,2*k+1,e);f(n.r,d+1,2*k+2,e)})(root,0,0,null);return{m,list}};
const seqIds=k=>{const s=tSteps(k);return s.length?s[s.length-1].out:[]};
const dv=id=>disp(byId(id));
function mc(t,r,w,why,run){w=[...new Set(w.map(String))].filter(x=>x!==String(r));if(w.length<2)return null;const o=sh([String(r),...sh(w).slice(0,3)]);return{t,o,a:o.indexOf(String(r)),why,run}}
const QG=[
 ()=>{const{list}=wk(),h=Math.max(...list.map(e=>e.d)),ids=list.filter(e=>e.d==h).map(e=>e.n.id);return mc('Chiều cao của cây (mức cao nhất của các nút) là bao nhiêu?',h,[h+1,h+2,h-1,h+3,list.length],'Mức của gốc là 0, mỗi bước xuống tăng 1 mức. Nút sâu nhất ở mức '+h+'.',()=>show(ids,'Nút sâu nhất ở mức '+h))},
 ()=>{const{list}=wk(),e=rn(list);return mc('Nút '+dv(e.n.id)+' ở mức mấy?',e.d,[e.d+1,e.d+2,e.d-1,e.d+3],'Số cạnh từ gốc xuống nút này là '+e.d+'.',()=>show([e.n.id],'Mức '+e.d))},
 ()=>{const{list}=wk(),e=rn(list),g=(e.n.l?1:0)+(e.n.r?1:0);return mc('Bậc của nút '+dv(e.n.id)+' là bao nhiêu?',g,[0,1,2,3],'Bậc của nút là số nút con của nó.',()=>show([e.n.id],'Bậc '+g))},
 ()=>{const{list}=wk(),e=rn(list),k=e.k;return mc('Khi biểu diễn bằng mảng, nút '+dv(e.n.id)+' nằm ở chỉ số k nào?',k,[k+1,k+2,2*k+1,k+3,k-1],'Gốc k = 0; con trái 2k+1, con phải 2k+2. Nút này có k = '+k+'.',()=>show([e.n.id],'k = '+k))},
 ()=>{const k=rn([0,1,2,3,4,5]),s=rn(['trái','phải']),r=s=='trái'?2*k+1:2*k+2;return mc('Nút có chỉ số k = '+k+' thì nút con '+s+' có chỉ số bao nhiêu?',r,[2*k+1,2*k+2,2*k,k+1,2*k+3],'left(k) = 2k+1 và right(k) = 2k+2.')},
 ()=>{const k=rn(['pre','in','post','rin']),f=x=>seqIds(x).map(dv).join(' ');return mc('Kết quả '+TNm[k]+' của cây đang hiển thị là:',f(k),[...['pre','in','post','rin'].filter(x=>x!=k).map(f),sh(seqIds(k)).map(dv).join(' ')],'Thứ tự đúng: '+f(k)+'.',()=>setSteps(tSteps(k),k))},
 ()=>{const{list}=wk(),n=list.length,h=Math.max(...list.map(e=>e.d)),mx=Math.max(...list.map(e=>e.k)),c=n==2**(h+1)-1?'Hoàn hảo':mx==n-1?'Hoàn chỉnh (nhưng không hoàn hảo)':'Không hoàn hảo và không hoàn chỉnh';return mc('Cây đang hiển thị thuộc loại nào?',c,['Hoàn hảo','Hoàn chỉnh (nhưng không hoàn hảo)','Không hoàn hảo và không hoàn chỉnh'],'Hoàn hảo: n = 2^(h+1) − 1. Hoàn chỉnh: chỉ số mảng liên tục 0…n−1, không có None. Ở đây n = '+n+', h = '+h+'.')}];
// ================= PHÂN HỆ TRÒ CHƠI & TRẮC NGHIỆM (sinh câu hỏi từ cây thật, có gợi ý, điểm, huy hiệu) =================
const NAM={pre:'Preorder (NLR)',in:'Inorder (LNR)',post:'Postorder (LRN)',lvl:'Level Order (theo mức)'},TP={cau:'Cấu trúc cây',dut:'Phép duyệt',pt:'Phân tích cây',bst:'Cây BST',vd:'Vận dụng',dk:'Điền khuyết',sx:'Sắp xếp'};
const RU={pre:'thăm nút gốc N trước, rồi cây con trái L, rồi cây con phải R',in:'duyệt cây con trái L, rồi thăm nút N, rồi cây con phải R',post:'duyệt cây con trái L, rồi cây con phải R, cuối cùng mới thăm nút N',lvl:'duyệt từng mức từ trên xuống, mỗi mức đi từ trái sang phải'};
const HT={pt:'Nhớ quy ước: gốc ở mức 0, nút lá có chiều cao 0, bậc của nút là số con của nó.'};
const LS={g:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const HS={g:()=>LS.g('arbt_hist',[]),add(r){const h=HS.g();h.push(r);LS.s('arbt_hist',h.slice(-100))}};
const LB={g:()=>LS.g('arbt_lb',[]),add(r){const h=LB.g();h.push(r);h.sort((a,b)=>b.sc-a.sc);LS.s('arbt_lb',h.slice(0,10))}};
var QX={on:0,recent:[],tpl:[],cold:0,lt:null,sel:null,focus:null,revK:null,timed:0,streak:0,mx:0,wrong:[],cfg:{src:'cur',link:1,type:'auto',lv:1,n:7,tps:['cau','dut','pt','bst','vd'],tys:['mc','tf','fill','ord','essay'],cnt:10,comp:0,name:'Học sinh'}};
var CH={on:0};
// ================= CẤP ĐỘ KHÓ · HỆ THỐNG ĐIỂM · HIỆU ỨNG PHẢN HỒI (dùng chung cho Trắc nghiệm và các trò chơi) =================
// Cấp độ quyết định: số mạng, hệ số thời gian, số lượt gợi ý, hệ số điểm và độ khó câu hỏi / màn chơi. "Tùy chỉnh" (lv = 0) tính như Trung bình.
const DIF={
 1:{n:'Dễ',e:'🟢',lives:5,tm:1.5,mul:1,hints:3,qt:30000,tag:'5 mạng · thời gian +50% · 3 gợi ý · điểm ×1'},
 2:{n:'Trung bình',e:'🟡',lives:3,tm:1,mul:1.5,hints:2,qt:25000,tag:'3 mạng · thời gian chuẩn · 2 gợi ý · điểm ×1,5'},
 3:{n:'Khó',e:'🔴',lives:2,tm:.7,mul:2,hints:1,qt:20000,tag:'2 mạng · thời gian −30% · 1 gợi ý · điểm ×2'}};
const dfl=()=>QX.cfg.lv>0?QX.cfg.lv:2,dfi=()=>DIF[dfl()];
const stars=a=>a>=.9?3:a>=.7?2:a>0?1:0,starTxt=n=>'⭐'.repeat(n)+'☆'.repeat(3-n);
const GNAME=['','Duyệt đúng thứ tự','Săn nút','Đi tìm khoá','Đoán nút tiếp theo','Sửa cây lỗi','Truy tìm nút','Thử thách tổng hợp'];
const HN={g1:GNAME[1],g2:GNAME[2],g3:GNAME[3],g4:GNAME[4],g5:GNAME[5],g6:GNAME[6],g7:GNAME[7],all:'Trải nghiệm toàn diện'};
const CHN=['📖 Luyện tập','👣 Đoán nút tiếp theo','🔍 Truy tìm nút','🛠 Sửa cây lỗi'];
// Kỷ lục lưu riêng cho từng trò chơi và từng cấp độ
const BS={g:m=>(LS.g('arbt_best2',{})[m+'_'+dfl()]||0),s(m,v){const o=LS.g('arbt_best2',{});o[m+'_'+dfl()]=v;LS.s('arbt_best2',o)}};
// Âm thanh: mỗi phần tử [tần số, độ trễ ms]; rung điện thoại; hiệu ứng nhấp nháy viền màn hình + chữ bay lên
const SND={ok:[[660,0],[880,90]],combo:[[660,0],[880,80],[1100,160]],bad:[[220,0],[165,120]],win:[[523,0],[659,110],[784,220],[1047,330]],lose:[[330,0],[262,150],[196,300]],tick:[[900,0]],hint:[[420,0],[520,90]]};
const sfx=s=>s.forEach(([f,t])=>setTimeout(()=>beep(f),t));
const buzz=p=>{try{if(navigator.vibrate)navigator.vibrate(p)}catch(e){}};
function gfx(k,txt,quiet){                       // k: ok | bad | win ; quiet = chỉ hiện chữ, không nháy viền
  if(!quiet){let v=$('#fxv');if(!v){v=document.createElement('div');v.id='fxv';document.body.appendChild(v)}v.className='';void v.offsetWidth;v.className='f-'+k;
    const pn=GM.on?$('#gm'):$('#mo>div');
    if(pn&&(k=='ok'||k=='bad')){const c='fx-'+k;pn.classList.remove('fx-ok','fx-bad');void pn.offsetWidth;pn.classList.add(c);setTimeout(()=>pn.classList.remove(c),600)}}
  if(txt){const p=document.createElement('div');p.className='fxp '+k;p.textContent=txt;document.body.appendChild(p);setTimeout(()=>p.remove(),1200)}}
(function(){const st=document.createElement('style');st.textContent=`
#fxv{position:fixed;inset:0;z-index:14;pointer-events:none;opacity:0}
#fxv.f-ok{animation:fxv .55s ease-out;background:radial-gradient(circle,transparent 55%,#2bd96b66)}
#fxv.f-bad{animation:fxv .55s ease-out;background:radial-gradient(circle,transparent 50%,#ff3b4e77)}
#fxv.f-win{animation:fxv .95s ease-out;background:radial-gradient(circle,transparent 45%,#ffc93c77)}
@keyframes fxv{0%{opacity:0}20%{opacity:1}100%{opacity:0}}
.fx-ok{animation:fxok .5s}.fx-bad{animation:fxbad .45s}#gm.fx-bad{animation:fxbadg .45s}
@keyframes fxok{0%{box-shadow:0 0 0 0 #2bd96b00}30%{box-shadow:0 0 0 4px #2bd96bcc,0 0 28px #2bd96b88}100%{box-shadow:0 0 0 0 #2bd96b00}}
@keyframes fxbad{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}
@keyframes fxbadg{0%,100%{left:50%}20%{left:calc(50% - 7px)}40%{left:calc(50% + 6px)}60%{left:calc(50% - 4px)}80%{left:calc(50% + 3px)}}
.fxp{position:fixed;left:50%;top:34%;z-index:16;pointer-events:none;font-weight:900;font-size:26px;white-space:nowrap;text-shadow:0 2px 10px #000a;transform:translate(-50%,0);animation:fxp 1.1s ease-out forwards}
.fxp.ok{color:#5cf08f}.fxp.bad{color:#ff6b6b}.fxp.win{color:#ffd43b;font-size:30px}
[data-theme=light] .fxp{text-shadow:0 2px 8px #fff}[data-theme=light] .fxp.ok{color:#1b9a49}[data-theme=light] .fxp.bad{color:#d6336c}[data-theme=light] .fxp.win{color:#e67700}
@keyframes fxp{0%{opacity:0;transform:translate(-50%,10px) scale(.7)}18%{opacity:1;transform:translate(-50%,0) scale(1.15)}100%{opacity:0;transform:translate(-50%,-46px) scale(1)}}
@keyframes fxpr{0%,100%{opacity:0}15%,80%{opacity:1}}
@media (prefers-reduced-motion:reduce){#fxv,.fx-ok,.fx-bad,#gm.fx-bad{animation:none!important}.fxp{animation:fxpr 1.4s forwards}}
#gF{min-height:20px;margin:4px 0 6px;font-size:13px;line-height:1.4}
#gF.ok{color:#5cf08f}#gF.bad{color:#ff8787}#gF.info{color:#ffe08a}
[data-theme=light] #gF.ok{color:#1b7a3a}[data-theme=light] #gF.bad{color:#c92a2a}[data-theme=light] #gF.info{color:#a15c00}
#gm .bar i.warn{animation:gwarn .45s infinite alternate}@keyframes gwarn{to{opacity:.45}}
#gm button:disabled{opacity:.4}
.qinf{display:flex;justify-content:space-between;font-size:12px;opacity:.85;margin-bottom:4px;font-weight:600}
#mo .fb{margin:8px 0;padding:10px 12px;border-radius:12px;border:1px solid var(--l);font-weight:400;line-height:1.45}
#mo .fb.ok{background:#2bd96b1f;border-color:#2bd96b88}#mo .fb.bad{background:#ff3b4e1f;border-color:#ff3b4e88}
#mo .fb h5{margin:0 0 4px;font-size:15px;font-weight:800}#mo .fb .exp{margin-top:4px}
#mo .pts{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}#mo .pts span{padding:1px 9px;border-radius:999px;background:#ffffff22;font-size:12px;font-weight:700}
#mo .qhi{color:#ffa94d;font-weight:600;margin:6px 0}[data-theme=light] #mo .qhi{color:#c2410c}
#mo .stars{font-size:28px;letter-spacing:4px}
#mo details.rv{margin:8px 0;border:1px solid var(--l);border-radius:10px;padding:6px 10px}#mo details.rv summary{cursor:pointer;font-weight:700}
#mo .rvi{margin:8px 0;padding-top:6px;border-top:1px dashed var(--l);font-weight:400}
#mo .dfr{display:flex;gap:6px;margin:0 0 4px}#mo .dfr .bt{flex:1;margin-top:0;text-align:center;padding:8px 4px}#mo .dfr .bt.on{outline:2px solid #ffc93c}
`;document.head.appendChild(st)})();
// Đáp án đúng dưới dạng chữ (dùng cho phản hồi và danh sách câu sai)
const ansText=q=>q.k=='mc'?String(q.o[q.a]):q.k=='fill'?String(q.ans):q.k=='ord'?q.ans.map(id=>{const it=q.items.find(x=>x.id==id);return it?it.v:'?'}).join(' → '):String(q.model||'');

// Mục 1: CHỦ ĐỀ · Mục 2: DẠNG CÂU HỎI
const TOP=[['cau','Nhận biết cấu trúc cây'],['dut','Phép duyệt cây'],['pt','Phân tích cây'],['bst','Cây BST'],['vd','Vận dụng']];
const TYP=[['mc','Trắc nghiệm'],['tf','Đúng / Sai'],['fill','Điền khuyết'],['ord','Sắp xếp thứ tự'],['essay','Tự luận']];
const qTitle=()=>CH.on?'🌟 Toàn diện · chặng '+CH.i+'/'+CHP.length:QX.timed?'⏱ Thử thách thời gian':'📖 Luyện tập';
const sq=(t,k)=>{const a=[];if(k=='lvl'){const q=t?[t]:[];for(let i=0;i<q.length;i++){a.push(q[i]);q[i].l&&q.push(q[i].l);q[i].r&&q.push(q[i].r)}}else(function f(n){if(!n)return;k=='pre'&&a.push(n);f(n.l);k=='in'&&a.push(n);f(n.r);k=='post'&&a.push(n)})(t);return a};
const sv=(t,k)=>sq(t,k).map(n=>n.v),jn=a=>a.join(' '),fd=(a,b)=>{let i=0;while(i<a.length&&i<b.length&&a[i]==b[i])i++;return i};
const bad=(n,lo=-Infinity,hi=Infinity)=>n?(n.v>lo&&n.v<hi?bad(n.l,lo,n.v)||bad(n.r,n.v,hi):n):null;   // nút đầu tiên vi phạm BST (null = hợp lệ)
const insB=(t,v)=>{if(!t)return{v,l:null,r:null};let c=t;for(;;){const d=v<c.v?'l':'r';if(!c[d]){c[d]={v,l:null,r:null};break}c=c[d]}return t};
const delB=(t,v)=>{if(!t)return null;if(v<t.v)t.l=delB(t.l,v);else if(v>t.v)t.r=delB(t.r,v);else{if(!t.l)return t.r;if(!t.r)return t.l;let m=t.r;while(m.l)m=m.l;t.v=m.v;t.r=delB(t.r,m.v)}return t};
const dist=a=>{const o=[];for(let t=0;t<10&&o.length<5;t++){const b=[...a],i=Math.random()*(b.length-1)|0;[b[i],b[i+1]]=[b[i+1],b[i]];const s=jn(b);if(s!=jn(a)&&!o.includes(s))o.push(s)}return o};

// ---- sinh cây ngẫu nhiên theo loại: nor (thường) · bst · bal (cân bằng) · left · right · khuyet ----
function genTree(type,n){const ns=[],D=new Map(),r=mk(0);ns.push(r);D.set(r,0);
  const add=(p,s)=>{const x=mk(0);p[s]=x;ns.push(x);D.set(x,D.get(p)+1)};
  for(let i=1;i<n;i++){
    if(type=='bal'){add(ns[(i-1)>>1],i%2?'l':'r');continue}
    let fr=[];ns.forEach(x=>{!x.l&&fr.push([x,'l']);!x.r&&fr.push([x,'r'])});
    const last=ns[ns.length-1];let pk;
    if(type=='left'||type=='right'){const s=type=='left'?'l':'r',o=s=='l'?'r':'l';pk=!last[s]&&Math.random()<.78?[last,s]:rn(fr.filter(f=>f[1]==s&&Math.random()<.8).concat(fr))}
    else if(type=='khuyet'){const lf=fr.filter(f=>!f[0].l&&!f[0].r);pk=lf.length&&Math.random()<.7?rn(lf):rn(fr)}
    else pk=rn(fr);
    add(pk[0],pk[1])}
  const vs=sh([...Array(40)].map((_,i)=>i+1)).slice(0,n);
  if(type=='nor')ns.forEach((x,i)=>x.v=vs[i]);else{vs.sort((a,b)=>a-b);let i=0;(function f(x){if(!x)return;f(x.l);x.v=vs[i++];f(x.r)})(r)}
  return r}
const LV={1:{n:[5,7],t:['bal','bst','nor']},2:{n:[8,12],t:['nor','bst','khuyet']},3:{n:[9,13],t:['left','right','khuyet']}};
function cfgTree(c){const L=LV[c.lv],t=c.type&&c.type!='auto'?c.type:rn((L||LV[2]).t),n=L?L.n[0]+(Math.random()*(L.n[1]-L.n[0]+1)|0):c.n;return genTree(t,n)}
function setTree(t){root=t;S.sel=null;S.grow=1;clear();refresh()}

// ---- bộ sinh câu hỏi: [chủ đề, cấp tối thiểu, hàm] ----
const ND=()=>wk().list,vl=()=>ND().map(e=>e.n.v);
const rnE=l=>{const q=QX.sel;if(q&&Math.random()<.5){const f=l.find(e=>(e.n||e).id==q);if(f)return f}return rn(l)};   // ưu tiên nút người học đang chọn
const Qm=(tp,lv,t,r,w,why,o={})=>{w=w.filter(x=>!(typeof x=='number'&&x<0));const q=mc(t,r,w,why,o.run);if(q)Object.assign(q,{k:'mc',tp,lv,hint:o.hint||HT[tp]||'',hl:o.hl||null,sid:o.sid||null});return q};
const Qb=(tp,lv,t,yes,why,o)=>({k:'mc',tf:1,tp,lv,t,o:['Có','Không'],a:yes?0:1,why,hint:o.hint,hl:o.hl||null,run:o.run});
const kk=()=>QX.focus&&Math.random()<.5?QX.focus:rn(['pre','in','post','lvl']),runK=(k,ids)=>{const f=k=='lvl'?()=>show(ids,NAM.lvl):()=>setSteps(tSteps(k),k);f.kd=k;return f};
const G2=[
 ['cau',1,()=>Qm('cau',1,'Nút gốc của cây là nút nào?',root.v,vl(),'Nút gốc là nút duy nhất không có cha, nằm trên cùng (mức 0).',{hint:'Tìm nút nằm trên cùng, không có nút nào trỏ tới nó.',hl:[root.id],run:()=>show([root.id],'Nút gốc')})],
 ['cau',1,()=>{const l=ND().filter(e=>!e.n.l&&!e.n.r),n=l.length;return Qm('cau',1,'Cây có bao nhiêu nút lá?',n,[n+1,n+2,n-1,n-2,ND().length],'Nút lá là nút không có con. Các nút lá: '+l.map(e=>e.n.v).join(', ')+'.',{hint:'Nút lá là nút không có cả con trái lẫn con phải.',run:()=>show(l.map(e=>e.n.id),'Các nút lá')})}],
 ['cau',1,()=>{const n=ND().length,ed=Math.random()<.5,r=ed?n-1:n;return Qm('cau',1,ed?'Cây có bao nhiêu cạnh?':'Cây có tất cả bao nhiêu nút?',r,[r+1,r+2,r-1,r-2,ed?n:n-1],ed?'Cây có n nút thì có n − 1 cạnh: '+n+' − 1 = '+(n-1)+'.':'Đếm tất cả các nút, kể cả gốc và lá: '+n+'.',{hint:ed?'Mỗi nút (trừ gốc) có đúng một cạnh nối lên cha.':'Đếm từng nút, kể cả gốc và lá.'})}],
 ['cau',1,()=>{const e=rnE(ND().filter(e=>e.p));if(!e)return null;const p=e.p.n;return Qm('cau',1,'Nút cha của nút '+e.n.v+' là nút nào?',p.v,vl(),'Nút '+e.n.v+' là con '+(p.l===e.n?'trái':'phải')+' của nút '+p.v+'.',{hint:'Đi ngược lên một cạnh từ nút '+e.n.v+'.',hl:[e.n.id],run:()=>show([p.id,e.n.id],'Cha → con')})}],
 ['cau',1,()=>{const e=rnE(ND()),d=rn(['l','r']),c=e.n[d],s=d=='l'?'trái':'phải';return Qm('cau',1,'Con '+s+' của nút '+e.n.v+' là nút nào?',c?c.v:'Không có',[...vl(),'Không có'],c?'Con '+s+' của '+e.n.v+' là '+c.v+'.':'Nút '+e.n.v+' không có con '+s+'.',{hint:'Nhìn nhánh bên '+s+' đi xuống từ nút '+e.n.v+'.',hl:[e.n.id],run:()=>show([e.n.id].concat(c?[c.id]:[]),'Nút '+e.n.v)})}],
 ...[[1,1],[2,1],[3,2],[0,2],[4,2],[6,3]].map(([i,lv])=>['pt',lv,()=>{const q=QG[i]();if(q)Object.assign(q,{k:'mc',tp:'pt',lv,hint:HT.pt});return q}]),
 ['pt',2,()=>{const l=ND(),L=1+(Math.random()*Math.max(...l.map(e=>e.d))|0),n=l.filter(e=>e.d==L),c=n.length;return Qm('pt',2,'Mức '+L+' có bao nhiêu nút?',c,[c+1,c+2,c-1,2**L,l.length],'Các nút ở mức '+L+': '+n.map(e=>e.n.v).join(', ')+'.',{hint:'Mức = số cạnh từ gốc xuống. Đếm các nút cùng mức.',run:()=>show(n.map(e=>e.n.id),'Mức '+L)})}],
 ['pt',2,()=>{const l=ND().filter(e=>e.n.l&&e.n.r),c=l.length;return Qm('pt',2,'Có bao nhiêu nút có đủ 2 con?',c,[c+1,c+2,c-1,ND().filter(e=>!e.n.l&&!e.n.r).length],c?'Các nút đủ 2 con: '+l.map(e=>e.n.v).join(', ')+'.':'Không nút nào có đủ 2 con.',{hint:'Chỉ đếm nút có cả con trái và con phải.',run:()=>show(l.map(e=>e.n.id),'Nút đủ 2 con')})}],
 ['dut',1,()=>{const k=kk(),a=sq(root,k),v=a.map(n=>n.v),s=jn(v),ids=a.map(n=>n.id);return Qm('dut',1,'Kết quả duyệt '+NAM[k]+' của cây là:',s,[...['pre','in','post','lvl'].filter(x=>x!=k).map(x=>jn(sv(root,x))),...dist(v)],NAM[k]+': '+RU[k]+' → '+s+'.',{hint:NAM[k]+': '+RU[k]+'.',sid:ids,run:runK(k,ids)})}],
 ['dut',2,()=>{const k=kk(),a=sq(root,k);if(a.length<3)return null;const i=Math.random()*(a.length-1)|0,x=a[i],y=a[i+1];return Qm('dut',2,'Theo '+NAM[k]+', nút nào được thăm ngay sau nút '+x.v+'?',y.v,vl(),'Thứ tự '+NAM[k]+': '+jn(a.map(n=>n.v))+'. Sau '+x.v+' là '+y.v+'.',{hint:NAM[k]+': '+RU[k]+'.',hl:[x.id],run:runK(k,a.map(n=>n.id))})}],
 ['dut',2,()=>{const k=kk(),a=sq(root,k);if(a.length<4)return null;const i=1+(Math.random()*(a.length-1)|0);return Qm('dut',2,'Theo '+NAM[k]+', nút được thăm thứ '+(i+1)+' là nút nào?',a[i].v,vl(),'Thứ tự '+NAM[k]+': '+jn(a.map(n=>n.v))+'. Nút thứ '+(i+1)+' là '+a[i].v+'.',{hint:NAM[k]+': '+RU[k]+'.',hl:a.slice(0,i).map(n=>n.id),run:runK(k,a.map(n=>n.id))})}],
 ['bst',2,()=>{const b=bad(root);return Qb('bst',2,'Cây này có phải là cây tìm kiếm nhị phân (BST) không?',!b,b?'Nút '+b.v+' vi phạm: mỗi nút phải lớn hơn mọi khoá bên trái và nhỏ hơn mọi khoá bên phải (kể cả so với các tổ tiên).':'Mọi nút đều lớn hơn cây con trái và nhỏ hơn cây con phải → là BST.',{hint:'Với mỗi nút: trái < nút < phải, và phải đúng với cả các tổ tiên chứ không chỉ với cha.',hl:b?[b.id]:null,run:()=>b&&show([b.id],'Nút vi phạm')})}],
 ['bst',2,()=>{if(bad(root))return null;const io=inord(),mx=Math.random()<.5,x=mx?io[io.length-1]:io[0];return Qm('bst',2,'Giá trị '+(mx?'lớn':'nhỏ')+' nhất của BST là bao nhiêu?',x.v,vl(),(mx?'Đi mãi sang phải':'Đi mãi sang trái')+' từ gốc đến nút cuối: '+x.v+'.',{hint:'Trong BST, khoá '+(mx?'lớn':'nhỏ')+' nhất nằm ở nút cực '+(mx?'phải':'trái')+'.',run:()=>show(pathTo(x),'Đường đi tới giá trị '+(mx?'lớn':'nhỏ')+' nhất')})}],
 ['bst',2,()=>{if(bad(root))return null;const t=rnE(ND()).n,p=pathTo(t),pv=p.map(dv),o=ND().map(e=>jn(pathTo(e.n).map(dv)));return Qm('bst',2,'Tìm khoá '+t.v+' trong BST, các nút được so sánh theo thứ tự nào?',jn(pv),[...o,...dist(pv)],'Từ gốc: nhỏ hơn đi trái, lớn hơn đi phải → '+jn(pv)+'.',{hint:'So sánh khoá cần tìm với nút hiện tại: nhỏ hơn đi trái, lớn hơn đi phải.',sid:p,run:()=>show(p,'Đường tìm '+t.v)})}],
 ['bst',2,()=>{if(bad(root))return null;const have=new Set(vl());let v;for(let i=0;i<40&&(!v||have.has(v));i++)v=1+(Math.random()*45|0);if(have.has(v))return null;let c=root,pn;while(c){pn=c;c=v<c.v?c.l:c.r}const w=[];ND().forEach(e=>{!e.n.l&&w.push('con trái của '+e.n.v);!e.n.r&&w.push('con phải của '+e.n.v)});const pp=pathTo(pn);return Qm('bst',2,'Chèn khoá '+v+' vào BST. Nút mới sẽ trở thành:',(v<pn.v?'con trái của ':'con phải của ')+pn.v,w,'Đi từ gốc '+pp.map(dv).join(' → ')+'; đến '+pn.v+' thì '+v+(v<pn.v?' nhỏ hơn nên đặt bên trái.':' lớn hơn nên đặt bên phải.'),{hint:'So sánh '+v+' với từng nút từ gốc: nhỏ hơn đi trái, lớn hơn đi phải, dừng ở chỗ trống.',run:()=>show(pp,'Đường chèn '+v)})}],
 ['vd',3,()=>{if(bad(root))return null;const have=new Set(vl());let v;for(let i=0;i<40&&(!v||have.has(v));i++)v=1+(Math.random()*45|0);if(have.has(v))return null;const t=insB(clone(root),v),k=rn(['pre','post','lvl']),a=sv(t,k);return Qm('vd',3,'Chèn khoá '+v+' vào BST rồi duyệt '+NAM[k]+'. Kết quả là:',jn(a),[...dist(a),jn(sv(root,k))],'Chèn '+v+' theo quy tắc BST rồi duyệt '+NAM[k]+': '+jn(a)+'.',{hint:'Xác định vị trí chèn trước (nhỏ hơn đi trái, lớn hơn đi phải), sau đó mới duyệt: '+RU[k]+'.'})}],
 ['vd',3,()=>{if(bad(root)||ND().length<4)return null;const x=rnE(ND()).n,t=delB(clone(root),x.v),k=rn(['pre','post','lvl']),a=sv(t,k),c=x.l&&x.r?'có 2 con: thay bằng khoá nhỏ nhất của cây con phải':!x.l&&!x.r?'là lá: xóa trực tiếp':'có 1 con: con của nó đi lên thế chỗ';return Qm('vd',3,'Xóa nút '+x.v+' khỏi BST rồi duyệt '+NAM[k]+'. Kết quả là:',jn(a),[...dist(a),jn(sv(root,k).filter(v=>v!=x.v))],'Nút '+x.v+' '+c+'. Duyệt '+NAM[k]+': '+jn(a)+'.',{hint:'Xét nút cần xóa là lá, có 1 con hay 2 con để chọn cách xóa, rồi duyệt: '+RU[k]+'.',hl:[x.id]})}],
 ['vd',3,()=>{const a=vl();if(new Set(a).size!=a.length||a.length>9)return null;const pr=sv(root,'pre'),io=sv(root,'in'),po=sv(root,'post');return Qm('vd',3,'Một cây nhị phân có Preorder: '+jn(pr)+' và Inorder: '+jn(io)+'. Kết quả Postorder là:',jn(po),[...dist(po),jn(sv(root,'lvl')),jn([...po].reverse())],'Gốc là '+pr[0]+' (đầu Preorder); chia Inorder thành cây con trái và phải rồi lặp lại → Postorder: '+jn(po)+'.',{hint:'Phần tử đầu của Preorder là gốc; dùng nó chia Inorder thành cây con trái và cây con phải.',run:()=>setSteps(tSteps('post'),'post')})}],
 ['dut',1,()=>{const k=kk(),a=sq(root,k);if(a.length<4)return null;const i=Math.random()*a.length|0,v=a.map(n=>n.v);if(v.filter(x=>x==v[i]).length>1)return null;return{k:'fill',tp:'dk',lv:1,t:'Hoàn thành kết quả '+NAM[k]+' (điền khoá ở dấu ?):<br><b>'+v.map((x,j)=>j==i?'?':x).join(' ')+'</b>',ans:v[i],why:NAM[k]+' đầy đủ: '+jn(v)+'.',hint:NAM[k]+': '+RU[k]+'. Hãy tự duyệt cây để tìm nút ở vị trí thứ '+(i+1)+'.',sid:a.slice(0,i).map(n=>n.id),run:runK(k,a.map(n=>n.id))}}],
 ['dut',2,()=>{const k=kk(),a=sq(root,k).slice(0,6);if(a.length<4)return null;return{k:'ord',tp:'sx',lv:2,t:'Chạm các nút theo đúng thứ tự '+NAM[k]+(a.length<ND().length?' <small>(chỉ '+a.length+' nút đầu tiên)</small>':'')+':',items:sh(a.map(n=>({id:n.id,v:n.v}))),ans:a.map(n=>n.id),got:[],why:NAM[k]+': '+jn(a.map(n=>n.v))+'.',hint:NAM[k]+': '+RU[k]+'.',run:runK(k,a.map(n=>n.id))}}]
];
// ---- câu Tự luận tự chấm: học sinh tự trả lời rồi so với đáp án mẫu ----
G2.push(
 ['cau',1,()=>{const e=rnE(ND()),n=e.n,p=e.p&&e.p.n;return{k:'self',tp:'cau',lv:1,t:'Tự luận: Hãy mô tả vị trí của nút <b>'+n.v+'</b> trên cây (loại nút, nút cha, các nút con, mức).',model:'Nút '+n.v+' là '+(n===root?'nút gốc':!n.l&&!n.r?'nút lá':'nút nhánh')+'; nút cha: '+(p?p.v:'không có (là gốc)')+'; con trái: '+(n.l?n.l.v:'không có')+'; con phải: '+(n.r?n.r.v:'không có')+'; ở mức '+e.d+'.',why:'',hint:'',hl:[n.id],run:()=>show([n.id],'Nút '+n.v)}},1],
 ['dut',2,()=>{const k=kk(),a=sq(root,k);return{k:'self',tp:'dut',lv:2,t:'Tự luận: Nêu quy tắc duyệt <b>'+NAM[k]+'</b> rồi viết kết quả duyệt của cây này.',model:NAM[k]+': '+RU[k]+'. Kết quả: '+jn(a.map(n=>n.v))+'.',why:'',hint:'',run:runK(k,a.map(n=>n.id))}},1],
 ['pt',2,()=>{const l=ND(),n=l.length,h=Math.max(...l.map(e=>e.d)),lf=l.filter(e=>!e.n.l&&!e.n.r);return{k:'self',tp:'pt',lv:2,t:'Tự luận: Hãy cho biết số nút, chiều cao và số nút lá của cây.',model:'Số nút: '+n+'; chiều cao: '+h+' (gốc ở mức 0); số nút lá: '+lf.length+' ('+lf.map(e=>e.n.v).join(', ')+').',why:'',hint:HT.pt,run:()=>show(lf.map(e=>e.n.id),'Các nút lá')}},1],
 ['vd',3,()=>{if(bad(root))return null;const have=new Set(vl());let v;for(let i=0;i<40&&(!v||have.has(v));i++)v=1+(Math.random()*45|0);if(have.has(v))return null;let c=root,pn,pp=[];while(c){pp.push(c);pn=c;c=v<c.v?c.l:c.r}return{k:'self',tp:'vd',lv:3,t:'Tự luận: Trình bày các bước chèn khoá <b>'+v+'</b> vào cây BST này.',model:'So sánh '+v+' lần lượt với '+pp.map(x=>x.v).join(' → ')+'; tới '+pn.v+' thì '+v+(v<pn.v?' nhỏ hơn nên đặt làm con trái.':' lớn hơn nên đặt làm con phải.'),why:'',hint:'Nhỏ hơn đi trái, lớn hơn đi phải, dừng ở chỗ trống.',run:()=>show(pp.map(x=>x.id),'Đường chèn '+v)}},1],
 // câu Sắp xếp thứ tự cho chủ đề cấu trúc / phân tích cây
 ['cau',1,()=>{const e=rnE(ND().filter(x=>x.d>=2&&x.d<=6));let ids,t,w;
   if(e){ids=pathTo(e.n);t='Chạm các nút trên đường đi từ <b>gốc</b> xuống nút <b>'+e.n.v+'</b>, theo đúng thứ tự:';w='Đường đi từ gốc xuống nút '+e.n.v+': '+ids.map(dv).join(' → ')+'.'}
   else{ids=sq(root,'lvl').slice(0,6).map(n=>n.id);t='Chạm các nút theo thứ tự từ trên xuống, mỗi mức đi từ trái sang phải:';w='Thứ tự theo mức: '+ids.map(dv).join(' → ')+'.'}
   return{k:'ord',tp:'cau',lv:1,t,items:sh(ids.map(id=>({id,v:dv(id)}))),ans:ids,got:[],why:w,hint:'Mỗi nút là con của nút đứng ngay trước nó; đi từ nút gốc (mức 0) xuống dần.',run:()=>show(ids,'Thứ tự đúng')}}],
 ['pt',2,()=>{const ids=sq(root,'lvl').slice(0,6).map(n=>n.id),wl=wk().m;return{k:'ord',tp:'pt',lv:2,t:'Sắp xếp các nút theo <b>mức tăng dần</b> (mức 0 trước, cùng mức thì từ trái sang phải):',items:sh(ids.map(id=>({id,v:dv(id)}))),ans:ids,got:[],why:'Theo mức: '+ids.map(id=>dv(id)+' (mức '+wl[id].d+')').join(', ')+'.',hint:HT.pt,run:()=>show(ids,'Theo mức')}}]
);
// ---- câu hỏi bổ sung: tăng độ đa dạng, vẫn sinh từ chính cây đang hiển thị ----
const qBv=n=>!n?null:(Math.abs(ht(n.l)-ht(n.r))>1?n:qBv(n.l)||qBv(n.r));
G2.push(
 ['cau',1,()=>{const e=rnE(ND().filter(e=>e.p));if(!e)return null;const p=e.p.n,isL=p.l===e.n,side=Math.random()<.5?'trái':'phải',yes=(side=='trái')==isL;
   return Qb('cau',1,'Nút '+e.n.v+' có phải là con '+side+' của nút '+p.v+' không?',yes,'Nút '+e.n.v+' là con '+(isL?'trái':'phải')+' của nút '+p.v+'.',{hint:'Nhìn nhánh nối từ nút '+p.v+' xuống nút '+e.n.v+': nằm bên trái hay bên phải?',hl:[e.n.id],run:()=>show([p.id,e.n.id],'Cha → con')})}],
 ['cau',1,()=>{const e=rnE(ND().filter(e=>e.p));if(!e)return null;const p=e.p.n,sb=p.l===e.n?p.r:p.l;
   return Qm('cau',1,'Nút '+e.n.v+' có nút anh/em (cùng cha) là nút nào?',sb?sb.v:'Không có',[...vl(),'Không có'],sb?'Nút '+e.n.v+' và nút '+sb.v+' cùng là con của nút '+p.v+'.':'Cha của '+e.n.v+' là '+p.v+' nhưng nút này chỉ có một con nên '+e.n.v+' không có anh/em.',{hint:'Hai nút cùng cha là anh/em. Hãy xem nút cha '+p.v+' còn con nào khác.',hl:[e.n.id],run:()=>show([p.id,e.n.id].concat(sb?[sb.id]:[]),'Cha và các con')})}],
 ['cau',1,()=>{const e=rnE(ND().filter(e=>e.d>=1));if(!e)return null;const ed=Math.random()<.5,d=e.d,r=ed?d:d+1,ids=pathTo(e.n);
   return Qm('cau',1,'Đường đi từ gốc xuống nút '+e.n.v+' đi qua bao nhiêu '+(ed?'cạnh':'nút (tính cả gốc và nút '+e.n.v+')')+'?',r,[r+1,r+2,r-1,ed?d+1:d,r+3],'Đường đi: '+ids.map(dv).join(' → ')+' — gồm '+(d+1)+' nút và '+d+' cạnh.',{hint:'Đi từ gốc xuống, đếm '+(ed?'từng cạnh nối':'từng nút')+'.',run:()=>show(ids,'Đường từ gốc')})}],
 ['pt',1,()=>{const e=rnE(ND().filter(e=>e.n.l||e.n.r));if(!e)return null;const sb=sq(e.n,'pre'),ids=sb.map(n=>n.id),c=ids.length;
   return Qm('pt',1,'Cây con có gốc là nút '+e.n.v+' gồm bao nhiêu nút (tính cả nút '+e.n.v+')?',c,[c+1,c+2,c-1,ND().length,c+3],'Cây con gốc '+e.n.v+' gồm các nút: '+sb.map(n=>n.v).join(', ')+'.',{hint:'Đếm nút '+e.n.v+' và mọi nút nằm dưới nó.',hl:[e.n.id],run:()=>show(ids,'Cây con gốc '+e.n.v)})}],
 ['pt',2,()=>{const e=rnE(ND()),h=hE(e.n);
   return Qm('pt',2,'Chiều cao của nút '+e.n.v+' (đo từ nút đó xuống lá xa nhất) là bao nhiêu?',h,[h+1,h+2,h-1,hE(root),h+3],'Từ '+e.n.v+' xuống lá xa nhất qua '+h+' cạnh'+(h?'.':' (nút lá có chiều cao 0).'),{hint:HT.pt,hl:[e.n.id],run:()=>show(sq(e.n,'pre').map(n=>n.id),'Cây con gốc '+e.n.v)})}],
 ['pt',3,()=>{const b=qBv(root);
   return Qb('pt',3,'Cây này có cân bằng về chiều cao không (mọi nút có hai cây con lệch nhau tối đa 1)?',!b,b?'Nút '+b.v+' có hai cây con chênh nhau '+Math.abs(ht(b.l)-ht(b.r))+' mức nên cây không cân bằng.':'Mọi nút đều có hai cây con lệch chiều cao không quá 1 → cây cân bằng.',{hint:'Với mỗi nút, so chiều cao cây con trái và cây con phải.',hl:b?[b.id]:null,run:()=>b&&show([b.id],'Nút mất cân bằng')})}],
 ['dut',2,()=>{const k=kk(),a=sq(root,k);if(a.length<4)return null;const x=rnE(a),i=a.indexOf(x);
   return Qm('dut',2,'Theo '+NAM[k]+', nút '+x.v+' được thăm ở vị trí thứ mấy?',i+1,[i+2,i+3,i+4,i-1,a.length].concat(i>0?[i]:[]),NAM[k]+': '+jn(a.map(n=>n.v))+'. Nút '+x.v+' đứng thứ '+(i+1)+'.',{hint:NAM[k]+': '+RU[k]+'. Hãy đếm lần lượt các nút được thăm.',hl:[x.id],run:runK(k,a.map(n=>n.id))})}],
 ['dut',1,()=>{const k=kk(),a=sq(root,k);if(a.length<3)return null;const fst=Math.random()<.5,x=fst?a[0]:a[a.length-1];
   return Qm('dut',1,'Theo '+NAM[k]+', nút được thăm '+(fst?'đầu tiên':'cuối cùng')+' là nút nào?',x.v,vl(),NAM[k]+': '+jn(a.map(n=>n.v))+' → nút '+(fst?'đầu tiên':'cuối cùng')+' là '+x.v+'.',{hint:NAM[k]+': '+RU[k]+'.',run:runK(k,a.map(n=>n.id))})}],
 ['bst',2,()=>{const v=sv(root,'in'),ok=v.every((x,i)=>!i||x>v[i-1]);
   return Qb('bst',2,'Duyệt giữa (Inorder) của cây này có cho dãy tăng dần không?',ok,'Duyệt giữa: '+jn(v)+(ok?' — tăng dần nên đây là BST.':' — có chỗ không tăng nên đây không phải BST.'),{hint:'Hãy tự duyệt giữa (trái – nút – phải) rồi so sánh các số liền kề.',run:()=>setSteps(tSteps('in'),'in')})}],
 ['bst',2,()=>{const e=rnE(ND()),g=(e.n.l?1:0)+(e.n.r?1:0),C=['Nút lá: xóa trực tiếp','Có 1 con: con đi lên thế chỗ','Có 2 con: thay bằng nút kế nhiệm'];
   return Qm('bst',2,'Muốn xóa nút '+e.n.v+' khỏi BST, ta rơi vào trường hợp nào?',C[g],C,'Nút '+e.n.v+' có '+g+' con → '+C[g].toLowerCase()+'.',{hint:'Đếm số con của nút cần xóa: 0, 1 hay 2 con?',hl:[e.n.id],run:()=>show([e.n.id],'Nút cần xóa')})}],
 ['bst',2,()=>{if(bad(root))return null;const t=rnE(ND()).n,p=pathTo(t),r=p.length;
   return Qm('bst',2,'Tìm khoá '+t.v+' trong BST bắt đầu từ gốc: cần so sánh với bao nhiêu nút (tính cả nút chứa khoá)?',r,[r+1,r+2,r-1,ND().length,r+3],'Đường tìm: '+p.map(dv).join(' → ')+' → '+r+' lần so sánh.',{hint:'Mỗi nút trên đường từ gốc đến '+t.v+' là một lần so sánh.',run:()=>show(p,'Đường tìm '+t.v)})}],
 ['bst',3,()=>{if(bad(root))return null;const io=inord();if(io.length<3)return null;const x=rnE(io.slice(0,-1)),y=io[io.indexOf(x)+1];
   return Qm('bst',3,'Nút kế nhiệm của '+x.v+' (khoá nhỏ nhất lớn hơn '+x.v+') trong BST là nút nào?',y.v,vl(),'Kế nhiệm là nút đứng ngay sau '+x.v+' trong duyệt giữa: '+jn(io.map(n=>n.v))+' → '+y.v+'.',{hint:'Kế nhiệm của một nút là nút liền sau nó trong dãy duyệt giữa (tăng dần).',hl:[x.id],run:()=>show([x.id,y.id],'Nút và nút kế nhiệm')})}],
 ['vd',3,()=>{if(bad(root))return null;const have=new Set(vl());let v;for(let i=0;i<40&&(!v||have.has(v));i++)v=1+(Math.random()*45|0);if(have.has(v))return null;const t=insB(clone(root),v),h=hE(t),h0=hE(root);
   return Qm('vd',3,'Chèn khoá '+v+' vào BST. Chiều cao của cây sau khi chèn là bao nhiêu?',h,[h0,h+1,h+2,h-1],'Chèn '+v+' theo quy tắc BST, cây có chiều cao '+h+(h>h0?' (tăng so với '+h0+').':' (không đổi).'),{hint:'Tìm chỗ chèn: nhỏ hơn đi trái, lớn hơn đi phải. Nút mới ở mức nào thì chiều cao cây là lớn hơn giữa chiều cao cũ và mức đó.'})}]
);
const NUM=/^-?\d+$/,SEQ=/^-?\d+( -?\d+)+$/,nz=x=>String(x).trim().split(/[\s,;]+/).filter(Boolean).map(t=>isNaN(+t)?t:+t).join(' ');
const qty=q=>q.k=='mc'?(q.tf?'tf':'mc'):q.k=='fill'?(q.essay?'essay':'fill'):q.k=='self'?'essay':'ord';
// đổi một câu gốc sang đúng DẠNG CÂU HỎI mà học sinh đã chọn (null = không đổi được → bốc câu khác)
function adapt(q,y){if(!q)return null;const ty=qty(q);
  if(ty==y)return y=='mc'&&q.o.length<3?null:q;
  if(q.tf&&y=='essay')return{k:'self',tp:q.tp,lv:q.lv,t:'Tự luận: '+q.t+' Hãy trả lời và giải thích.',model:'Đáp án: '+q.o[q.a]+'. '+q.why,why:'',hint:q.hint||'',hl:q.hl,run:q.run};
  if(q.k!='mc'||q.tf)return null;
  const a=String(q.o[q.a]),base={tp:q.tp,lv:q.lv,why:q.why,hint:q.hint||'',run:q.run};
  if(y=='tf'){const ok=Math.random()<.5,pr=ok?a:rn(q.o.filter((x,i)=>i!=q.a));
    return{k:'mc',tf:1,...base,t:q.t+'<br>Đáp án đề xuất: <b>'+esc(pr)+'</b>. Đề xuất này đúng hay sai?',o:['Đúng','Sai'],a:ok?0:1,why:ok?q.why:'Đề xuất sai — đáp án đúng là '+a+'. '+q.why,hl:q.hl}}
  if(y=='fill'||y=='essay'){const es=y=='essay'?1:0;
    if(NUM.test(a))return{k:'fill',essay:es,...base,t:q.t,ans:+a,sid:es?null:q.sid};
    if(SEQ.test(a)){const v=a.split(' ');
      if(es)return{k:'fill',essay:1,...base,t:q.t+'<br><small>(viết kết quả, các số cách nhau bởi dấu cách)</small>',ans:a};
      const i=Math.random()*v.length|0;if(v.filter(x=>x==v[i]).length>1)return null;
      return{k:'fill',essay:0,...base,t:q.t+'<br>Điền số còn thiếu ở dấu ?:<br><b>'+v.map((x,j)=>j==i?'?':x).join(' ')+'</b>',ans:+v[i],sid:q.sid?q.sid.slice(0,i):null}}
    return null}
  if(y=='ord'){if(!SEQ.test(a))return null;const v=a.split(' ');if(v.length<3||v.length>8||new Set(v).size!=v.length)return null;
    const ids=v.map(x=>{const e=ND().find(e=>String(e.n.v)==x);return e?e.n.id:null});if(ids.includes(null))return null;
    return{k:'ord',...base,t:'Sắp xếp: '+q.t.replace(/[:?]\s*$/,'')+' — chạm các nút theo đúng thứ tự:',items:sh(v.map((x,i)=>({id:ids[i],v:x}))),ans:ids,got:[]}}
  return null}
// đồng hồ cho "Thử thách thời gian"
// đồng hồ cho "Thử thách thời gian": hiện số giây, tích tắc 3 giây cuối, hết giờ tính là sai và hiện đáp án
function qTimer(){clearInterval(QX.tm);if(!QX.timed||!Q||Q.msg)return;Q.tl=dfi().qt;Q.tt0=Date.now();
  QX.tm=setInterval(()=>{const q=Q;if(!QX.on||!q||q.msg||q.st=='done'){clearInterval(QX.tm);return}
    const left=q.tl-(Date.now()-q.tt0),b=$('#qtm'),s=$('#qts');if(b)b.style.width=Math.max(0,left/q.tl*100)+'%';if(s)s.textContent='⏱ '+Math.max(0,Math.ceil(left/1000))+'s';
    if(left<=3000&&left>0){const k=Math.ceil(left/1000);if(k!=q.tk){q.tk=k;sfx(SND.tick)}}
    if(left<=0){clearInterval(QX.tm);q.tries=2;q.res=0;q.st='done';q.pts=0;q.to=1;qFin();drawQ();sfx(SND.lose);buzz([60,40,60]);gfx('bad','⏱ Hết giờ!');q.run&&q.run()}},200)}

function newQ(){const c=QX.cfg;if(!root||wk().list.length<3){Q={msg:'Cây cần ≥ 3 nút để làm câu hỏi.'};return}
  const tps=c.tps&&c.tps.length?c.tps:TOP.map(t=>t[0]),tys=c.tys&&c.tys.length?c.tys:TYP.map(t=>t[0]);
  for(let i=0;i<120;i++){const t=pkTopic(tps),y=rn(tys);
    let P=G2.filter(g=>g[0]==t&&(y=='essay'||!g[3])&&(i>=40||g[1]<=(c.lv||3)));if(!P.length)P=G2.filter(g=>g[0]==t&&(y=='essay'||!g[3]));
    const g=pkG(P);let q=null;try{q=adapt(g[2](),y)}catch(e){}if(!q)continue;q.tp=t;
    const sg=q.t+'|'+(q.o?q.o[q.a]:q.ans||q.model);if(i<90&&QX.recent.includes(sg))continue;QX.recent.push(sg);if(QX.recent.length>150)QX.recent.shift();QX.tpl.push(G2.indexOf(g));if(QX.tpl.length>6)QX.tpl.shift();QX.lt=t;
    Object.assign(q,{st:'ask',tries:0,sig:H.sig(),t0:Date.now(),got:q.got&&[],wr:[],soft:QX.cold>=2?1:0});Q=q;qTimer();return}
  Q={msg:'Chưa tạo được câu hỏi phù hợp, hãy chọn thêm chủ đề / dạng câu hỏi hoặc đổi cây.'}}
// ---- điểm một câu: cơ bản 100 (đúng ngay) / 50 (sau gợi ý) + thưởng tốc độ tối đa 30 + thưởng chuỗi (+10 mỗi câu đúng liên tiếp, tối đa +50), rồi nhân hệ số cấp độ ----
function qScore(q){const d=dfi(),first=!q.tries&&!q.hinted;let spd=0;
  if(first)spd=QX.timed&&q.tl?Math.round(30*Math.max(0,1-(Date.now()-q.tt0)/q.tl)):Math.max(0,Math.round(30-(Date.now()-q.t0)/1000));
  const str=first?Math.min(5,QX.streak)*10:0,base=first?100:50;q.pb={base,spd,str,mul:d.mul};return Math.round((base+spd+str)*d.mul)}
// lời nhận xét sau mỗi câu (chọn một lần khi chốt kết quả để không đổi khi vẽ lại)
function qMsg(q){if(q.to)return '⏱ Hết giờ rồi — đáp án đã hiện, xem lời giải nhé.';
  if(q.res){if(q.tries||q.hinted)return '✅ Đúng rồi! Lần này có gợi ý nên chỉ tính điểm cơ bản — lần sau thử không cần gợi ý nhé.';
    if(QX.streak>=3)return '🔥 Chuỗi '+QX.streak+' câu đúng liên tiếp!';return rn(['✅ Chính xác!','🎯 Tuyệt vời!','👏 Làm tốt lắm!','✅ Đúng rồi!'])}
  return q.k=='self'?'📖 Chưa đúng — hãy đối chiếu đáp án mẫu để rút kinh nghiệm.':'❌ Chưa đúng — không sao, xem lời giải bên dưới nhé.'}
function drawQ(){const q=Q,c=QX.cfg;if(q.msg){modal(qTitle(),'<p>'+q.msg+'</p>',null,'',()=>endQ(),'Đóng',1);return}
  const ask=q.st=='ask',dn=q.st=='done',last=QX.i+1>=c.cnt,tl=QX.timed&&q.tl&&!dn,d=dfi();
  let b='<div class="qinf"><span>Câu '+(QX.i+1)+'/'+c.cnt+' · '+d.e+' '+d.n+'</span><span id="qts">'+(tl?'⏱ '+Math.max(0,Math.ceil((q.tl-(Date.now()-q.tt0))/1000))+'s':'')+'</span></div>'+
    '<div class="qbar"><i style="width:'+Math.round((QX.i+(dn?1:0))/c.cnt*100)+'%"></i></div>';
  if(tl)b+='<div class="qbar"><i id="qtm" style="transition:none;background:linear-gradient(90deg,#ff922b,#fa5252);width:'+Math.max(0,100-(Date.now()-q.tt0)/q.tl*100)+'%"></i></div>';
  b+='<p class="qt"><b>'+q.t+'</b></p>';
  if(q.k=='mc')b+=q.o.map((o,i)=>'<button class="bt '+(dn?(i==q.a?'ok':(i==q.pick||q.wr.includes(i))?'bad':''):q.wr.includes(i)?'bad':'')+'" data-x="a'+i+'"'+(!ask||q.wr.includes(i)?' disabled':'')+'>'+esc(o)+'</button>').join('');
  else if(q.k=='fill'){const nm=NUM.test(String(q.ans));b+='<input id="qf" type="'+(nm?'number':'text')+'" '+(nm?'step="any" inputmode="decimal" placeholder="Nhập khoá còn thiếu"':'placeholder="Viết kết quả, cách nhau bởi dấu cách"')+(ask?'':' disabled')+'><button class="bt or" data-x="qc"'+(ask?'':' disabled')+'>Kiểm tra</button>'}
  else if(q.k=='self')b+=ask?'<small>Hãy tự trả lời (viết ra giấy hoặc nói thành lời), sau đó bấm xem đáp án mẫu để tự chấm.</small><button class="bt or" data-x="sv">👁 Xem đáp án mẫu</button>':q.st=='rev'?'<p>📖 <b>Đáp án mẫu:</b> '+esc(q.model)+'</p><button class="bt ok" data-x="sy">✅ Mình làm đúng</button><button class="bt bad" data-x="sn">❌ Chưa đúng</button>':'';
  else b+='<div>'+q.items.map((it,i)=>'<button class="bt qchip'+(q.got.includes(it.id)?' on':'')+'" data-x="o'+i+'"'+(ask?'':' disabled')+'>'+esc(it.v)+'</button>').join('')+'</div><small>Đã chọn: '+(q.got.map(id=>q.items.find(x=>x.id==id).v).join(' → ')||'—')+'</small>';
  if(ask&&q.hinted&&q.hint)b+='<p class="qhi">💡 '+esc(q.hint)+'</p>';
  if(ask&&q.soft&&!q.hinted&&TIPQ[q.tp])b+='<p class="qhi">💡 <b>Mẹo nhỏ</b> (miễn phí, không trừ điểm): '+esc(TIPQ[q.tp])+'</p>';
  if(q.st=='hint')b+='<p class="qh">❌ '+esc(q.fb)+'</p><p>💡 '+esc(q.hint)+'</p><small>Còn 1 lần thử — đúng lần này được 50 điểm cơ bản.</small><button class="bt or" data-x="qt">↻ Thử lại'+(q.k=='ord'?' từ bước sai':'')+'</button><button class="bt" data-x="qs">👁 Xem đáp án</button>';
  if(dn){const R=q.res,pb=q.pb,yours=q.k=='mc'?(q.pick!=null?q.o[q.pick]:''):q.k=='fill'?(q.last||''):'';
    b+='<div class="fb '+(R?'ok':'bad')+'"><h5>'+q.fbm+'</h5>'+
      (!R&&q.k!='self'?'<div>Đáp án đúng: <b>'+esc(ansText(q))+'</b>'+(yours!==''&&!q.to?' · Bạn chọn: '+esc(yours):'')+'</div>':'')+
      '<div class="exp">'+esc(q.k=='self'?q.model:q.why)+'</div>'+
      '<div class="pts"><span>+'+q.pts+' điểm</span>'+(R&&pb?'<span>Cơ bản '+pb.base+'</span>'+(pb.spd?'<span>⚡ tốc độ +'+pb.spd+'</span>':'')+(pb.str?'<span>🔥 chuỗi +'+pb.str+'</span>':'')+(pb.mul!=1?'<span>× '+String(pb.mul).replace('.',',')+' ('+d.n+')</span>':''):'')+'</div></div>'+
      '<button class="bt or" data-x="nq">'+(last?'Xem kết quả ▶':'Câu tiếp ▶')+'</button>'}
  if(ask)b+='<div class="qtl">'+(q.hint&&q.k!='self'&&!q.hinted?'<button data-x="qh"'+(q.soft?' class="pulse"':'')+'>💡 Gợi ý (−50% điểm)</button>':'')+(QX.timed?'':'<button data-x="qsw">🔄 Đổi câu</button>')+(c.src=='rnd'?'<button data-x="qtree">🌳 Cây mới</button>':'')+(q.k=='ord'&&q.got.length?'<button data-x="qr">↺ Chọn lại</button>':'')+'</div>';
  modal(qTitle()+' · ⭐ '+QX.score+(QX.streak>=2?' · 🔥'+QX.streak:''),b,null,'',()=>endQ(),'Kết thúc',1);qIdle()}
// chốt kết quả một câu: cộng điểm, cập nhật chuỗi đúng, ghi lại câu sai để xem lại ở màn kết quả
function qFin(){const q=Q,t=QX.tp[q.tp]=QX.tp[q.tp]||[0,0];t[1]++;
  if(q.res){QX.cold=0;t[0]++;QX.ok++;QX.streak++;QX.mx=Math.max(QX.mx||0,QX.streak)}
  else{QX.streak=0;QX.cold=(QX.cold||0)+1;if(q.run&&q.run.kd)QX.revK=q.run.kd;QX.wrong.push({t:String(q.t).replace(/<br>/g,' ').replace(/<[^>]+>/g,''),a:ansText(q),w:q.k=='self'?'':(q.why||'')})}
  QX.n++;QX.sec+=(Date.now()-q.t0)/1000;QX.score+=q.pts;q.fbm=qMsg(q)}
function qAns(ok,fb){const q=Q;
  if(ok){q.res=1;q.st='done';q.pts=qScore(q);sfx(QX.streak>=2?SND.combo:SND.ok);buzz(30)}
  else{q.tries++;sfx(SND.bad);rescue();if(q.tries>=2){q.res=0;q.st='done';q.pts=0}else{q.st='hint';q.fb=fb}}
  if(q.st=='done'){qFin();drawQ();q.run&&q.run();gfx(q.res?'ok':'bad',q.res?'+'+q.pts+(QX.streak>=3?' · 🔥×'+QX.streak:''):'')}
  else{if(q.hids&&q.hids.length)show(q.hids,q.hn||'Nút liên quan');drawQ();gfx('bad','Thử lại nhé!')}}
for(let i=0;i<4;i++)X['a'+i]=()=>{const q=Q;if(!q||q.st!='ask'||q.k!='mc')return;q.pick=i;q.hids=q.hl;q.hn='Nút liên quan';if(i==q.a)return qAns(1);q.wr.push(i);let fb='Đáp án chưa đúng.';if(q.sid){const d=fd(q.o[i].split(' '),q.o[q.a].split(' '));fb=d?'Bạn đúng đến bước '+d+', sai từ bước '+(d+1)+'.':'Dãy sai ngay từ bước đầu tiên.';q.hids=q.sid.slice(0,d);q.hn='Các nút bạn đã duyệt đúng'}qAns(0,fb)};
X.qc=()=>{const q=Q;if(!q||q.st!='ask'||q.k!='fill')return;const v=$('#qf').value.trim();if(v==='')return toast('Hãy nhập câu trả lời');q.last=v;q.hids=q.sid;q.hn='Các nút đứng trước chỗ trống';qAns(nz(v)==nz(q.ans),'Câu trả lời bạn nhập chưa đúng.')};
X.sv=()=>{const q=Q;if(!q||q.st!='ask'||q.k!='self')return;q.st='rev';drawQ()};
X.sy=()=>{const q=Q;if(!q||q.st!='rev')return;qAns(1)};
X.sn=()=>{const q=Q;if(!q||q.st!='rev')return;q.tries=2;q.res=0;q.st='done';q.pts=0;qFin();drawQ();q.run&&q.run()};
for(let i=0;i<8;i++)X['o'+i]=()=>{const q=Q;if(!q||q.st!='ask'||q.k!='ord')return;const it=q.items[i];if(!it||q.got.includes(it.id))return;const p=q.got.length;if(it.id==q.ans[p]){q.got.push(it.id);if(q.got.length==q.ans.length)return qAns(1);beep(500+p*40);return drawQ()}q.hids=q.got.slice();q.hn='Các nút đã chọn đúng';qAns(0,'Bạn sai ở bước '+(p+1)+': nút vừa chọn chưa phải nút được thăm tiếp theo.')};
X.qr=()=>{if(Q&&Q.st=='ask'&&Q.k=='ord'){Q.got=[];drawQ()}};
X.qt=()=>{const q=Q;if(q.st!='hint')return;q.st='ask';q.hids=null;clear();refresh();drawQ()};
X.qs=()=>{const q=Q;if(q.st!='hint')return;q.tries=2;q.res=0;q.st='done';q.pts=0;qFin();drawQ();q.run&&q.run()};
X.qsw=()=>{clear();refresh();newQ();drawQ()};
X.qtree=()=>{setTree(cfgTree(QX.cfg));newQ();drawQ()};
X.nq=()=>{clear();refresh();if(QX.i+1>=QX.cfg.cnt)return endQ();QX.i++;newQ();drawQ()};
$('#mbd').addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.id=='qf')X.qc()});
// gợi ý chủ động (trước khi trả lời): chỉ còn 50 điểm cơ bản
X.qh=()=>{const q=Q;if(!q||q.st!='ask'||q.hinted||!q.hint)return;q.hinted=1;sfx(SND.hint);if(q.hl&&q.hl.length)show(q.hl,'Nút liên quan');drawQ()};
// ================= GỢI Ý KHI GẶP KHÓ · TRÁNH LẶP CÂU HỎI · BÁM THEO CÂY ĐANG HỌC (trắc nghiệm) =================
(function(){const st=document.createElement('style');st.textContent='.pulse{animation:hpul 1s ease-in-out infinite}@keyframes hpul{50%{box-shadow:0 0 0 4px #ffc93caa}}@media (prefers-reduced-motion:reduce){.pulse{animation:none!important;outline:2px solid #ffc93c}}';document.head.appendChild(st)})();
// mẹo miễn phí theo chủ đề: hiện khi sai 2 câu liên tiếp hoặc đứng yên quá lâu (khác với 💡 Gợi ý: gợi ý cụ thể, trừ 50% điểm)
const TIPQ={cau:'Gốc không có cha, lá không có con; bậc của nút là số con của nó.',dut:'Vị trí của nút N quyết định tên phép duyệt: Preorder N-L-R, Inorder L-N-R, Postorder L-R-N; theo mức thì đi từng hàng, trái sang phải.',pt:'Gốc ở mức 0; chiều cao = số cạnh trên đường dài nhất xuống lá (lá cao 0); n nút thì có n − 1 cạnh.',bst:'BST: trái < nút < phải (đúng với cả tổ tiên); duyệt giữa của BST luôn tăng dần.',vd:'Làm từng bước: xác định vị trí chèn / trường hợp xóa trước, rồi mới duyệt hoặc đo.'};
const QIDLE={1:15000,2:20000,3:26000};
function qIdle(){clearTimeout(QX.it);const q=Q;if(!QX.on||!q||q.msg||q.st!='ask'||q.soft||QX.timed)return;
  QX.it=setTimeout(()=>{if(!QX.on||Q!==q||q.st!='ask'||q.soft)return;const f=$('#qf');if((f&&f.value)||q.k=='self')return qIdle();q.soft=1;sfx(SND.hint);drawQ()},QIDLE[dfl()])}
// chọn chủ đề: ưu tiên phần còn yếu (35%), tránh ra cùng chủ đề liền nhau
function pkTopic(tps){if(tps.length>1&&Math.random()<.35){const tp=tpStat(HS.g());Object.entries(QX.tp||{}).forEach(([k,v])=>{const o=tp[k]||[0,0];tp[k]=[o[0]+v[0],o[1]+v[1]]});
    const w=tps.filter(k=>tp[k]&&tp[k][1]>=2&&tp[k][0]/tp[k][1]<.7);if(w.length)return rn(w)}
  const f=tps.filter(k=>k!=QX.lt);return rn(f.length&&Math.random()<.7?f:tps)}
// chọn mẫu câu hỏi: tránh 6 mẫu gần nhất
function pkG(P){const f=P.filter(g=>!QX.tpl.includes(G2.indexOf(g)));return rn(f.length?f:P)}
// ghi nhớ nút đang chọn và phép duyệt vừa mô phỏng để câu hỏi bám theo
function qLink(){const c=QX.cfg;QX.sel=null;QX.focus=null;if(!c.link||c.src!='cur')return;
  if(S.sel&&byId(S.sel))QX.sel=S.sel;if(['pre','in','post'].includes(S.ck))QX.focus=S.ck}
function hubLink(){const c=QX.cfg;if(c.src!='cur')return '🌱 Đang dùng cây ngẫu nhiên (không gắn với cây bạn đang quét).';
  const n=wk().list.length;if(n<3)return '🔗 Cây hiện tại chưa đủ 3 nút — hãy quét hoặc nhập cây trước.';
  const sl=S.sel&&byId(S.sel),ck=['pre','in','post'].includes(S.ck);
  return '🔗 Gắn với cây của bạn: <b>'+n+' nút</b>'+(c.link&&sl?' · nút đang chọn <b>'+SH(sl)+'</b>':'')+(c.link&&ck?' · phép duyệt vừa mô phỏng <b>'+NAM[S.ck]+'</b>':'')+(bad(root)?' · <i>chưa là BST</i>':' · là BST ✔')}
X.rev=()=>{const k=QX.revK;close();if(!k||!root)return;if(k=='lvl')show(sq(root,'lvl').map(n=>n.id),NAM.lvl);else setSteps(tSteps(k),k)};
// phím tắt: 1–9 chọn đáp án, Enter sang câu tiếp (không bắt khi đang gõ chữ hoặc đang đứng trên một nút để khỏi bấm đúp)
document.addEventListener('keydown',e=>{if(!QX.on||!Q||Q.msg||$('#mo').style.display!='flex'||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target,tg=t&&t.tagName;
  if(tg=='INPUT'||tg=='TEXTAREA'||tg=='SELECT'||tg=='BUTTON')return;
  if(Q.st=='done'&&e.key=='Enter'){e.preventDefault();X.nq();return}
  if(Q.st=='ask'&&Q.k=='mc'&&/^[1-9]$/.test(e.key)&&+e.key<=Q.o.length&&X['a'+(e.key-1)])X['a'+(e.key-1)]()});
function qWatch(){if(!QX||!QX.on||!Q||Q.msg||Q.st!='ask'||QX.cfg.src!='cur'||Q.sig==H.sig()||QX.lk)return;QX.lk=1;setTimeout(()=>{QX.lk=0;if(QX.on&&Q&&Q.st=='ask'&&Q.sig!=H.sig()){newQ();drawQ();toast('Cây đã thay đổi — câu hỏi được cập nhật')}},0)}
function startQuiz(){const c=QX.cfg;qLink();close();if(c.src=='rnd'){QX.bk=QX.bk||{r:clone(root)};setTree(cfgTree(c))}else if(!root||wk().list.length<3)return hint('📝 Cây cần ít nhất 3 nút — hãy quét / nhập cây hoặc chọn "Cây ngẫu nhiên"',0);
  Object.assign(QX,{on:1,i:0,score:0,ok:0,n:0,sec:0,tp:{},streak:0,mx:0,wrong:[],cold:0,tpl:[],lt:null,revK:null});newQ();drawQ()}
const BD=h=>{const q=h.filter(r=>r.n),b=[],ok=r=>r.ok/r.n;if(h.length)b.push('🌱 Tân binh');if(h.length>=5)b.push('📚 Chăm chỉ');if(q.some(r=>r.n>=5&&r.ok==r.n))b.push('💯 Điểm tuyệt đối');if(q.some(r=>r.n>=5&&ok(r)>=.9))b.push('🎯 Xạ thủ (≥90%)');if(q.some(r=>r.n>=5&&r.sec/r.n<=10&&ok(r)>=.7))b.push('⚡ Tia chớp');if(q.some(r=>r.lv==3&&r.n>=5&&ok(r)>=.8))b.push('🏆 Cao thủ cấp 3');if(h.some(r=>r.sc>=1500))b.push('🔥 1500 điểm');if(q.some(r=>(r.mx||0)>=10))b.push('🔥 Chuỗi 10 câu');if(q.reduce((s,r)=>s+((r.tp||{}).dut||[0])[0],0)>=20)b.push('🧭 Bậc thầy duyệt cây');return b};
function tpStat(h){const tp={};h.filter(r=>r.n).forEach(r=>Object.entries(r.tp||{}).forEach(([k,v])=>{tp[k]=tp[k]||[0,0];tp[k][0]+=v[0];tp[k][1]+=v[1]}));return tp}
const weakOf=tp=>Object.entries(tp).filter(([k,v])=>v[1]>=2&&v[0]/v[1]<.8).sort((a,b)=>a[1][0]/a[1][1]-b[1][0]/b[1][1]).slice(0,3).map(([k,v])=>(TP[k]||k)+' ('+Math.round(v[0]/v[1]*100)+'%)');
function chAbort(){if(CH.on){Object.assign(QX.cfg,CH.cfg0);CH.on=0}}
function endQ(){clearInterval(QX.tm);clearTimeout(QX.it);QX.on=0;clear();if(QX.bk){root=QX.bk.r;QX.bk=null;S.sel=null;S.grow=1}refresh();
  if(!QX.n){chAbort();close();return}
  const c=QX.cfg,n=QX.n,ok=QX.ok,sec=Math.round(QX.sec),acc=Math.round(ok/n*100),before=BD(HS.g()),ch=CH.on,d=dfi();
  HS.add({d:Date.now(),m:'q',lv:c.lv,sc:QX.score,ok,n,sec,tp:QX.tp,mx:QX.mx});const nw=BD(HS.g()).filter(x=>!before.includes(x));
  if(ch){CH.score+=QX.score;CH.log.push({n:CHN[CH.i-1]||'Luyện tập',sc:QX.score})}
  let rk='';if(c.comp&&!ch){LB.add({nm:c.name,sc:QX.score,lv:c.lv});rk='<p>🏁 Thi đấu: hạng <b>'+(LB.g().findIndex(r=>r.nm==c.name&&r.sc==QX.score)+1||'—')+'</b> trên bảng xếp hạng.</p>'}
  const wk2=weakOf(QX.tp),cm=acc>=90?'Xuất sắc!':acc>=70?'Khá tốt, cố thêm chút nữa!':acc>=50?'Tạm ổn — hãy xem lại các câu sai bên dưới.':'Đừng nản — xem lại lời giải rồi thử lại nhé!',
    rv=QX.wrong.length?'<details class="rv"><summary>📋 Xem lại '+QX.wrong.length+' câu sai</summary>'+QX.wrong.slice(0,10).map(w=>'<div class="rvi"><b>'+esc(w.t)+'</b><br>✔ Đáp án: '+esc(w.a)+(w.w?'<br><small>'+esc(w.w)+'</small>':'')+'</div>').join('')+'</details>':'';
  sfx(acc>=70?SND.win:SND.hint);
  modal('Kết quả · '+qTitle(),'<div style="text-align:center"><div class="stars">'+starTxt(stars(ok/n))+'</div><p style="font-size:24px;margin:0">⭐ '+QX.score+' điểm</p><p style="margin:2px 0">'+cm+'</p></div>'+
    '<p>✅ '+ok+'/'+n+' câu đúng ('+acc+'%) · ⏱ '+(sec/n).toFixed(1)+'s/câu · 🔥 chuỗi dài nhất '+(QX.mx||0)+' · '+d.e+' '+d.n+'</p>'+
    (nw.length?'<p>🎖 Huy hiệu mới: <b>'+nw.join(' · ')+'</b></p>':'')+rk+(wk2.length?'<p>📌 <b>Nên ôn thêm:</b> '+wk2.join(', ')+'</p>':'<p>👏 Làm tốt, chưa có chủ đề nào yếu!</p>')+rv+(QX.revK&&c.src=='cur'?'<button class="bt" data-x="rev">🚶 Mô phỏng lại phép '+(NAM[QX.revK]||'duyệt')+' trên cây của bạn</button>':'')+
    (ch?'<button class="bt or" data-x="chn">▶ Chặng tiếp theo</button>':'<button class="bt or" data-x="qagain">🔁 Làm đề mới</button><button class="bt" data-x="hs2">🏅 Thành tích</button>'))}
X.qagain=()=>startQuiz();

// ---- hộp chọn chế độ, thành tích, luật chơi ----
function rdCfg(){if(!$('#cf_s'))return;const c=QX.cfg,ar=q=>[...document.querySelectorAll(q)].map(x=>x.value);c.src=$('#cf_s').value;c.type=$('#cf_t').value;c.lv=+$('#cf_l').value;c.n=Math.max(3,Math.min(15,+$('#cf_n').value||7));c.tps=ar('.cf_tp:checked');c.tys=ar('.cf_ty:checked');c.cnt=+$('#cf_c').value;c.comp=$('#cf_k').checked?1:0;if($('#cf_f'))c.link=$('#cf_f').checked?1:0;c.name=$('#cf_u').value.trim().slice(0,16)||'Học sinh'}
var HUBO={cf:0,tp:0,ty:0,md:1};   // nhớ mục nào đang mở
function hubCnt(){[['cf_tp','hc_tp'],['cf_ty','hc_ty']].forEach(([c,i])=>{const e=$('#'+i);if(e)e.textContent=document.querySelectorAll('.'+c+':checked').length+'/'+document.querySelectorAll('.'+c).length})}
$('#mbd').addEventListener('change',e=>{rdCfg();hubCnt();if(e.target&&e.target.id=='cf_l'&&$('#cf_s'))hub()});
$('#mbd').addEventListener('toggle',e=>{const k=e.target&&e.target.dataset&&e.target.dataset.k;if(k)HUBO[k]=e.target.open},true);
function hub(){chAbort();const c=QX.cfg,op=(a,v)=>a.map(([k,t])=>'<option value="'+k+'"'+(k==v?' selected':'')+'>'+t+'</option>').join(''),
  ck=(cl,v,t,on)=>'<label style="margin:4px 0;opacity:1;font-weight:600"><input type="checkbox" class="'+cl+'" value="'+v+'"'+(on?' checked':'')+' style="width:auto"> '+t+'</label>',
  bt=(x,t,d)=>'<button class="bt" data-x="'+x+'">'+t+(d?'<br><small style="opacity:.7;font-weight:400">'+d+'</small>':'')+'</button>',
  sec=(k,t,badge,body)=>'<details data-k="'+k+'"'+(HUBO[k]?' open':'')+' style="margin:0 0 8px;border:1px solid var(--l);border-radius:12px;background:#ffffff0f"><summary style="padding:10px 12px;cursor:pointer;font-weight:800;letter-spacing:.4px;display:flex;justify-content:space-between;align-items:center"><span>'+t+'</span>'+(badge||'')+'</summary><div style="padding:0 12px 10px">'+body+'</div></details>';
  modal('🎮 Trò chơi & Luyện tập',
  '<div class="dfr">'+[1,2,3].map(i=>'<button class="bt'+(c.lv==i?' on':'')+'" data-x="df'+i+'">'+DIF[i].e+' '+DIF[i].n+'</button>').join('')+'</div><small style="display:block;margin:0 0 8px;opacity:.8">'+(c.lv?'':'Tùy chỉnh — tính như Trung bình: ')+dfi().tag+'</small>'+'<small style="display:block;margin:0 0 8px;opacity:.9">'+hubLink()+'</small>'+
  sec('cf','⚙ THIẾT LẬP CÂY & SỐ CÂU','',
    '<label>Nguồn cây</label><select id="cf_s">'+op([['cur','Cây hiện tại (đang quét / chỉnh sửa)'],['rnd','Cây ngẫu nhiên']],c.src)+'</select>'+'<label style="margin:4px 0;opacity:1;font-weight:600"><input type="checkbox" id="cf_f"'+(c.link?' checked':'')+' style="width:auto"> Bám theo nội dung đang học</label><small style="display:block;opacity:.75;font-weight:400">Ưu tiên hỏi về nút đang chọn và phép duyệt vừa mô phỏng (chỉ với cây hiện tại).</small>'+
    '<label>Loại cây ngẫu nhiên</label><select id="cf_t">'+op([['auto','Tự động theo cấp độ'],['nor','Nhị phân thường'],['bst','Cây tìm kiếm nhị phân (BST)'],['bal','Cây cân bằng'],['left','Cây lệch trái'],['right','Cây lệch phải'],['khuyet','Cây khuyết']],c.type)+'</select>'+
    '<label>Cấp độ</label><select id="cf_l">'+op([[1,'1 – Dễ (5–7 nút)'],[2,'2 – Trung bình (8–12 nút)'],[3,'3 – Khó (cây lệch / khuyết)'],[0,'Tùy chỉnh']],c.lv)+'</select>'+
    '<label>Tùy chỉnh: số nút (3–15)</label><input id="cf_n" type="number" min="3" max="15" value="'+c.n+'">'+
    '<label>Số câu (Luyện tập / Thử thách thời gian)</label><select id="cf_c">'+op([[5,'5 câu'],[10,'10 câu'],[15,'15 câu'],[20,'20 câu']],c.cnt)+'</select>'+
    '<label><input type="checkbox" id="cf_k"'+(c.comp?' checked':'')+' style="width:auto"> Chế độ thi đấu (lưu bảng xếp hạng)</label><input id="cf_u" type="text" maxlength="16" placeholder="Tên của bạn" value="'+esc(c.name=='Học sinh'?'':c.name)+'">')+
  sec('tp','CHỦ ĐỀ','<small id="hc_tp" style="font-weight:600;opacity:.75;margin-left:auto;margin-right:6px">'+c.tps.length+'/'+TOP.length+'</small>',
    TOP.map(([k,t])=>ck('cf_tp',k,t,c.tps.includes(k))).join(''))+
  sec('ty','DẠNG CÂU HỎI','<small id="hc_ty" style="font-weight:600;opacity:.75;margin-left:auto;margin-right:6px">'+c.tys.length+'/'+TYP.length+'</small>',
    TYP.map(([k,t])=>ck('cf_ty',k,t,c.tys.includes(k))).join(''))+
  sec('md','CHẾ ĐỘ CHƠI','',
    bt('mPrac','📖 Luyện tập','Làm bài theo chủ đề và dạng câu hỏi đã chọn')+
    bt('mTime','⏱ Thử thách thời gian','Mỗi câu có đồng hồ đếm ngược')+
    bt('mFix','🛠 Sửa cây bị lỗi','Đổi chỗ khoá để cây trở lại là BST')+
    bt('mNext','👣 Đoán nút tiếp theo','Chạm nút được thăm tiếp theo')+
    bt('mHunt','🔍 Truy tìm nút','Săn nút theo đặc điểm, đi tìm khoá')+
    bt('mMix','🏆 Thử thách tổng hợp','Trộn ngẫu nhiên mọi trò, sai 3 lần là thua'))+
  '<div style="font-weight:800;letter-spacing:.4px;margin:12px 0 2px">TRẢI NGHIỆM TOÀN DIỆN</div>'+
  bt('mAll','🌟 Bắt đầu trải nghiệm toàn diện','4 chặng liên tiếp: Luyện tập → Đoán nút → Truy tìm nút → Sửa cây lỗi')+
  '<div style="display:flex;gap:8px;margin-top:8px"><button class="bt" data-x="hs2" style="margin:0;text-align:center">🏅 Thành tích</button><button class="bt" data-x="hr" style="margin:0;text-align:center">❓ Luật chơi</button></div>')}
OP.game=hub;OP.quiz=hub;
[1,2,3].forEach(i=>X['df'+i]=()=>{rdCfg();QX.cfg.lv=i;hub()});   // chọn nhanh cấp độ
const qStart=t=>{rdCfg();if(!QX.cfg.tps.length||!QX.cfg.tys.length)return toast('Hãy chọn ít nhất 1 chủ đề và 1 dạng câu hỏi');QX.timed=t;startQuiz()};
X.mPrac=()=>qStart(0);X.mTime=()=>qStart(1);
X.mFix=()=>gStart(5);X.mNext=()=>gStart(4);X.mHunt=()=>gStart(6);X.mMix=()=>gStart(7);
X.g4=()=>gStart(4);X.g5=()=>gStart(5);X.g6=()=>gStart(6);X.g7=()=>gStart(7);X.hub=()=>hub();
// ---- Trải nghiệm toàn diện: chuỗi các chặng ----
const CHP=[['q'],['g',4,2],['g',6,2],['g',5,1]];
function chNext(){const st=CHP[CH.i++];if(!st)return chEnd();if(st[0]=='q'){QX.timed=0;startQuiz()}else gStart(st[1],st[2])}
function chEnd(){const sc=CH.score,c=CH.cfg0,lg=(CH.log||[]).map(x=>'<div style="font-weight:400">'+esc(x.n)+': <b>'+x.sc+'</b></div>').join('');CH.on=0;Object.assign(QX.cfg,c);QX.timed=0;if(c.comp&&sc>0)LB.add({nm:c.name,sc,lv:c.lv});HS.add({d:Date.now(),m:'all',lv:c.lv,sc,ok:0,n:0,sec:0});
  modal('🌟 Hoàn thành trải nghiệm toàn diện!','<p style="font-size:24px;margin:0">⭐ '+sc+' điểm</p><p>Bạn đã đi hết 4 chặng. Điểm từng chặng:</p>'+lg+'<button class="bt or" data-x="mAll">🔁 Chơi lại</button><button class="bt" data-x="hub">🎮 Chọn chế độ khác</button>')}
X.chn=()=>{close();chNext()};
X.mAll=()=>{rdCfg();CH={on:1,i:0,score:0,log:[],cfg0:Object.assign({},QX.cfg,{tps:[...QX.cfg.tps],tys:[...QX.cfg.tys]})};Object.assign(QX.cfg,{tps:TOP.map(t=>t[0]),tys:TYP.map(t=>t[0]),cnt:5,comp:0});chNext()};
X.hs2=()=>{const h=HS.g(),q=h.filter(r=>r.n),N=q.reduce((s,r)=>s+r.n,0),O=q.reduce((s,r)=>s+r.ok,0),T=q.reduce((s,r)=>s+r.sec,0),tp=tpStat(h),w=weakOf(tp);
  const bs=LS.g('arbt_best2',{}),rec=Object.keys(bs).sort().map(k=>{const[m,l]=k.split('_');return '<div style="font-weight:400">'+(GNAME[m]||'Trò chơi')+' · '+(DIF[l]?DIF[l].e+' '+DIF[l].n:'')+': <b>'+bs[k]+'</b></div>'}).join('')||'<small>Chưa có kỷ lục — hãy chơi một trò chơi!</small>';
  const bars=Object.entries(tp).map(([k,v])=>{const p=Math.round(v[0]/v[1]*100);return '<div style="font-weight:400;margin:4px 0">'+(TP[k]||k)+': '+v[0]+'/'+v[1]+' ('+p+'%)<div class="qbar"><i style="width:'+p+'%"></i></div></div>'}).join('')||'<small>Chưa có dữ liệu.</small>';
  const lb=LB.g().map((r,i)=>'<div style="font-weight:400">'+(i+1)+'. <b>'+esc(r.nm)+'</b> — '+r.sc+' điểm · cấp '+(r.lv||'TC')+'</div>').join('')||'<small>Chưa có ai — bật "Chế độ thi đấu" khi chơi để lên bảng.</small>';
  const last=h.slice(-6).reverse().map(r=>'<div style="font-weight:400">'+new Date(r.d).toLocaleDateString('vi-VN')+' · '+(r.n?'Trắc nghiệm '+r.ok+'/'+r.n+' · ':(HN[r.m]||'Trò chơi')+' · ')+(DIF[r.lv]?DIF[r.lv].e+' · ':'')+r.sc+' đ</div>').join('')||'<small>—</small>';
  modal('🏅 Thành tích','<p>Số câu: <b>'+N+'</b> · Đúng: <b>'+(N?Math.round(O/N*100):0)+'%</b> · TB: <b>'+(N?(T/N).toFixed(1):0)+'s</b>/câu · Lượt chơi: <b>'+h.length+'</b></p><h4>Huy hiệu</h4><p>'+(BD(h).join(' · ')||'Chưa có — hãy chơi một lượt!')+'</p><h4>Theo chủ đề</h4>'+bars+(w.length?'<p>📌 <b>Nên ôn:</b> '+w.join(', ')+'</p>':'')+'<h4>Kỷ lục theo trò chơi</h4>'+rec+'<h4>Bảng xếp hạng (máy này)</h4>'+lb+'<h4>Lịch sử gần đây</h4>'+last+'<button class="bt" data-x="hclr">🗑 Xóa dữ liệu</button>',null,'',hub,'← Quay lại')};
X.hclr=()=>sure('Xóa dữ liệu','Xóa toàn bộ lịch sử chơi, huy hiệu và bảng xếp hạng trên máy này?',()=>{try{['arbt_hist','arbt_lb','arbt_best','arbt_best2'].forEach(k=>localStorage.removeItem(k))}catch(e){}},'Xóa');
X.hr=()=>modal('❓ Luật chơi','<p><b>CẤP ĐỘ</b> (chọn ở đầu bảng này): quyết định số mạng (5 / 3 / 2), thời gian (+50% / chuẩn / −30%), số lượt gợi ý (3 / 2 / 1), độ khó của câu hỏi và màn chơi, cùng hệ số điểm (×1 / ×1,5 / ×2). "Tùy chỉnh" tính như Trung bình.</p><p><b>📖 Luyện tập</b> và <b>⏱ Thử thách thời gian</b> dùng CHỦ ĐỀ và DẠNG CÂU HỎI đã chọn; câu hỏi sinh từ chính cây đang hiển thị. Sai lần 1: có gợi ý, nút liên quan được tô sáng, được thử lại (đúng lần này còn 50 điểm cơ bản); sai lần 2: hiện đáp án và lời giải. Có thể bấm 💡 Gợi ý ngay từ đầu (cũng chỉ còn 50 điểm cơ bản). Phím tắt: 1–4 chọn đáp án, Enter sang câu tiếp.</p><p><b>Dạng câu hỏi:</b> Trắc nghiệm · Đúng / Sai · Điền khuyết · Sắp xếp thứ tự (chạm các nút đúng thứ tự) · Tự luận (nhập đáp án hoặc tự trả lời rồi so với đáp án mẫu để tự chấm).</p><p><b>⭐ Điểm câu hỏi:</b> đúng ngay 100 (+ thưởng tốc độ tới 30, + thưởng chuỗi đúng liên tiếp 10 điểm/câu, tối đa 50), đúng sau gợi ý 50; rồi nhân hệ số cấp độ. Cuối bài có xếp hạng 1–3 sao theo độ chính xác và danh sách câu sai để xem lại.</p><p><b>⏱ Thử thách thời gian:</b> mỗi câu có đồng hồ (30s / 25s / 20s theo cấp độ), hết giờ tính là sai và không đổi câu được.</p><p><b>🎮 Các trò chơi chạm nút:</b> mỗi nút đúng được 10 điểm × combo (tối đa ×5); qua màn thưởng 50 + thưởng thời gian (tối đa 60, theo tỉ lệ thời gian còn lại), thêm 30 nếu hoàn hảo (không sai, không gợi ý); chạm sai hoặc hết giờ mất 1 mạng và mất combo, hết mạng là thua. 💡 Gợi ý tốn lượt và trừ điểm. Hoàn thành chặng được thưởng theo số mạng còn lại. Kỷ lục lưu riêng cho từng trò và từng cấp độ.</p><p><b>🛠 Sửa cây bị lỗi:</b> một số khoá bị đổi chỗ nên cây không còn là BST. Chạm 2 nút để đổi chỗ khoá cho đến khi hợp lệ; đổi đúng số lần tối thiểu được thưởng thêm, đổi thừa bị trừ điểm. Nếu cây đang quét là BST hợp lệ (số nguyên khác nhau, 4–15 nút) thì chơi ngay trên cây đó, nếu không sẽ dùng cây ngẫu nhiên.</p><p><b>👣 Đoán nút tiếp theo:</b> cây đã duyệt một phần; chạm các nút được thăm tiếp theo (Dễ còn 2 nút, Khó còn 4 nút). Mỗi lượt đều có giải thích.</p><p><b>🔍 Truy tìm nút:</b> khi thì săn tất cả nút theo đặc điểm, khi thì đi từ gốc tới nút có khoá cho trước (trên BST có giải thích nhỏ hơn đi trái, lớn hơn đi phải).</p><p><b>🏆 Thử thách tổng hợp:</b> mỗi màn là một trò ngẫu nhiên (duyệt đúng thứ tự, săn nút, đi tìm khoá, đoán nút, sửa cây lỗi), không lặp trò liền nhau.</p><p><b>🌟 Trải nghiệm toàn diện:</b> đi lần lượt 4 chặng, điểm được cộng dồn và hiện theo từng chặng.</p><p><b>💡 Hỗ trợ khi gặp khó:</b> sai 2 câu liên tiếp hoặc đứng yên quá lâu thì có <b>mẹo nhỏ miễn phí</b> (không trừ điểm, không mất lượt gợi ý) và nút 💡 sẽ nhấp nháy. Trong các trò chơi chạm nút, sai 2 lần trong một màn hoặc chần chừ quá lâu cũng được nhắc quy tắc; hai màn khó liên tiếp thì màn sau mở đầu bằng một mẹo. 💡 Gợi ý (trừ điểm) vẫn chỉ ra nút cần chạm.</p><p><b>🎲 Câu hỏi ngẫu nhiên:</b> có hơn 40 mẫu câu hỏi; mẫu và chủ đề vừa ra sẽ tránh lặp lại, chủ đề bạn còn yếu được ra nhiều hơn. Các trò chơi cũng tránh lặp cùng kiểu duyệt / cùng khoá liên tiếp.</p><p><b>🔗 Gắn với cây đang học:</b> bật "Bám theo nội dung đang học" để câu hỏi ưu tiên nút đang chọn và phép duyệt bạn vừa mô phỏng; cuối bài có nút mô phỏng lại phép duyệt bạn làm sai.</p><p><b>Phím tắt:</b> Ctrl+Z hoàn tác, Ctrl+Y làm lại (ngoài lúc chơi).</p>',null,'',hub,'← Quay lại');

// ================= TRÒ CHƠI TƯƠNG TÁC (mạng · giờ · điểm · combo · gợi ý · cấp độ khó) =================
// Điểm: mỗi nút đúng 10 × combo (tối đa ×5); qua màn: 50 + thưởng thời gian (tối đa 60, theo tỉ lệ thời gian còn lại) + 30 nếu hoàn hảo (không sai, không gợi ý); tất cả nhân hệ số cấp độ.
// Sai: mất 1 mạng, mất combo. Gợi ý: trừ điểm, số lượt gợi ý phụ thuộc cấp độ. Hoàn thành chặng: thưởng mạng còn lại.
const GM={on:0,m:0,lock:0,gen:0,best:0,sub:0};
X.i1=()=>{close();OP.str()};X.i2=()=>{close();OP.vals()};X.tour=()=>{close();TR.off=0;TR.i=0;try{localStorage.removeItem('arbt_tour')}catch(e){}ui()};X.adDel=()=>{close();OP.del()};X.gq=()=>{close();OP.quiz()};
X.g1=()=>gStart(1);X.g2=()=>gStart(2);X.g3=()=>gStart(3);
NAM.rin='Reverse Inorder (RNL)';RU.rin='duyệt cây con phải R, rồi thăm nút N, rồi cây con trái L';
const FIRST={pre:'Nút đầu tiên là nút gốc.',in:'Nút đầu tiên là nút cực trái (đi mãi sang trái từ gốc).',post:'Nút đầu tiên là lá đầu tiên gặp khi đi xuống, ưu tiên nhánh trái.',rin:'Nút đầu tiên là nút cực phải (đi mãi sang phải từ gốc).'};
const nch=n=>(n.l?1:0)+(n.r?1:0),SH=n=>esc(disp(n));
const later=(fn,ms)=>{const g=GM.gen;setTimeout(()=>{if(GM.on&&GM.gen==g)fn()},ms)};   // hẹn giờ gắn với lượt chơi hiện tại (thoát / chơi lại thì tự huỷ)
const gMsg=(k,h)=>{const f=$('#gF');if(f){f.className=k;f.innerHTML=h}};
function rescue(){if(navigator.vibrate)try{navigator.vibrate(80)}catch(e){}}
function gRestore(){if(GM.bak){root=GM.bak.r;GM.bak=null;S.sel=null;S.grow=1}}
function gAbort(){if(!GM.on)return;clearInterval(GM.tm);GM.on=0;GM.lock=0;gRestore();document.body.classList.remove('game');if(CH.on)chAbort();clear();refresh()}   // gọi khi đổi chế độ giữa chừng
// ---- Sửa cây lỗi: số lần đổi chỗ tối thiểu = số khoá − số chu trình của hoán vị ----
const minSw=l=>{const s=[...l].sort((a,b)=>a-b),pos=new Map(s.map((v,i)=>[v,i])),seen=l.map(()=>0);let c=0;
  for(let i=0;i<l.length;i++){if(seen[i])continue;let j=i,n=0;while(!seen[j]){seen[j]=1;j=pos.get(l[j]);n++}c+=n-1}return c};
const fixOK=t=>{const l=[];(function f(u){if(u){f(u.l);l.push(u);f(u.r)}})(t);return l.length>=4&&l.length<=15&&l.every(x=>typeof x.v=='number')&&new Set(l.map(x=>x.v)).size==l.length&&!bad(t)};
function fixPair(){const l=inord(),v=l.map(x=>x.v),s=[...v].sort((a,b)=>a-b),i=v.findIndex((x,k)=>x!=s[k]);if(i<0)return null;return[l[i],l[v.indexOf(s[i])]]}
function fInfo(){const e=$('#gI');if(!e)return;if(dfl()>=3){e.textContent='';return}const v=inord().map(x=>x.v);
  e.innerHTML='Duyệt giữa: '+v.map((x,i)=>(i>0&&x<v[i-1])||(i<v.length-1&&x>v[i+1])?'<b style="color:#ff8787">'+esc(x)+'</b>':esc(x)).join(' ')+' <small>(BST phải tăng dần)</small>'}
function fShow(ids){S.steps=ids.length?[{t:'trav',cur:ids[ids.length-1],out:ids,note:''}]:[];S.i=ids.length?0:-1;S.ck=null;refresh()}
// ---- giải thích sau mỗi lượt chạm ----
function gRel(p,c){return p&&p.l===c?'con trái của '+SH(p):p&&p.r===c?'con phải của '+SH(p):null}
function gExp(id){const k=GM.k4,cur=GM.pos?byId(GM.T[GM.pos-1]):null,nx=byId(GM.T[GM.pos]);if(!nx)return 'Chưa đúng.';
  if(!cur)return NAM[k]+': '+RU[k]+'. Nút đầu tiên chưa phải nút '+SH(byId(id))+'. '+FIRST[k];
  const rel=nx===cur.l?'con trái của nó':nx===cur.r?'con phải của nó':'một nút khác (cần quay lên rồi sang nhánh còn lại)';
  return NAM[k]+': '+RU[k]+'. Sau nút '+SH(cur)+' phải đến '+rel+', không phải nút '+SH(byId(id))+'.'}
function gWhy(id){const n=byId(id),k=GM.sub;if(!n)return 'Chưa đúng.';
  if(k==2){const e=wk().m[id];return 'Nút '+SH(n)+' (mức '+e.d+', '+nch(n)+' con) không phải '+GM.cat+'.'}
  if(k==3){if(!GM.pos)return 'Đường đi luôn bắt đầu từ nút <b>gốc</b>.';const c=byId(GM.T[GM.pos-1]);if(!c)return 'Chưa đúng.';
    return GM.bst?'Tại nút '+SH(c)+': '+esc(GM.key)+(cmp(GM.key,c.v)<0?' nhỏ hơn → phải đi sang trái.':' lớn hơn → phải đi sang phải.'):'Nút '+SH(n)+' không nằm trên đường từ nút '+SH(c)+' xuống khoá '+esc(GM.key)+'.'}
  return gExp(id)}
function gOk(id){const n=byId(id),k=GM.sub;if(!n)return '✔';
  if(k==2)return '✔ '+SH(n)+' là '+GM.cat+' — còn '+(GM.T.length-GM.hit.size)+' nút';
  if(k==3){if(GM.pos>=GM.T.length)return '🎯 Tìm thấy khoá '+esc(GM.key);if(GM.pos==1&&!GM.bst)return '✔ Bắt đầu từ nút gốc';
    return GM.bst?'✔ '+esc(GM.key)+(cmp(GM.key,n.v)<0?' < ':' > ')+SH(n)+' → đi sang '+(cmp(GM.key,n.v)<0?'trái':'phải'):'✔ Đúng đường, xuống tiếp'}
  const p=GM.pos>1?byId(GM.T[GM.pos-2]):null,rel=p?gRel(p,n):null;
  return GM.pos==1?'✔ '+SH(n)+' — nút đầu tiên theo '+NAM[GM.k4]:rel?'✔ '+SH(n)+' là '+rel:'✔ '+SH(n)+' — quay lên rồi sang nhánh khác'}
function gAns(){if(GM.need=='fix')return 'Thứ tự giữa đúng phải tăng dần: <b>'+inord().map(x=>x.v).sort((a,b)=>a-b).join(' ')+'</b>.';
  if(GM.need=='set')return 'Các nút cần chạm: <b>'+GM.T.map(id=>SH(byId(id))).join(', ')+'</b>.';
  return (GM.sub==3?'Đường đi đúng: ':'Thứ tự đúng: ')+'<b>'+GM.T.map(id=>SH(byId(id))).join(' → ')+'</b>.'}
function gReveal(){if(GM.need=='fix'){const p=fixPair();fShow(p?[p[0].id,p[1].id]:[])}else fShow(GM.T)}
// ---- khung điều khiển ----
function gPanel(title,txt,extra){const d=dfi();
  $('#gm').innerHTML='<div>'+(CH.on?'<small>Chặng '+CH.i+'/'+CHP.length+' · </small>':'')+'🎮 <b>'+title+'</b> · màn '+(GM.lv+1)+(GM.cap?'/'+GM.cap:'')+' <small>'+d.e+' '+d.n+'</small><span id="gS" style="float:right"></span></div><div style="margin:6px 0">'+txt+'</div>'+(extra||'')+
  '<div id="gP"></div><div class="bar"><i id="gB"></i></div><div id="gF"></div><div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button data-g="hint">💡 Gợi ý (<span>'+GM.hints+'</span>)</button><button data-g="skip">Bỏ qua (−1 ❤)</button><button data-g="quit">Thoát</button></div>'}
function gStats(){$('#gS').innerHTML='⭐ '+GM.score+' · 🔥 '+GM.combo+(GM.combo>=2?' ×'+Math.min(GM.combo,5):'')+' · '+'❤'.repeat(Math.max(0,GM.lives))+'🖤'.repeat(Math.max(0,GM.max-GM.lives));
  $('#gP').textContent=GM.need=='fix'?'🔁 '+GM.mv+' lần đổi · ít nhất cần '+GM.opt+' lần':(GM.need=='order'?GM.pos:GM.hit.size)+' / '+GM.T.length;
  const hb=document.querySelector('#gm [data-g=hint]');if(hb){hb.disabled=GM.hints<=0;const s=hb.querySelector('span');if(s)s.textContent=GM.hints}}
function gShow(bad){const h=[...GM.hit];S.steps=bad?[{t:'path',cur:bad,out:[bad],res:'no',note:''}]:[{t:'trav',cur:h[h.length-1],out:h,note:''}];S.i=0;S.ck=null;sync()}
const gView=()=>GM.need=='fix'?fShow(GM.pick!=null?[GM.pick]:[]):gShow();
function gGlow(ids){S.steps=[{t:'path',cur:ids[ids.length-1],out:ids,note:''}];S.i=0;S.ck=null;refresh();later(gView,1500)}
// ---- nhắc nhẹ khi người chơi gặp khó (miễn phí, khác 💡 Gợi ý vốn tốn lượt và điểm) + tránh lặp màn ----
const IDLE={1:8000,2:11000,3:15000};
const gPulse=()=>{const hb=document.querySelector('#gm [data-g=hint]');if(hb&&GM.hints>0)hb.classList.add('pulse')};
function gSoftTxt(){if(GM.need=='fix')return 'duyệt giữa của BST phải tăng dần — hãy tìm chỗ bị "gãy" '+(dfl()<3?'(số đỏ ở dòng trên)':'(tự viết duyệt giữa ra giấy)')+', rồi đổi chỗ khoá với nút đúng vị trí.';
  if(GM.need=='order'){if(GM.sub==3)return GM.bst?'khoá nhỏ hơn thì đi trái, lớn hơn thì đi phải (bắt đầu từ nút gốc).':'đường đi bắt đầu từ nút gốc, mỗi bước xuống một nút con.';
    return NAM[GM.k4]+': '+RU[GM.k4]+'.'+(GM.pos?'':' '+(FIRST[GM.k4]||''))}
  return 'còn '+(GM.T.length-GM.hit.size)+' '+GM.cat+' chưa chạm — hãy đối chiếu định nghĩa của "'+GM.cat+'" với từng nút.'}
const hp=s=>{GM.hist.push(s);if(GM.hist.length>4)GM.hist.shift()};
const fr=(L,sig)=>{const f=L.filter(x=>!GM.hist.includes(sig(x)));return f.length?f:L};
function pkK(ks,p){const f=fr(ks,x=>p+x);let k=rn(f);if(QX.focus&&f.includes(QX.focus)&&Math.random()<.5)k=QX.focus;hp(p+k);return k}
function gTick(){const left=GM.tl-(Date.now()-GM.t0),b=$('#gB');if(b){b.style.width=Math.max(0,left/GM.tl*100)+'%';b.classList.toggle('warn',left<GM.tl*.3)}
  if(left<=3000&&left>0){const k=Math.ceil(left/1000);if(k!=GM.tk){GM.tk=k;sfx(SND.tick)}}
  if(left<=0)gLose('⏱ Hết giờ!',1);
  else if(!GM.soft&&!GM.lock&&Date.now()-GM.act>IDLE[dfl()]){GM.soft=1;const t=gSoftTxt();if(t){gMsg('info','💡 Bí rồi à? <b>Mẹo:</b> '+t+(GM.hints>0?' <small>(hoặc bấm 💡 Gợi ý để xem nút cần chạm)</small>':''));sfx(SND.hint);gPulse()}}}
// ---- bắt đầu / vòng chơi ----
function gStart(m,cap){rdCfg();qLink();close();
  if(m==5||m==7){if(!GM.bak)GM.bak={r:clone(root)};if(m==7&&QX.cfg.src=='rnd')setTree(cfgTree(QX.cfg))}
  else if(QX.cfg.src=='rnd'){if(!GM.bak)GM.bak={r:clone(root)};setTree(cfgTree(QX.cfg))}
  if(m!=5&&wk().list.length<3){gRestore();return hint('🎮 Cây cần ít nhất 3 nút — hãy chèn thêm hoặc nhập cây rồi chơi',0)}
  clear();const d=dfi();
  Object.assign(GM,{on:1,gen:GM.gen+1,m,cap:cap||0,lives:d.lives,max:d.lives,hints:d.hints,score:0,combo:0,mxc:0,lv:0,pick:null,mv:0,hit:new Set(),T:[],pos:0,hits:0,miss:0,hu:0,done:0,perf:0,lock:0,sub:0,swp:0,hist:[],soft:0,act:Date.now(),strg:0,bd:0,ntf:0,base:clone(root)});
  document.body.classList.add('game');S.sel=null;if(QX.cfg.src=='cur'&&m!=5)toast('🔗 Đang chơi trên chính cây của bạn');gRound()}
const gNext=()=>{if(!GM.on)return;if(GM.cap&&GM.lv>=GM.cap)gEnd('🏁 Hoàn thành chặng!',1);else{if(QX.cfg.src=='rnd'&&[1,2,3,4,6].includes(GM.m)&&GM.lv%2==0)setTree(cfgTree(QX.cfg));gRound()}};
function gRound(){clearInterval(GM.tm);GM.lock=0;
  if(GM.swp){GM.swp=0;if(GM.m==7&&GM.base){root=clone(GM.base);S.sel=null;S.grow=1;clear();refresh()}}   // sau màn "sửa cây" trong chế độ tổng hợp: trả cây về nguyên trạng
  let m=GM.m;if(m==6)m=rn([2,3]);else if(m==7)m=rn([1,2,3,4,5].filter(x=>x!=GM.sub));
  GM.sub=m;GM.err=0;GM.hr=0;GM.tk=0;GM.cat='';GM.bst=0;GM.soft=0;GM.bd=0;GM.act=Date.now();if(m==5)return fRound();
  const a=wk().list;if(a.length<3)return gEnd('Cây cần ≥ 3 nút');
  const d=dfl(),df=dfi();let T,need='order',txt;
  if(m==1){const k=pkK(d==1?['pre','in']:d==2?['pre','in','post']:['pre','in','post','rin'],'o');T=seqIds(k);GM.k4=k;txt='Chạm các nút theo thứ tự <b>'+TNm[k]+'</b>'+(d==1?'<br><small>'+NAM[k]+': '+RU[k]+'</small>':'')}
  else if(m==4){const k=pkK(d==1?['pre','in']:['pre','in','post'],'n');T=seqIds(k);GM.k4=k;GM.pre=Math.max(1,T.length-Math.min(T.length-1,[2,3,4][d-1]));txt='Đang duyệt <b>'+NAM[k]+'</b> — chạm nút được thăm <b>tiếp theo</b>'+(d==1?'<br><small>'+RU[k]+'</small>':'')}
  else if(m==2){const mx=Math.max(...a.map(e=>e.d)),Lv=1+(Math.random()*mx|0),
      PR=[['nút lá',e=>!e.n.l&&!e.n.r,1],['nút có đủ 2 con',e=>e.n.l&&e.n.r,1],['nút nhánh (có ít nhất 1 con)',e=>e.n.l||e.n.r,2],['nút ở mức '+Lv,e=>e.d==Lv,2],['nút chỉ có đúng 1 con',e=>!e.n.l!=!e.n.r,3],['nút lá ở mức từ '+Lv+' trở xuống',e=>!e.n.l&&!e.n.r&&e.d>=Lv,3]].filter(p=>d==1?p[2]<=1:d==2?p[2]<=2:p[2]>=2);
    for(let t=0;t<14;t++){const p=rn(fr(PR,x=>'s'+x[0])),ids=a.filter(p[1]).map(e=>e.n.id);if(ids.length>=1&&ids.length<a.length){T=ids;GM.cat=p[0];txt='Chạm <b>tất cả '+p[0]+'</b> (thứ tự tùy ý)';need='set';hp('s'+p[0]);break}}
    if(!T){T=seqIds('pre');GM.k4='pre';GM.sub=1;txt='Chạm các nút theo <b>duyệt trước</b>'}}
  else{let x,n0;for(let t=0;t<14;t++){n0=rnE(a).n;T=pathTo(n0);x=n0.v;if(T.length>=(d==3?3:2)&&!GM.hist.includes('p'+x))break}hp('p'+x);
    if(T.length<2){n0=a.find(e=>e.d>0).n;T=pathTo(n0);x=n0.v}
    GM.key=x;GM.bst=bad(root)?0:1;txt='Đi từ gốc xuống nút có khoá <b>'+esc(x)+'</b>, chạm từng nút trên đường đi'+(d==1&&GM.bst?'<br><small>BST: khoá nhỏ hơn thì đi trái, lớn hơn thì đi phải</small>':'')}
  const cnt=GM.sub==4?T.length-GM.pre:T.length;
  Object.assign(GM,{T,need,pos:0,hit:new Set(),tl:Math.max(6000,(cnt*2300+3500)*Math.pow(.93,GM.lv)*df.tm),t0:Date.now()});
  if(GM.sub==4){GM.pos=GM.pre;GM.hit=new Set(T.slice(0,GM.pre))}
  clear();refresh();gPanel(GNAME[GM.sub],txt);gStats();if(GM.strg>=2){gMsg('info','💡 <b>Mẹo:</b> '+(GTIP[GM.sub]||''));GM.strg=0}if(GM.sub==4)gShow();GM.tm=setInterval(gTick,100)}
function fRound(){const d=dfl(),df=dfi();let t=null;
  if(QX.cfg.src=='cur'&&GM.base&&fixOK(GM.base))t=clone(GM.base);                         // dùng đúng cây đang quét nếu nó là BST hợp lệ
  if(!t){if(QX.cfg.src=='cur'&&!GM.ntf){GM.ntf=1;toast('ℹ Cây hiện tại chưa là BST hợp lệ (cần 4–15 số nguyên khác nhau) — màn này dùng cây ngẫu nhiên')}t=genTree('bst',[5,6,7][d-1]+Math.min(3,GM.lv)+(Math.random()*2|0))}
  const l=[];(function f(u){if(u){f(u.l);l.push(u);f(u.r)}})(t);
  const sw=Math.min(4,(d==3?2:1)+(GM.lv>=2?1:0),l.length-1);
  for(let i=0;i<sw;i++){const a=rn(l),c=rn(l.filter(x=>x!==a));[a.v,c.v]=[c.v,a.v]}
  if(!bad(t))[l[0].v,l[1].v]=[l[1].v,l[0].v];                                              // phòng hai lần đổi triệt tiêu nhau → cây vẫn hợp lệ
  const opt=minSw(l.map(x=>x.v));
  setTree(t);Object.assign(GM,{T:[],need:'fix',hit:new Set(),pos:0,pick:null,mv:0,opt,swp:1,tl:Math.max(20000,(opt*18000+12000)*Math.pow(.95,GM.lv))*df.tm,t0:Date.now()});
  gPanel('Sửa cây lỗi','Cây này bị đổi chỗ khoá của vài cặp nút nên không còn là BST. Chạm <b>2 nút</b> để đổi chỗ khoá cho đến khi hợp lệ (trái &lt; nút &lt; phải).','<div id="gI" style="font-size:12px;margin:2px 0"></div>');
  gStats();fInfo();if(GM.strg>=2){gMsg('info','💡 <b>Mẹo:</b> '+GTIP[5]);GM.strg=0}GM.tm=setInterval(gTick,100)}
function fTap(id){
  if(GM.pick==null){GM.pick=id;beep(520);gMsg('info','Đã chọn nút <b>'+SH(byId(id))+'</b> — chạm nút thứ hai để đổi chỗ khoá.');return fShow([id])}
  if(GM.pick==id){GM.pick=null;gMsg('info','Đã bỏ chọn.');return fShow([])}
  const a=byId(GM.pick),b=byId(id),va=esc(a.v),vb=esc(b.v),before=minSw(inord().map(x=>x.v));[a.v,b.v]=[b.v,a.v];GM.mv++;GM.pick=null;
  const bn=bad(root),after=minSw(inord().map(x=>x.v));if(after<before)GM.hits++;else GM.miss++;fShow([a.id,b.id]);fInfo();gStats();
  if(!bn){const eff=Math.max(0,GM.mv-GM.opt),m=dfi().mul,ex=eff?-Math.round(10*m*eff):Math.round(40*m);
    return gClear({ex,exTxt:eff?'🔁 thừa '+eff+' lần đổi '+ex:'🎯 đổi tối ưu +'+ex,np:1})}
  if(after<before){beep(560);gMsg('ok','✔ Đổi '+va+' ↔ '+vb+': đúng hướng, còn cần ít nhất <b>'+after+'</b> lần đổi.');gfx('ok','',1)}
  else{GM.bd++;const sf=GM.bd>=2&&!GM.soft?(GM.soft=1,gPulse(),'<br>💡 <b>Mẹo:</b> '+gSoftTxt()):'';beep(200);gMsg('bad','✖ Đổi '+va+' ↔ '+vb+(after>before?' làm cây xa hợp lệ hơn':' chưa giúp ích')+' — nút <b>'+SH(bn)+'</b> vẫn vi phạm quy tắc BST.'+sf);gfx('bad','',1)}}
// ---- chạm nút ----
function gTap(id){if(!GM.on||GM.lock)return;GM.act=Date.now();if(GM.need=='fix')return fTap(id);
  if(GM.need=='order'){if(id==GM.T[GM.pos]){GM.hit.add(id);GM.pos++}else return gBad(id)}
  else{if(GM.hit.has(id))return;if(GM.T.includes(id))GM.hit.add(id);else return gBad(id)}
  GM.combo++;GM.mxc=Math.max(GM.mxc,GM.combo);GM.hits++;const mul=Math.min(GM.combo,5),p=Math.round(10*mul*dfi().mul);GM.score+=p;
  sfx(GM.combo>=3?SND.combo:SND.ok);buzz(20);gShow();gStats();
  gMsg('ok',gOk(id)+' · <b>+'+p+'</b>'+(GM.combo>=3?' · 🔥 combo ×'+mul:''));gfx('ok','+'+p,1);
  if((GM.need=='order'?GM.pos:GM.hit.size)>=GM.T.length)gClear()}
function gBad(id){GM.lives--;GM.combo=0;GM.miss++;GM.err++;sfx(SND.bad);buzz([60,40,60]);gShow(id);gStats();
  let sf='';if(GM.lives>0&&GM.err>=2&&!GM.soft){const t=gSoftTxt();if(t){GM.soft=1;sf='<br>💡 <b>Mẹo:</b> '+t;gPulse()}}gMsg('bad','❌ '+gWhy(id)+(GM.lives>0?' <b>−1 ❤</b>':'')+sf);gfx('bad','−1 ❤');
  if(GM.lives<=0)return gEnd();later(gView,500)}
function gLose(msg,to){if(!GM.on||GM.lock)return;clearInterval(GM.tm);GM.lives--;GM.combo=0;GM.miss++;GM.strg=(GM.strg||0)+1;GM.pick=null;sfx(SND.bad);buzz([60,40,60]);gStats();gfx('bad',to?'⏱ Hết giờ!':'💔 −1 ❤');
  if(GM.lives<=0)return gEnd(to?'⏱ Hết giờ!':undefined);
  GM.lock=1;gMsg('bad',msg+' <b>−1 ❤</b> · '+gAns());gReveal();later(gRound,2600)}
function gClear(o){o=o||{};clearInterval(GM.tm);GM.lock=1;const df=dfi(),left=Math.max(0,GM.tl-(Date.now()-GM.t0)),clean=!GM.err&&!GM.hr,
    base=Math.round(50*df.mul),tb=Math.round(60*(left/GM.tl)*df.mul),perf=!o.np&&clean?Math.round(30*df.mul):0,g=Math.max(10,base+tb+perf+(o.ex||0));
  GM.strg=(GM.err||GM.bd>1)?(GM.strg||0)+1:0;GM.score+=g;GM.lv++;GM.done++;if(clean)GM.perf++;if(GM.need!='fix')fShow(GM.T);gStats();
  sfx(SND.win);buzz([30,30,60]);gfx('win','✔ Qua màn! +'+g);
  gMsg('ok','✔ Qua màn! Cơ bản '+base+(tb?' · ⚡ thời gian +'+tb:'')+(perf?' · ✨ hoàn hảo +'+perf:'')+(o.exTxt?' · '+o.exTxt:'')+' = <b>+'+g+'</b>');
  later(gNext,1500)}
// ---- gợi ý (tốn điểm và lượt gợi ý) ----
function gHint(){if(!GM.on||GM.lock)return;GM.act=Date.now();const pb=document.querySelector('#gm [data-g=hint]');if(pb)pb.classList.remove('pulse');
  if(GM.hints<=0){const t=gSoftTxt();return gMsg('info','Đã hết lượt gợi ý.'+(t?' 💡 <b>Mẹo miễn phí:</b> '+t:''))}
  const k=GM.sub;let h='',gl=null;
  if(GM.need=='fix'){const p=fixPair();if(!p)return;gl=[p[0].id,p[1].id];h='Thử đổi chỗ khoá của hai nút đang được tô sáng.'}
  else if(GM.need=='order'){const nx=byId(GM.T[GM.pos]),cur=GM.pos?byId(GM.T[GM.pos-1]):null;
    if(k==3){h=GM.bst?'Trong BST: khoá nhỏ hơn thì đi trái, lớn hơn thì đi phải.':'Tìm nhánh có chứa khoá '+esc(GM.key)+'.';gl=[nx.id]}
    else if(cur){const rel=gRel(cur,nx);h=NAM[GM.k4]+': '+RU[GM.k4]+'. Nút tiếp theo '+(rel?'là '+rel+'.':'không phải con của '+SH(cur)+' — hãy quay lên rồi sang nhánh khác.')}
    else h=NAM[GM.k4]+': '+RU[GM.k4]+'. '+FIRST[GM.k4]}
  else{const rest=GM.T.filter(id=>!GM.hit.has(id));gl=[rn(rest)];h='Còn '+rest.length+' nút cần chạm — nút đang được tô sáng là một trong số đó.'}
  const cost=Math.min(GM.score,Math.round(15*dfi().mul));GM.hints--;GM.hu++;GM.hr=1;GM.score-=cost;gStats();sfx(SND.hint);
  gMsg('info','💡 '+h+(cost?' <b>(−'+cost+')</b>':''));if(gl)gGlow(gl)}
// ---- kết thúc ----
const GTIP={1:'Nhớ: Preorder N-L-R, Inorder L-N-R, Postorder L-R-N, ngược R-N-L.',2:'Tìm các nút lá trước: chúng không có con.',3:'Trong BST: nhỏ hơn đi trái, lớn hơn đi phải.',4:'Hãy tự "chạy" phép duyệt trong đầu, bắt đầu từ nút vừa thăm.',5:'Duyệt giữa của BST luôn tăng dần — hãy tìm chỗ bị "gãy" thứ tự.',6:'Luyện cả hai kiểu: săn nút theo đặc điểm và đi tìm khoá.',7:'Dùng gợi ý đúng lúc và giữ combo để lên điểm nhanh.'};
function gEnd(msg,win){if(!GM.on)return;clearInterval(GM.tm);const d=dfi(),was=GM.m,ch=CH.on;let bonus=0;
  if(win&&GM.lives>0){bonus=Math.round(GM.lives*25*d.mul);GM.score+=bonus}
  const sc=GM.score,old=BS.g(was),nb=sc>old,tot=GM.hits+GM.miss,acc=tot?GM.hits/tot:0,st=sc<=0?0:Math.max(1,win?Math.max(2,stars(acc)):stars(acc));
  if(nb)BS.s(was,sc);if(ch){CH.score+=sc;CH.log.push({n:CHN[CH.i-1]||GNAME[was],sc})}
  GM.on=0;GM.lock=0;gRestore();
  if(sc>0||GM.hits)HS.add({d:Date.now(),m:'g'+was,lv:dfl(),sc,ok:0,n:0,sec:0,rd:GM.done,acc:Math.round(acc*100),mx:GM.mxc});
  if(!ch&&QX.cfg.comp&&sc>0)LB.add({nm:QX.cfg.name,sc,lv:dfl()});
  document.body.classList.remove('game');clear();refresh();sfx(win?SND.win:SND.lose);
  modal(msg||'Hết lượt!','<div style="text-align:center"><div class="stars">'+starTxt(st)+'</div><p style="font-size:24px;margin:0">⭐ '+sc+' điểm</p></div>'+
    '<p>'+(nb&&sc>0?'🏆 Kỷ lục mới ('+d.n+')!':'Kỷ lục ('+d.n+'): '+Math.max(old,sc))+'</p>'+
    '<p>🎯 Chính xác '+Math.round(acc*100)+'% ('+GM.hits+'/'+tot+') · 🔥 combo cao nhất '+GM.mxc+' · ✔ '+GM.done+' màn'+(GM.perf?' (✨ '+GM.perf+' hoàn hảo)':'')+(GM.hu?' · 💡 '+GM.hu+' gợi ý':'')+'</p>'+
    (bonus?'<p>❤ Thưởng mạng còn lại: +'+bonus+'</p>':'')+(win?'':'<p>💡 <small>'+(GTIP[was]||'')+'</small></p>')+
    (ch?'<button class="bt or" data-x="chn">'+(CH.i<CHP.length?'▶ Chặng tiếp theo':'🏁 Xem kết quả')+'</button>':'<button class="bt or" data-x="g'+(was||1)+'">🔁 Chơi lại</button><button class="bt" data-x="hub">🎮 Chọn chế độ / cấp độ khác</button>'))}
$('#gm').addEventListener('click',e=>{const b=e.target.closest('[data-g]');if(!b)return;const g=b.dataset.g;if(g=='quit')gEnd('Đã thoát');else if(g=='hint')gHint();else if(GM.on)gLose('Bỏ qua')});
