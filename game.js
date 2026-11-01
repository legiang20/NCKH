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
var QX={on:0,recent:[],timed:0,cfg:{src:'cur',type:'auto',lv:1,n:7,tps:['cau','dut','pt','bst','vd'],tys:['mc','tf','fill','ord','essay'],cnt:10,comp:0,name:'Học sinh'}};
var CH={on:0};
// Mục 1: CHỦ ĐỀ · Mục 2: DẠNG CÂU HỎI
const TOP=[['cau','Nhận biết cấu trúc cây'],['dut','Phép duyệt cây'],['pt','Phân tích cây'],['bst','Cây BST'],['vd','Vận dụng']];
const TYP=[['mc','Trắc nghiệm'],['tf','Đúng / Sai'],['fill','Điền khuyết'],['ord','Sắp xếp thứ tự'],['essay','Tự luận']];
const qTitle=()=>CH.on?'🌟 Trải nghiệm toàn diện':QX.timed?'⏱ Thử thách thời gian':'📖 Luyện tập';
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
const Qm=(tp,lv,t,r,w,why,o={})=>{w=w.filter(x=>!(typeof x=='number'&&x<0));const q=mc(t,r,w,why,o.run);if(q)Object.assign(q,{k:'mc',tp,lv,hint:o.hint||HT[tp]||'',hl:o.hl||null,sid:o.sid||null});return q};
const Qb=(tp,lv,t,yes,why,o)=>({k:'mc',tf:1,tp,lv,t,o:['Có','Không'],a:yes?0:1,why,hint:o.hint,hl:o.hl||null,run:o.run});
const kk=()=>rn(['pre','in','post','lvl']),runK=(k,ids)=>k=='lvl'?()=>show(ids,NAM.lvl):()=>setSteps(tSteps(k),k);
const G2=[
 ['cau',1,()=>Qm('cau',1,'Nút gốc của cây là nút nào?',root.v,vl(),'Nút gốc là nút duy nhất không có cha, nằm trên cùng (mức 0).',{hint:'Tìm nút nằm trên cùng, không có nút nào trỏ tới nó.',hl:[root.id],run:()=>show([root.id],'Nút gốc')})],
 ['cau',1,()=>{const l=ND().filter(e=>!e.n.l&&!e.n.r),n=l.length;return Qm('cau',1,'Cây có bao nhiêu nút lá?',n,[n+1,n+2,n-1,n-2,ND().length],'Nút lá là nút không có con. Các nút lá: '+l.map(e=>e.n.v).join(', ')+'.',{hint:'Nút lá là nút không có cả con trái lẫn con phải.',run:()=>show(l.map(e=>e.n.id),'Các nút lá')})}],
 ['cau',1,()=>{const n=ND().length,ed=Math.random()<.5,r=ed?n-1:n;return Qm('cau',1,ed?'Cây có bao nhiêu cạnh?':'Cây có tất cả bao nhiêu nút?',r,[r+1,r+2,r-1,r-2,ed?n:n-1],ed?'Cây có n nút thì có n − 1 cạnh: '+n+' − 1 = '+(n-1)+'.':'Đếm tất cả các nút, kể cả gốc và lá: '+n+'.',{hint:ed?'Mỗi nút (trừ gốc) có đúng một cạnh nối lên cha.':'Đếm từng nút, kể cả gốc và lá.'})}],
 ['cau',1,()=>{const e=rn(ND().filter(e=>e.p));if(!e)return null;const p=e.p.n;return Qm('cau',1,'Nút cha của nút '+e.n.v+' là nút nào?',p.v,vl(),'Nút '+e.n.v+' là con '+(p.l===e.n?'trái':'phải')+' của nút '+p.v+'.',{hint:'Đi ngược lên một cạnh từ nút '+e.n.v+'.',hl:[e.n.id],run:()=>show([p.id,e.n.id],'Cha → con')})}],
 ['cau',1,()=>{const e=rn(ND()),d=rn(['l','r']),c=e.n[d],s=d=='l'?'trái':'phải';return Qm('cau',1,'Con '+s+' của nút '+e.n.v+' là nút nào?',c?c.v:'Không có',[...vl(),'Không có'],c?'Con '+s+' của '+e.n.v+' là '+c.v+'.':'Nút '+e.n.v+' không có con '+s+'.',{hint:'Nhìn nhánh bên '+s+' đi xuống từ nút '+e.n.v+'.',hl:[e.n.id],run:()=>show([e.n.id].concat(c?[c.id]:[]),'Nút '+e.n.v)})}],
 ...[[1,1],[2,1],[3,2],[0,2],[4,2],[6,3]].map(([i,lv])=>['pt',lv,()=>{const q=QG[i]();if(q)Object.assign(q,{k:'mc',tp:'pt',lv,hint:HT.pt});return q}]),
 ['pt',2,()=>{const l=ND(),L=1+(Math.random()*Math.max(...l.map(e=>e.d))|0),n=l.filter(e=>e.d==L),c=n.length;return Qm('pt',2,'Mức '+L+' có bao nhiêu nút?',c,[c+1,c+2,c-1,2**L,l.length],'Các nút ở mức '+L+': '+n.map(e=>e.n.v).join(', ')+'.',{hint:'Mức = số cạnh từ gốc xuống. Đếm các nút cùng mức.',run:()=>show(n.map(e=>e.n.id),'Mức '+L)})}],
 ['pt',2,()=>{const l=ND().filter(e=>e.n.l&&e.n.r),c=l.length;return Qm('pt',2,'Có bao nhiêu nút có đủ 2 con?',c,[c+1,c+2,c-1,ND().filter(e=>!e.n.l&&!e.n.r).length],c?'Các nút đủ 2 con: '+l.map(e=>e.n.v).join(', ')+'.':'Không nút nào có đủ 2 con.',{hint:'Chỉ đếm nút có cả con trái và con phải.',run:()=>show(l.map(e=>e.n.id),'Nút đủ 2 con')})}],
 ['dut',1,()=>{const k=kk(),a=sq(root,k),v=a.map(n=>n.v),s=jn(v),ids=a.map(n=>n.id);return Qm('dut',1,'Kết quả duyệt '+NAM[k]+' của cây là:',s,[...['pre','in','post','lvl'].filter(x=>x!=k).map(x=>jn(sv(root,x))),...dist(v)],NAM[k]+': '+RU[k]+' → '+s+'.',{hint:NAM[k]+': '+RU[k]+'.',sid:ids,run:runK(k,ids)})}],
 ['dut',2,()=>{const k=kk(),a=sq(root,k);if(a.length<3)return null;const i=Math.random()*(a.length-1)|0,x=a[i],y=a[i+1];return Qm('dut',2,'Theo '+NAM[k]+', nút nào được thăm ngay sau nút '+x.v+'?',y.v,vl(),'Thứ tự '+NAM[k]+': '+jn(a.map(n=>n.v))+'. Sau '+x.v+' là '+y.v+'.',{hint:NAM[k]+': '+RU[k]+'.',hl:[x.id],run:runK(k,a.map(n=>n.id))})}],
 ['dut',2,()=>{const k=kk(),a=sq(root,k);if(a.length<4)return null;const i=1+(Math.random()*(a.length-1)|0);return Qm('dut',2,'Theo '+NAM[k]+', nút được thăm thứ '+(i+1)+' là nút nào?',a[i].v,vl(),'Thứ tự '+NAM[k]+': '+jn(a.map(n=>n.v))+'. Nút thứ '+(i+1)+' là '+a[i].v+'.',{hint:NAM[k]+': '+RU[k]+'.',hl:a.slice(0,i).map(n=>n.id),run:runK(k,a.map(n=>n.id))})}],
 ['bst',2,()=>{const b=bad(root);return Qb('bst',2,'Cây này có phải là cây tìm kiếm nhị phân (BST) không?',!b,b?'Nút '+b.v+' vi phạm: mỗi nút phải lớn hơn mọi khoá bên trái và nhỏ hơn mọi khoá bên phải (kể cả so với các tổ tiên).':'Mọi nút đều lớn hơn cây con trái và nhỏ hơn cây con phải → là BST.',{hint:'Với mỗi nút: trái < nút < phải, và phải đúng với cả các tổ tiên chứ không chỉ với cha.',hl:b?[b.id]:null,run:()=>b&&show([b.id],'Nút vi phạm')})}],
 ['bst',2,()=>{if(bad(root))return null;const io=inord(),mx=Math.random()<.5,x=mx?io[io.length-1]:io[0];return Qm('bst',2,'Giá trị '+(mx?'lớn':'nhỏ')+' nhất của BST là bao nhiêu?',x.v,vl(),(mx?'Đi mãi sang phải':'Đi mãi sang trái')+' từ gốc đến nút cuối: '+x.v+'.',{hint:'Trong BST, khoá '+(mx?'lớn':'nhỏ')+' nhất nằm ở nút cực '+(mx?'phải':'trái')+'.',run:()=>show(pathTo(x),'Đường đi tới giá trị '+(mx?'lớn':'nhỏ')+' nhất')})}],
 ['bst',2,()=>{if(bad(root))return null;const t=rn(ND()).n,p=pathTo(t),pv=p.map(dv),o=ND().map(e=>jn(pathTo(e.n).map(dv)));return Qm('bst',2,'Tìm khoá '+t.v+' trong BST, các nút được so sánh theo thứ tự nào?',jn(pv),[...o,...dist(pv)],'Từ gốc: nhỏ hơn đi trái, lớn hơn đi phải → '+jn(pv)+'.',{hint:'So sánh khoá cần tìm với nút hiện tại: nhỏ hơn đi trái, lớn hơn đi phải.',sid:p,run:()=>show(p,'Đường tìm '+t.v)})}],
 ['bst',2,()=>{if(bad(root))return null;const have=new Set(vl());let v;for(let i=0;i<40&&(!v||have.has(v));i++)v=1+(Math.random()*45|0);if(have.has(v))return null;let c=root,pn;while(c){pn=c;c=v<c.v?c.l:c.r}const w=[];ND().forEach(e=>{!e.n.l&&w.push('con trái của '+e.n.v);!e.n.r&&w.push('con phải của '+e.n.v)});const pp=pathTo(pn);return Qm('bst',2,'Chèn khoá '+v+' vào BST. Nút mới sẽ trở thành:',(v<pn.v?'con trái của ':'con phải của ')+pn.v,w,'Đi từ gốc '+pp.map(dv).join(' → ')+'; đến '+pn.v+' thì '+v+(v<pn.v?' nhỏ hơn nên đặt bên trái.':' lớn hơn nên đặt bên phải.'),{hint:'So sánh '+v+' với từng nút từ gốc: nhỏ hơn đi trái, lớn hơn đi phải, dừng ở chỗ trống.',run:()=>show(pp,'Đường chèn '+v)})}],
 ['vd',3,()=>{if(bad(root))return null;const have=new Set(vl());let v;for(let i=0;i<40&&(!v||have.has(v));i++)v=1+(Math.random()*45|0);if(have.has(v))return null;const t=insB(clone(root),v),k=rn(['pre','post','lvl']),a=sv(t,k);return Qm('vd',3,'Chèn khoá '+v+' vào BST rồi duyệt '+NAM[k]+'. Kết quả là:',jn(a),[...dist(a),jn(sv(root,k))],'Chèn '+v+' theo quy tắc BST rồi duyệt '+NAM[k]+': '+jn(a)+'.',{hint:'Xác định vị trí chèn trước (nhỏ hơn đi trái, lớn hơn đi phải), sau đó mới duyệt: '+RU[k]+'.'})}],
 ['vd',3,()=>{if(bad(root)||ND().length<4)return null;const x=rn(ND()).n,t=delB(clone(root),x.v),k=rn(['pre','post','lvl']),a=sv(t,k),c=x.l&&x.r?'có 2 con: thay bằng khoá nhỏ nhất của cây con phải':!x.l&&!x.r?'là lá: xóa trực tiếp':'có 1 con: con của nó đi lên thế chỗ';return Qm('vd',3,'Xóa nút '+x.v+' khỏi BST rồi duyệt '+NAM[k]+'. Kết quả là:',jn(a),[...dist(a),jn(sv(root,k).filter(v=>v!=x.v))],'Nút '+x.v+' '+c+'. Duyệt '+NAM[k]+': '+jn(a)+'.',{hint:'Xét nút cần xóa là lá, có 1 con hay 2 con để chọn cách xóa, rồi duyệt: '+RU[k]+'.',hl:[x.id]})}],
 ['vd',3,()=>{const a=vl();if(new Set(a).size!=a.length||a.length>9)return null;const pr=sv(root,'pre'),io=sv(root,'in'),po=sv(root,'post');return Qm('vd',3,'Một cây nhị phân có Preorder: '+jn(pr)+' và Inorder: '+jn(io)+'. Kết quả Postorder là:',jn(po),[...dist(po),jn(sv(root,'lvl')),jn([...po].reverse())],'Gốc là '+pr[0]+' (đầu Preorder); chia Inorder thành cây con trái và phải rồi lặp lại → Postorder: '+jn(po)+'.',{hint:'Phần tử đầu của Preorder là gốc; dùng nó chia Inorder thành cây con trái và cây con phải.',run:()=>setSteps(tSteps('post'),'post')})}],
 ['dut',1,()=>{const k=kk(),a=sq(root,k);if(a.length<4)return null;const i=Math.random()*a.length|0,v=a.map(n=>n.v);if(v.filter(x=>x==v[i]).length>1)return null;return{k:'fill',tp:'dk',lv:1,t:'Hoàn thành kết quả '+NAM[k]+' (điền khoá ở dấu ?):<br><b>'+v.map((x,j)=>j==i?'?':x).join(' ')+'</b>',ans:v[i],why:NAM[k]+' đầy đủ: '+jn(v)+'.',hint:NAM[k]+': '+RU[k]+'. Hãy tự duyệt cây để tìm nút ở vị trí thứ '+(i+1)+'.',sid:a.slice(0,i).map(n=>n.id),run:runK(k,a.map(n=>n.id))}}],
 ['dut',2,()=>{const k=kk(),a=sq(root,k).slice(0,6);if(a.length<4)return null;return{k:'ord',tp:'sx',lv:2,t:'Chạm các nút theo đúng thứ tự '+NAM[k]+(a.length<ND().length?' <small>(chỉ '+a.length+' nút đầu tiên)</small>':'')+':',items:sh(a.map(n=>({id:n.id,v:n.v}))),ans:a.map(n=>n.id),got:[],why:NAM[k]+': '+jn(a.map(n=>n.v))+'.',hint:NAM[k]+': '+RU[k]+'.',run:runK(k,a.map(n=>n.id))}}]
];
// ---- câu Tự luận tự chấm: học sinh tự trả lời rồi so với đáp án mẫu ----
G2.push(
 ['cau',1,()=>{const e=rn(ND()),n=e.n,p=e.p&&e.p.n;return{k:'self',tp:'cau',lv:1,t:'Tự luận: Hãy mô tả vị trí của nút <b>'+n.v+'</b> trên cây (loại nút, nút cha, các nút con, mức).',model:'Nút '+n.v+' là '+(n===root?'nút gốc':!n.l&&!n.r?'nút lá':'nút nhánh')+'; nút cha: '+(p?p.v:'không có (là gốc)')+'; con trái: '+(n.l?n.l.v:'không có')+'; con phải: '+(n.r?n.r.v:'không có')+'; ở mức '+e.d+'.',why:'',hint:'',hl:[n.id],run:()=>show([n.id],'Nút '+n.v)}},1],
 ['dut',2,()=>{const k=kk(),a=sq(root,k);return{k:'self',tp:'dut',lv:2,t:'Tự luận: Nêu quy tắc duyệt <b>'+NAM[k]+'</b> rồi viết kết quả duyệt của cây này.',model:NAM[k]+': '+RU[k]+'. Kết quả: '+jn(a.map(n=>n.v))+'.',why:'',hint:'',run:runK(k,a.map(n=>n.id))}},1],
 ['pt',2,()=>{const l=ND(),n=l.length,h=Math.max(...l.map(e=>e.d)),lf=l.filter(e=>!e.n.l&&!e.n.r);return{k:'self',tp:'pt',lv:2,t:'Tự luận: Hãy cho biết số nút, chiều cao và số nút lá của cây.',model:'Số nút: '+n+'; chiều cao: '+h+' (gốc ở mức 0); số nút lá: '+lf.length+' ('+lf.map(e=>e.n.v).join(', ')+').',why:'',hint:HT.pt,run:()=>show(lf.map(e=>e.n.id),'Các nút lá')}},1],
 ['vd',3,()=>{if(bad(root))return null;const have=new Set(vl());let v;for(let i=0;i<40&&(!v||have.has(v));i++)v=1+(Math.random()*45|0);if(have.has(v))return null;let c=root,pn,pp=[];while(c){pp.push(c);pn=c;c=v<c.v?c.l:c.r}return{k:'self',tp:'vd',lv:3,t:'Tự luận: Trình bày các bước chèn khoá <b>'+v+'</b> vào cây BST này.',model:'So sánh '+v+' lần lượt với '+pp.map(x=>x.v).join(' → ')+'; tới '+pn.v+' thì '+v+(v<pn.v?' nhỏ hơn nên đặt làm con trái.':' lớn hơn nên đặt làm con phải.'),why:'',hint:'Nhỏ hơn đi trái, lớn hơn đi phải, dừng ở chỗ trống.',run:()=>show(pp.map(x=>x.id),'Đường chèn '+v)}},1],
 // câu Sắp xếp thứ tự cho chủ đề cấu trúc / phân tích cây
 ['cau',1,()=>{const e=rn(ND().filter(x=>x.d>=2&&x.d<=6));let ids,t,w;
   if(e){ids=pathTo(e.n);t='Chạm các nút trên đường đi từ <b>gốc</b> xuống nút <b>'+e.n.v+'</b>, theo đúng thứ tự:';w='Đường đi từ gốc xuống nút '+e.n.v+': '+ids.map(dv).join(' → ')+'.'}
   else{ids=sq(root,'lvl').slice(0,6).map(n=>n.id);t='Chạm các nút theo thứ tự từ trên xuống, mỗi mức đi từ trái sang phải:';w='Thứ tự theo mức: '+ids.map(dv).join(' → ')+'.'}
   return{k:'ord',tp:'cau',lv:1,t,items:sh(ids.map(id=>({id,v:dv(id)}))),ans:ids,got:[],why:w,hint:'Mỗi nút là con của nút đứng ngay trước nó; đi từ nút gốc (mức 0) xuống dần.',run:()=>show(ids,'Thứ tự đúng')}}],
 ['pt',2,()=>{const ids=sq(root,'lvl').slice(0,6).map(n=>n.id),wl=wk().m;return{k:'ord',tp:'pt',lv:2,t:'Sắp xếp các nút theo <b>mức tăng dần</b> (mức 0 trước, cùng mức thì từ trái sang phải):',items:sh(ids.map(id=>({id,v:dv(id)}))),ans:ids,got:[],why:'Theo mức: '+ids.map(id=>dv(id)+' (mức '+wl[id].d+')').join(', ')+'.',hint:HT.pt,run:()=>show(ids,'Theo mức')}}]
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
function qTimer(){clearInterval(QX.tm);if(!QX.timed||!Q||Q.msg)return;Q.tl=({1:30000,2:25000,3:20000,0:25000})[QX.cfg.lv]||25000;Q.tt0=Date.now();
  QX.tm=setInterval(()=>{const q=Q;if(!QX.on||!q||q.msg||q.st=='done'){clearInterval(QX.tm);return}
    const left=q.tl-(Date.now()-q.tt0),b=$('#qtm');if(b)b.style.width=Math.max(0,left/q.tl*100)+'%';
    if(left<=0){clearInterval(QX.tm);q.tries=2;q.res=0;q.st='done';q.pts=0;qFin();toast('⏱ Hết giờ!');drawQ();q.run&&q.run()}},200)}
function newQ(){const c=QX.cfg;if(!root||wk().list.length<3){Q={msg:'Cây cần ≥ 3 nút để làm câu hỏi.'};return}
  const tps=c.tps&&c.tps.length?c.tps:TOP.map(t=>t[0]),tys=c.tys&&c.tys.length?c.tys:TYP.map(t=>t[0]);
  for(let i=0;i<120;i++){const t=rn(tps),y=rn(tys);
    let P=G2.filter(g=>g[0]==t&&(y=='essay'||!g[3])&&(i>=40||g[1]<=(c.lv||3)));if(!P.length)P=G2.filter(g=>g[0]==t&&(y=='essay'||!g[3]));
    let q=null;try{q=adapt(rn(P)[2](),y)}catch(e){}if(!q)continue;q.tp=t;
    const sg=q.t+'|'+(q.o?q.o[q.a]:q.ans||q.model);if(i<90&&QX.recent.includes(sg))continue;QX.recent.push(sg);if(QX.recent.length>60)QX.recent.shift();
    Object.assign(q,{st:'ask',tries:0,sig:H.sig(),t0:Date.now(),got:q.got&&[],wr:[]});Q=q;qTimer();return}
  Q={msg:'Chưa tạo được câu hỏi phù hợp, hãy chọn thêm chủ đề / dạng câu hỏi hoặc đổi cây.'}}
function drawQ(){const q=Q,c=QX.cfg;if(q.msg){modal(qTitle(),'<p>'+q.msg+'</p>',null,'',()=>endQ(),'Đóng',1);return}
  const ask=q.st=='ask',dn=q.st=='done',last=QX.i+1>=c.cnt;
  let b='<div class="qbar"><i style="width:'+Math.round(QX.i/c.cnt*100)+'%"></i></div>';
  if(QX.timed&&!dn&&q.tl)b+='<div class="qbar"><i id="qtm" style="transition:none;background:linear-gradient(90deg,#ff922b,#fa5252);width:'+Math.max(0,100-(Date.now()-q.tt0)/q.tl*100)+'%"></i></div>';
  b+='<p class="qt"><b>'+q.t+'</b></p>';
  if(q.k=='mc')b+=q.o.map((o,i)=>'<button class="bt '+(dn?(i==q.a?'ok':i==q.pick?'bad':''):q.wr.includes(i)?'bad':'')+'" data-x="a'+i+'"'+(!ask||q.wr.includes(i)?' disabled':'')+'>'+esc(o)+'</button>').join('');
  else if(q.k=='fill'){const nm=NUM.test(String(q.ans));b+='<input id="qf" type="'+(nm?'number':'text')+'" '+(nm?'step="any" inputmode="decimal" placeholder="Nhập khoá còn thiếu"':'placeholder="Viết kết quả, cách nhau bởi dấu cách"')+(ask?'':' disabled')+'><button class="bt or" data-x="qc"'+(ask?'':' disabled')+'>Kiểm tra</button>'}
  else if(q.k=='self')b+=ask?'<small>Hãy tự trả lời (viết ra giấy hoặc nói thành lời), sau đó bấm xem đáp án mẫu để tự chấm.</small><button class="bt or" data-x="sv">👁 Xem đáp án mẫu</button>':q.st=='rev'?'<p>📖 <b>Đáp án mẫu:</b> '+esc(q.model)+'</p><button class="bt ok" data-x="sy">✅ Mình làm đúng</button><button class="bt bad" data-x="sn">❌ Chưa đúng</button>':'';
  else b+='<div>'+q.items.map((it,i)=>'<button class="bt qchip'+(q.got.includes(it.id)?' on':'')+'" data-x="o'+i+'"'+(ask?'':' disabled')+'>'+esc(it.v)+'</button>').join('')+'</div><small>Đã chọn: '+(q.got.map(id=>q.items.find(x=>x.id==id).v).join(' → ')||'—')+'</small>';
  if(q.st=='hint')b+='<p class="qh">❌ '+esc(q.fb)+'</p><p>💡 '+esc(q.hint)+'</p><button class="bt or" data-x="qt">↻ Thử lại'+(q.k=='ord'?' từ bước sai':'')+'</button><button class="bt" data-x="qs">👁 Xem đáp án</button>';
  if(dn)b+='<p class="'+(q.res?'qok':'qno')+'">'+(q.res?'✅ Chính xác!':'❌ Chưa đúng — đáp án đã hiện.')+' <small>+'+q.pts+' điểm</small></p><p>'+esc(q.k=='self'?q.model:q.why)+'</p><button class="bt or" data-x="nq">'+(last?'Xem kết quả ▶':'Câu tiếp ▶')+'</button>';
  if(ask)b+='<div class="qtl"><button data-x="qsw">🔄 Đổi câu</button>'+(c.src=='rnd'?'<button data-x="qtree">🌳 Cây mới</button>':'')+(q.k=='ord'&&q.got.length?'<button data-x="qr">↺ Chọn lại</button>':'')+'</div>';
  modal(qTitle()+' · ⭐ '+QX.score,b,null,'',()=>endQ(),'Kết thúc',1)}
function qFin(){const q=Q,t=QX.tp[q.tp]=QX.tp[q.tp]||[0,0];t[1]++;if(q.res){t[0]++;QX.ok++}QX.n++;QX.sec+=(Date.now()-q.t0)/1000;QX.score+=q.pts}
function qAns(ok,fb){const q=Q;if(ok){const sec=(Date.now()-q.t0)/1000;q.res=1;q.st='done';q.pts=Math.round(((q.tries?50:100+Math.max(0,Math.round(30-sec))))*({1:1,2:1.5,3:2,0:1.5}[QX.cfg.lv]||1));beep(660)}
  else{q.tries++;beep(200);rescue();if(q.tries>=2){q.res=0;q.st='done';q.pts=0}else{q.st='hint';q.fb=fb}}
  if(q.st=='done'){qFin();drawQ();q.run&&q.run()}else{if(q.hids&&q.hids.length)show(q.hids,q.hn||'Nút liên quan');drawQ()}}
for(let i=0;i<4;i++)X['a'+i]=()=>{const q=Q;if(!q||q.st!='ask'||q.k!='mc')return;q.pick=i;q.hids=q.hl;q.hn='Nút liên quan';if(i==q.a)return qAns(1);q.wr.push(i);let fb='Đáp án chưa đúng.';if(q.sid){const d=fd(q.o[i].split(' '),q.o[q.a].split(' '));fb=d?'Bạn đúng đến bước '+d+', sai từ bước '+(d+1)+'.':'Dãy sai ngay từ bước đầu tiên.';q.hids=q.sid.slice(0,d);q.hn='Các nút bạn đã duyệt đúng'}qAns(0,fb)};
X.qc=()=>{const q=Q;if(!q||q.st!='ask'||q.k!='fill')return;const v=$('#qf').value.trim();if(v==='')return toast('Hãy nhập câu trả lời');q.hids=q.sid;q.hn='Các nút đứng trước chỗ trống';qAns(nz(v)==nz(q.ans),'Câu trả lời bạn nhập chưa đúng.')};
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
function qWatch(){if(!QX||!QX.on||!Q||Q.msg||Q.st!='ask'||QX.cfg.src!='cur'||Q.sig==H.sig()||QX.lk)return;QX.lk=1;setTimeout(()=>{QX.lk=0;if(QX.on&&Q&&Q.st=='ask'&&Q.sig!=H.sig()){newQ();drawQ();toast('Cây đã thay đổi — câu hỏi được cập nhật')}},0)}
function startQuiz(){const c=QX.cfg;close();if(c.src=='rnd'){QX.bk=QX.bk||{r:clone(root)};setTree(cfgTree(c))}else if(!root||wk().list.length<3)return hint('📝 Cây cần ít nhất 3 nút — hãy quét / nhập cây hoặc chọn "Cây ngẫu nhiên"',0);
  Object.assign(QX,{on:1,i:0,score:0,ok:0,n:0,sec:0,tp:{}});newQ();drawQ()}
const BD=h=>{const q=h.filter(r=>r.n),b=[],ok=r=>r.ok/r.n;if(h.length)b.push('🌱 Tân binh');if(h.length>=5)b.push('📚 Chăm chỉ');if(q.some(r=>r.n>=5&&r.ok==r.n))b.push('💯 Điểm tuyệt đối');if(q.some(r=>r.n>=5&&ok(r)>=.9))b.push('🎯 Xạ thủ (≥90%)');if(q.some(r=>r.n>=5&&r.sec/r.n<=10&&ok(r)>=.7))b.push('⚡ Tia chớp');if(q.some(r=>r.lv==3&&r.n>=5&&ok(r)>=.8))b.push('🏆 Cao thủ cấp 3');if(h.some(r=>r.sc>=1500))b.push('🔥 1500 điểm');if(q.reduce((s,r)=>s+((r.tp||{}).dut||[0])[0],0)>=20)b.push('🧭 Bậc thầy duyệt cây');return b};
function tpStat(h){const tp={};h.filter(r=>r.n).forEach(r=>Object.entries(r.tp||{}).forEach(([k,v])=>{tp[k]=tp[k]||[0,0];tp[k][0]+=v[0];tp[k][1]+=v[1]}));return tp}
const weakOf=tp=>Object.entries(tp).filter(([k,v])=>v[1]>=2&&v[0]/v[1]<.8).sort((a,b)=>a[1][0]/a[1][1]-b[1][0]/b[1][1]).slice(0,3).map(([k,v])=>(TP[k]||k)+' ('+Math.round(v[0]/v[1]*100)+'%)');
function chAbort(){if(CH.on){Object.assign(QX.cfg,CH.cfg0);CH.on=0}}
function endQ(){clearInterval(QX.tm);QX.on=0;clear();if(QX.bk){root=QX.bk.r;QX.bk=null;S.sel=null;S.grow=1}refresh();
  if(!QX.n){chAbort();close();return}
  const c=QX.cfg,n=QX.n,ok=QX.ok,sec=Math.round(QX.sec),acc=Math.round(ok/n*100),before=BD(HS.g()),ch=CH.on;
  HS.add({d:Date.now(),m:'q',lv:c.lv,sc:QX.score,ok,n,sec,tp:QX.tp});const nw=BD(HS.g()).filter(x=>!before.includes(x));
  if(ch)CH.score+=QX.score;
  let rk='';if(c.comp&&!ch){LB.add({nm:c.name,sc:QX.score,lv:c.lv});rk='<p>🏁 Thi đấu: hạng <b>'+(LB.g().findIndex(r=>r.nm==c.name&&r.sc==QX.score)+1||'—')+'</b> trên bảng xếp hạng.</p>'}
  const wk2=weakOf(QX.tp);
  modal('Kết quả · '+qTitle(),'<p style="font-size:24px;margin:0">⭐ '+QX.score+' điểm</p><p>✅ '+ok+'/'+n+' câu đúng ('+acc+'%) · ⏱ '+(sec/n).toFixed(1)+'s/câu</p>'+(nw.length?'<p>🎖 Huy hiệu mới: <b>'+nw.join(' · ')+'</b></p>':'')+rk+(wk2.length?'<p>📌 <b>Nên ôn thêm:</b> '+wk2.join(', ')+'</p>':'<p>👏 Làm tốt, chưa có chủ đề nào yếu!</p>')+(ch?'<button class="bt or" data-x="chn">▶ Chặng tiếp theo</button>':'<button class="bt or" data-x="qagain">🔁 Làm đề mới</button><button class="bt" data-x="hs2">🏅 Thành tích</button>'))}
X.qagain=()=>startQuiz();

// ---- hộp chọn chế độ, thành tích, luật chơi ----
function rdCfg(){if(!$('#cf_s'))return;const c=QX.cfg,ar=q=>[...document.querySelectorAll(q)].map(x=>x.value);c.src=$('#cf_s').value;c.type=$('#cf_t').value;c.lv=+$('#cf_l').value;c.n=Math.max(3,Math.min(15,+$('#cf_n').value||7));c.tps=ar('.cf_tp:checked');c.tys=ar('.cf_ty:checked');c.cnt=+$('#cf_c').value;c.comp=$('#cf_k').checked?1:0;c.name=$('#cf_u').value.trim().slice(0,16)||'Học sinh'}
$('#mbd').addEventListener('change',()=>rdCfg());
function hub(){chAbort();const c=QX.cfg,op=(a,v)=>a.map(([k,t])=>'<option value="'+k+'"'+(k==v?' selected':'')+'>'+t+'</option>').join(''),
  ck=(cl,v,t,on)=>'<label style="margin:6px 0;opacity:1"><input type="checkbox" class="'+cl+'" value="'+v+'"'+(on?' checked':'')+' style="width:auto"> '+t+'</label>',
  bt=(x,t,d,cls)=>'<button class="bt'+(cls?' '+cls:'')+'" data-x="'+x+'">'+t+(d?'<br><small style="opacity:.75;font-weight:400">'+d+'</small>':'')+'</button>',
  hd=t=>'<h4 style="margin:16px 0 4px;letter-spacing:.5px">'+t+'</h4>';
  modal('🎮 Trò chơi & Luyện tập',
  '<label>Nguồn cây</label><select id="cf_s">'+op([['cur','Cây hiện tại (đang quét / chỉnh sửa)'],['rnd','Cây ngẫu nhiên']],c.src)+'</select>'+
  '<label>Loại cây ngẫu nhiên</label><select id="cf_t">'+op([['auto','Tự động theo cấp độ'],['nor','Nhị phân thường'],['bst','Cây tìm kiếm nhị phân (BST)'],['bal','Cây cân bằng'],['left','Cây lệch trái'],['right','Cây lệch phải'],['khuyet','Cây khuyết']],c.type)+'</select>'+
  '<label>Cấp độ</label><select id="cf_l">'+op([[1,'1 – Dễ (5–7 nút)'],[2,'2 – Trung bình (8–12 nút)'],[3,'3 – Khó (cây lệch / khuyết)'],[0,'Tùy chỉnh']],c.lv)+'</select>'+
  '<label>Tùy chỉnh: số nút (3–15)</label><input id="cf_n" type="number" min="3" max="15" value="'+c.n+'">'+
  '<label>Số câu (Luyện tập / Thử thách thời gian)</label><select id="cf_c">'+op([[5,'5 câu'],[10,'10 câu'],[15,'15 câu'],[20,'20 câu']],c.cnt)+'</select>'+
  '<label><input type="checkbox" id="cf_k"'+(c.comp?' checked':'')+' style="width:auto"> Chế độ thi đấu (lưu bảng xếp hạng)</label><input id="cf_u" type="text" maxlength="16" placeholder="Tên của bạn" value="'+esc(c.name=='Học sinh'?'':c.name)+'">'+
  '<hr style="opacity:.2">'+
  hd('CHỦ ĐỀ')+'<small>Chọn chủ đề muốn ôn (dùng cho Luyện tập và Thử thách thời gian)</small>'+TOP.map(([k,t])=>ck('cf_tp',k,t,c.tps.includes(k))).join('')+
  hd('DẠNG CÂU HỎI')+'<small>Chọn dạng câu hỏi muốn làm</small>'+TYP.map(([k,t])=>ck('cf_ty',k,t,c.tys.includes(k))).join('')+
  hd('CHẾ ĐỘ CHƠI')+
  bt('mPrac','📖 Luyện tập','Làm bài theo chủ đề và dạng câu hỏi đã chọn, có gợi ý','or')+
  bt('mTime','⏱ Thử thách thời gian','Mỗi câu có đồng hồ đếm ngược','or')+
  bt('mFix','🛠 Sửa cây bị lỗi','Đổi chỗ khoá để cây trở lại là BST')+
  bt('mNext','👣 Đoán nút tiếp theo','Chạm nút được thăm tiếp theo')+
  bt('mHunt','🔍 Truy tìm nút','Săn nút theo đặc điểm, đi tìm khoá')+
  bt('mMix','🏆 Thử thách tổng hợp','Trộn ngẫu nhiên mọi trò, sai 3 lần là thua')+
  hd('TRẢI NGHIỆM TOÀN DIỆN')+
  bt('mAll','🌟 Bắt đầu trải nghiệm toàn diện','4 chặng liên tiếp: Luyện tập (đủ chủ đề, đủ dạng) → Đoán nút → Truy tìm nút → Sửa cây lỗi','or')+
  '<hr style="opacity:.2"><button class="bt" data-x="hs2">🏅 Thành tích & xếp hạng</button><button class="bt" data-x="hr">❓ Luật chơi</button>')}
OP.game=hub;OP.quiz=hub;
const qStart=t=>{rdCfg();if(!QX.cfg.tps.length||!QX.cfg.tys.length)return toast('Hãy chọn ít nhất 1 chủ đề và 1 dạng câu hỏi');QX.timed=t;startQuiz()};
X.mPrac=()=>qStart(0);X.mTime=()=>qStart(1);
X.mFix=()=>gStart(5);X.mNext=()=>gStart(4);X.mHunt=()=>gStart(6);X.mMix=()=>gStart(7);
X.g4=()=>gStart(4);X.g5=()=>gStart(5);X.g6=()=>gStart(6);X.g7=()=>gStart(7);X.hub=()=>hub();
// ---- Trải nghiệm toàn diện: chuỗi các chặng ----
const CHP=[['q'],['g',4,2],['g',6,2],['g',5,1]];
function chNext(){const st=CHP[CH.i++];if(!st)return chEnd();if(st[0]=='q'){QX.timed=0;startQuiz()}else gStart(st[1],st[2])}
function chEnd(){const sc=CH.score,c=CH.cfg0;CH.on=0;Object.assign(QX.cfg,c);QX.timed=0;if(c.comp&&sc>0)LB.add({nm:c.name,sc,lv:c.lv});HS.add({d:Date.now(),m:'all',lv:c.lv,sc,ok:0,n:0,sec:0});
  modal('🌟 Hoàn thành trải nghiệm toàn diện!','<p style="font-size:24px;margin:0">⭐ '+sc+' điểm</p><p>Bạn đã đi hết 4 chặng: Luyện tập, Đoán nút tiếp theo, Truy tìm nút và Sửa cây bị lỗi.</p><button class="bt or" data-x="mAll">🔁 Chơi lại</button><button class="bt" data-x="hub">🎮 Chọn chế độ khác</button>')}
X.chn=()=>{close();chNext()};
X.mAll=()=>{rdCfg();CH={on:1,i:0,score:0,cfg0:Object.assign({},QX.cfg,{tps:[...QX.cfg.tps],tys:[...QX.cfg.tys]})};Object.assign(QX.cfg,{tps:TOP.map(t=>t[0]),tys:TYP.map(t=>t[0]),cnt:5,comp:0});chNext()};
X.hs2=()=>{const h=HS.g(),q=h.filter(r=>r.n),N=q.reduce((s,r)=>s+r.n,0),O=q.reduce((s,r)=>s+r.ok,0),T=q.reduce((s,r)=>s+r.sec,0),tp=tpStat(h),w=weakOf(tp);
  const bars=Object.entries(tp).map(([k,v])=>{const p=Math.round(v[0]/v[1]*100);return '<div style="font-weight:400;margin:4px 0">'+(TP[k]||k)+': '+v[0]+'/'+v[1]+' ('+p+'%)<div class="qbar"><i style="width:'+p+'%"></i></div></div>'}).join('')||'<small>Chưa có dữ liệu.</small>';
  const lb=LB.g().map((r,i)=>'<div style="font-weight:400">'+(i+1)+'. <b>'+esc(r.nm)+'</b> — '+r.sc+' điểm · cấp '+(r.lv||'TC')+'</div>').join('')||'<small>Chưa có ai — bật "Chế độ thi đấu" khi chơi để lên bảng.</small>';
  const last=h.slice(-6).reverse().map(r=>'<div style="font-weight:400">'+new Date(r.d).toLocaleDateString('vi-VN')+' · '+(r.n?'Trắc nghiệm '+r.ok+'/'+r.n+' · ':'Trò chơi · ')+r.sc+' đ</div>').join('')||'<small>—</small>';
  modal('🏅 Thành tích','<p>Số câu: <b>'+N+'</b> · Đúng: <b>'+(N?Math.round(O/N*100):0)+'%</b> · TB: <b>'+(N?(T/N).toFixed(1):0)+'s</b>/câu · Lượt chơi: <b>'+h.length+'</b></p><h4>Huy hiệu</h4><p>'+(BD(h).join(' · ')||'Chưa có — hãy chơi một lượt!')+'</p><h4>Theo chủ đề</h4>'+bars+(w.length?'<p>📌 <b>Nên ôn:</b> '+w.join(', ')+'</p>':'')+'<h4>Bảng xếp hạng (máy này)</h4>'+lb+'<h4>Lịch sử gần đây</h4>'+last+'<button class="bt" data-x="hclr">🗑 Xóa dữ liệu</button>',null,'',hub,'← Quay lại')};
X.hclr=()=>sure('Xóa dữ liệu','Xóa toàn bộ lịch sử chơi, huy hiệu và bảng xếp hạng trên máy này?',()=>{try{['arbt_hist','arbt_lb'].forEach(k=>localStorage.removeItem(k))}catch(e){}},'Xóa');
X.hr=()=>modal('❓ Luật chơi','<p><b>CHỦ ĐỀ</b> và <b>DẠNG CÂU HỎI</b> dùng cho 📖 Luyện tập và ⏱ Thử thách thời gian. Câu hỏi sinh từ chính cây đang hiển thị. Sai lần 1: có gợi ý và nút liên quan được tô sáng, được thử lại; sai lần 2: hiện đáp án và lời giải.</p><p><b>Dạng câu hỏi:</b> Trắc nghiệm (chọn đáp án) · Đúng / Sai · Điền khuyết (điền số còn thiếu) · Sắp xếp thứ tự (chạm các nút đúng thứ tự) · Tự luận (nhập đáp án hoặc tự trả lời rồi so với đáp án mẫu để tự chấm).</p><p><b>⭐ Điểm:</b> đúng ngay 100 (+ thưởng tốc độ tới 30), đúng sau gợi ý 50; nhân hệ số cấp độ ×1 / ×1,5 / ×2.</p><p><b>⏱ Thử thách thời gian:</b> mỗi câu có đồng hồ (30s / 25s / 20s theo cấp độ), hết giờ tính là sai.</p><p><b>🛠 Sửa cây bị lỗi:</b> một số khoá bị đổi chỗ nên cây không còn là BST. Chạm 2 nút để đổi chỗ khoá cho đến khi cây hợp lệ.</p><p><b>👣 Đoán nút tiếp theo:</b> cây đã duyệt một phần; chạm nút được thăm tiếp theo. Sai 3 lần là thua.</p><p><b>🔍 Truy tìm nút:</b> khi thì săn tất cả nút theo đặc điểm, khi thì đi từ gốc tới nút có khoá cho trước.</p><p><b>🏆 Thử thách tổng hợp:</b> mỗi màn là một trò ngẫu nhiên (duyệt đúng thứ tự, săn nút, đi tìm khoá, đoán nút, sửa cây lỗi).</p><p><b>🌟 Trải nghiệm toàn diện:</b> đi lần lượt 4 chặng, điểm được cộng dồn.</p><p><b>Phím tắt:</b> Ctrl+Z hoàn tác, Ctrl+Y làm lại (ngoài lúc chơi).</p>',null,'',hub,'← Quay lại');

// ---- trò chơi mới: đoán nút tiếp theo (m=4), sửa cây lỗi (m=5) ----
function gRestore(){if(GM.bak){root=GM.bak.r;GM.bak=null;S.sel=null;S.grow=1}}
function gExp(id){const k=GM.k4,cur=byId(GM.T[GM.pos-1]),nx=byId(GM.T[GM.pos]);if(!cur||!nx)return 'Chưa đúng.';const rel=nx===cur.l?'con trái của nó':nx===cur.r?'con phải của nó':'một nút khác theo thứ tự này';return '❌ '+NAM[k]+': '+RU[k]+'. Sau nút '+cur.v+' phải đến '+rel+', không phải nút '+disp(byId(id))+'.'}
function fShow(ids){S.steps=ids.length?[{t:'trav',cur:ids[ids.length-1],out:ids,note:''}]:[];S.i=ids.length?0:-1;S.ck=null;refresh()}
function fStats(){$('#gS').textContent='⭐ '+GM.score+' · 🔁 '+GM.mv+' lần đổi · '+('❤'.repeat(GM.lives)||'💔')}
function fRound(){const n=5+Math.min(4,GM.lv)+(Math.random()*2|0),t=genTree('bst',n),l=[],sw=1+(GM.lv>=2?1:0);(function f(x){if(x){f(x.l);l.push(x);f(x.r)}})(t);
  for(let i=0;i<sw;i++){const a=rn(l),b=rn(l.filter(x=>x!==a));[a.v,b.v]=[b.v,a.v]}
  setTree(t);Object.assign(GM,{T:[],need:'fix',hit:new Set(),pos:0,pick:null,mv:0,sw,tl:Math.max(20000,(sw*20000+10000)*Math.pow(.95,GM.lv)),t0:Date.now()});
  $('#gm').innerHTML='<div>🎮 <b>Sửa cây lỗi</b> · màn '+(GM.lv+1)+'<span id="gS" style="float:right"></span></div><div style="margin:6px 0">Cây này đã bị đổi chỗ khoá của '+sw+' cặp nút nên không còn là BST. Chạm <b>2 nút</b> để đổi chỗ khoá cho đến khi hợp lệ (trái &lt; nút &lt; phải).</div><div id="gP"></div><div class="bar"><i id="gB"></i></div><div style="display:flex;gap:8px;justify-content:flex-end"><button data-g="skip">Bỏ qua (−1 ❤)</button><button data-g="quit">Thoát</button></div>';
  fStats();GM.tm=setInterval(gTick,100)}
function fTap(id){if(GM.pick==null){GM.pick=id;beep(520);return fShow([id])}
  if(GM.pick==id){GM.pick=null;return fShow([])}
  const a=byId(GM.pick),b=byId(id);[a.v,b.v]=[b.v,a.v];GM.mv++;GM.pick=null;beep(440);const bn=bad(root);fShow([a.id,b.id]);
  if(!bn){clearInterval(GM.tm);const left=Math.max(0,GM.tl-(Date.now()-GM.t0)),g=Math.max(10,60+Math.round(left/250)-20*Math.max(0,GM.mv-GM.sw));GM.score+=g;GM.lv++;fStats();toast('✔ Cây đã hợp lệ! +'+g);return setTimeout(gNext,900)}
  fStats();toast('Chưa hợp lệ: nút '+bn.v+' vẫn vi phạm quy tắc BST')}


// ================= TRÒ CHƠI TƯƠNG TÁC =================
const GM={on:0,best:0,m:0};try{GM.best=+localStorage.getItem('arbt_best')||0}catch(e){}
X.i1=()=>{close();OP.str()};X.i2=()=>{close();OP.vals()};X.tour=()=>{close();TR.off=0;TR.i=0;try{localStorage.removeItem('arbt_tour')}catch(e){}ui()};X.adDel=()=>{close();OP.del()};X.gq=()=>{close();OP.quiz()};
X.g1=()=>gStart(1);X.g2=()=>gStart(2);X.g3=()=>gStart(3);
function gStart(m,cap){rdCfg();close();if(m==5||m==7){if(!GM.bak)GM.bak={r:clone(root)};if(m==7&&QX.cfg.src=='rnd')setTree(cfgTree(QX.cfg))}else if(QX.cfg.src=='rnd'){if(!GM.bak)GM.bak={r:clone(root)};setTree(cfgTree(QX.cfg))}if(m!=5&&wk().list.length<3){gRestore();return hint('🎮 Cây cần ít nhất 3 nút — hãy chèn thêm hoặc nhập cây rồi chơi',0)}clear();Object.assign(GM,{on:1,m,cap:cap||0,lives:3,score:0,combo:0,lv:0,pick:null,mv:0});document.body.classList.add('game');S.sel=null;gRound()}
const gNext=()=>{if(!GM.on)return;if(GM.cap&&GM.lv>=GM.cap)gEnd('🏁 Hoàn thành chặng!');else gRound()};
function gRound(){clearInterval(GM.tm);const m=GM.m==6?rn([2,3]):GM.m==7?rn([1,2,3,4,5]):GM.m;GM.sub=m;if(m==5)return fRound();const a=wk().list;if(a.length<3)return gEnd('Cây cần ≥ 3 nút');
  let T,need='order',txt;
  if(m==1){const k=rn(['pre','in','post','rin']);T=seqIds(k);txt='Chạm các nút theo thứ tự <b>'+TNm[k]+'</b>'}
  else if(m==4){const k=rn(['pre','in','post']);T=seqIds(k);GM.k4=k;GM.pre=Math.min(T.length-1,1+(Math.random()*Math.max(1,T.length-2)|0));txt='Đang duyệt <b>'+NAM[k]+'</b> — chạm nút được thăm <b>tiếp theo</b>'}
  else if(m==2){const mx=Math.max(...a.map(e=>e.d)),Lv=1+(Math.random()*mx|0),PR=[['nút lá',e=>!e.n.l&&!e.n.r],['nút nhánh (có ít nhất 1 con)',e=>e.n.l||e.n.r],['nút có đủ 2 con',e=>e.n.l&&e.n.r],['nút ở mức '+Lv,e=>e.d==Lv]];
    for(let t=0;t<12;t++){const p=rn(PR),ids=a.filter(p[1]).map(e=>e.n.id);if(ids.length>=1&&ids.length<a.length){T=ids;txt='Chạm <b>tất cả '+p[0]+'</b> (thứ tự tùy ý)';need='set';break}}
    if(!T){T=seqIds('pre');txt='Chạm các nút theo <b>duyệt trước</b>';need='order'}}
  else{let x;for(let t=0;t<12;t++){const n0=rn(a).n;T=pathTo(n0);x=n0.v;if(T.length>=2)break}txt='Đi từ gốc xuống nút có khoá <b>'+esc(x)+'</b>, chạm từng nút trên đường đi'}
  Object.assign(GM,{T,need,txt,pos:0,hit:new Set(),tl:Math.max(7000,(T.length*2300+3500)*Math.pow(.93,GM.lv)),t0:Date.now()});
  if(m==4){GM.pos=GM.pre;GM.hit=new Set(T.slice(0,GM.pre))}
  clear();refresh();
  $('#gm').innerHTML=`<div>🎮 <b>${['','Duyệt đúng thứ tự','Săn nút','Đi tìm khoá','Đoán nút tiếp theo','Sửa cây lỗi'][m]}</b> · màn ${GM.lv+1}<span id="gS" style="float:right"></span></div><div style="margin:6px 0">${txt}</div><div id="gP"></div><div class="bar"><i id="gB"></i></div><div style="display:flex;gap:8px;justify-content:flex-end"><button data-g="skip">Bỏ qua (−1 ❤)</button><button data-g="quit">Thoát</button></div>`;
  gStats();if(m==4)gShow();GM.tm=setInterval(gTick,100)}
function gStats(){$('#gS').textContent=`⭐ ${GM.score} · 🔥 ${GM.combo} · ${'❤'.repeat(GM.lives)||'💔'}`;$('#gP').textContent=(GM.need=='order'?GM.pos:GM.hit.size)+' / '+GM.T.length}
function gShow(bad){const h=[...GM.hit];S.steps=bad?[{t:'path',cur:bad,out:[bad],res:'no',note:''}]:[{t:'trav',cur:h[h.length-1],out:h,note:''}];S.i=0;S.ck=null;sync()}
function gTick(){const left=GM.tl-(Date.now()-GM.t0);$('#gB').style.width=Math.max(0,left/GM.tl*100)+'%';if(left<=0)gLose('⏱ Hết giờ!')}
function gLose(msg){GM.lives--;GM.combo=0;beep(180);toast(msg);if(GM.lives<=0)return gEnd();gRound()}
function gTap(id){if(!GM.on)return;if(GM.need=='fix')return fTap(id);
  if(GM.need=='order'){if(id==GM.T[GM.pos]){GM.hit.add(id);GM.pos++}else return gBad(id)}
  else{if(GM.hit.has(id))return;if(GM.T.includes(id))GM.hit.add(id);else return gBad(id)}
  GM.combo++;GM.score+=10*Math.min(GM.combo,5);beep(500+GM.combo*40);gShow();gStats();
  if((GM.need=='order'?GM.pos:GM.hit.size)>=GM.T.length){clearInterval(GM.tm);const left=Math.max(0,GM.tl-(Date.now()-GM.t0));GM.score+=50+Math.round(left/200);GM.lv++;gStats();toast('✔ Qua màn! +'+(50+Math.round(left/200)));setTimeout(gNext,700)}}
function gBad(id){GM.lives--;GM.combo=0;beep(180);rescue();gShow(id);gStats();if(GM.sub==4)toast(gExp(id));if(GM.lives<=0)gEnd();else setTimeout(()=>GM.on&&gShow(),450)}
function rescue(){if(navigator.vibrate)try{navigator.vibrate(80)}catch(e){}}
function gEnd(msg){clearInterval(GM.tm);const sc=GM.score,nb=sc>GM.best;if(nb){GM.best=sc;try{localStorage.setItem('arbt_best',sc)}catch(e){}}
  const was=GM.m,ch=CH.on;if(ch)CH.score+=sc;GM.on=0;gRestore();HS.add({d:Date.now(),m:'g'+was,lv:0,sc:sc,ok:0,n:0,sec:0});if(!ch&&QX.cfg.comp&&sc>0)LB.add({nm:QX.cfg.name,sc:sc,lv:0});document.body.classList.remove('game');clear();refresh();
  modal(msg||'Hết lượt!','<p style="font-size:22px;margin:0">⭐ '+sc+' điểm</p><p>'+(nb?'🏆 Kỷ lục mới!':'Kỷ lục: '+GM.best)+'</p>'+(ch?'<button class="bt or" data-x="chn">'+(CH.i<CHP.length?'▶ Chặng tiếp theo':'🏁 Xem kết quả')+'</button>':'<button class="bt or" data-x="g'+(was||1)+'">🔁 Chơi lại</button><button class="bt" data-x="hub">🎮 Chọn chế độ khác</button>'))}
$('#gm').addEventListener('click',e=>{const b=e.target.closest('[data-g]');if(!b)return;if(b.dataset.g=='quit')gEnd('Đã thoát');else if(GM.on)gLose('Bỏ qua')});

