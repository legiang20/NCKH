let THREE,lockFn=null,rescanFn=null,isLocked=false,sync=()=>{},scanId=0;
const $=s=>document.querySelector(s);
// ---- Giao diện sáng / tối (mặc định tối, lưu lại lựa chọn) ----
const TH={m:'dark'};try{TH.m=localStorage.getItem('arbt_theme')=='light'?'light':'dark'}catch(e){}
function applyTheme(){document.documentElement.dataset.theme=TH.m;const a=$('#ar');if(a&&!a.querySelector('video'))a.style.background=TH.m=='dark'?'radial-gradient(circle at 30% 20%,#1b3550,#0b1118 75%)':'radial-gradient(circle at 30% 20%,#ffffff,#d6e6ff 75%)'}
applyTheme();
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(t.h);t.h=setTimeout(()=>t.style.display='none',2800)};
const stt=m=>$('#stt').textContent=m,load=m=>{const l=$('#load');l.style.display=m?'block':'none';l.innerHTML=m};
let AX;const beep=(f=520)=>{if(!S.snd)return;try{AX=AX||new AudioContext();const o=AX.createOscillator(),g=AX.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(AX.destination);o.start();o.stop(AX.currentTime+.09)}catch(e){}};
const EM='Cây đang rỗng — hãy quét giấy hoặc dùng ⌨ Nhập / Khởi tạo cây';
const hint=(m,f)=>{toast(m);if(f)S.flash=Date.now()+3000};
const rn=a=>a[Math.random()*a.length|0],sh=a=>[...a].sort(()=>Math.random()-.5);

// ================= DỮ LIỆU CÂY (chính là cây vừa quét) =================
let nid=1,root=null;
const mk=(v,o)=>Object.assign({v},o,{id:nid++,l:null,r:null});
const MODES={kham:{n:'Khám phá',ops:'ad undo redo search upd inp img lay ana'},duyet:{n:'Duyệt cây',ops:'search img lay'},choi:{n:'Trò chơi',ops:'game'}};
let TR={off:0,i:0};try{TR.off=localStorage.getItem('arbt_tour')=='1'?1:0}catch(e){}
const S={mode:'kham',notes:true,view:'tree',sel:null,kind:'pre',steps:[],i:-1,run:0,tm:0,speed:1,bright:1,size:1,snd:true,orig:null,yaw:0,pitch:0,zoom:1,grow:0,spin:null,px:0,py:0,roll:0,mv:'orbit',dm:'rot',showCode:true,lang:'gia',ck:null};
const kf=()=>'v';
const cmp=(a,b)=>typeof a=='string'?a.localeCompare(b,'vi'):a-b;
const disp=n=>!n?'':n.v;
const trunc=s=>{s=String(s);return s.length>9?s.slice(0,8)+'…':s};
const inord=(n=root,a=[])=>{if(n){inord(n.l,a);a.push(n);inord(n.r,a)}return a};
const pre=(n=root,a=[])=>{if(n){a.push(n);pre(n.l,a);pre(n.r,a)}return a};
const lvl=()=>{const q=root?[root]:[];for(let k=0;k<q.length;k++){q[k].l&&q.push(q[k].l);q[k].r&&q.push(q[k].r)}return q};
const ht=n=>n?1+Math.max(ht(n.l),ht(n.r)):0;      // ht = số NÚT trên đường dài nhất (dùng nội bộ)
const hE=n=>ht(n)-1;                               // hE = số CẠNH (quy ước hiển thị): lá = 0, chiều cao cây = hE(gốc)
const byId=id=>lvl().find(n=>n.id==id)||null;
const par=n=>lvl().find(p=>p.l===n||p.r===n)||null;
const depth=n=>{let d=0;while((n=par(n)))d++;return d};
const pathTo=n=>{const a=[];for(;n;n=par(n))a.unshift(n.id);return a};   // đường từ gốc xuống nút n
const clone=n=>n&&Object.assign({},n,{l:clone(n.l),r:clone(n.r)});
// ---- Hoàn tác / Làm lại: lưu ảnh chụp cấu trúc cây trước mỗi thao tác làm thay đổi cây ----
const H={u:[],r:[],MAX:60,
 sig:()=>JSON.stringify(pre().map(n=>[n.id,n.v,n.l?n.l.id:0,n.r?n.r.id:0])),
 snap(){return{t:clone(root),g:H.sig()}},
 push(b){if(b.g==H.sig())return;H.u.push(b);if(H.u.length>H.MAX)H.u.shift();H.r=[]},
 load(b){root=clone(b.t);if(!byId(S.sel))S.sel=null;S.grow=0;clear();refresh()},
 undo(){if(!H.u.length)return toast('Không còn thao tác để hoàn tác');H.r.push(H.snap());H.load(H.u.pop());toast('↶ Đã hoàn tác')},
 redo(){if(!H.r.length)return toast('Không còn thao tác để làm lại');H.u.push(H.snap());H.load(H.r.pop());toast('↷ Đã làm lại')},
 ui(){const a=document.querySelector('[data-op=undo]'),b=document.querySelector('[data-op=redo]');if(a)a.disabled=!H.u.length;if(b)b.disabled=!H.r.length}};
document.addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey)||e.altKey)return;const t=e.target,k=e.key.toLowerCase();
 if(t&&(t.tagName=='INPUT'||t.tagName=='TEXTAREA'||t.tagName=='SELECT'||t.isContentEditable))return;
 if($('#mo').style.display=='flex')return;
 if(k=='z'&&!e.shiftKey){e.preventDefault();H.undo()}else if(k=='y'||(k=='z'&&e.shiftKey)){e.preventDefault();H.redo()}});
const treeStr=n=>n?n.v+(n.l||n.r?'('+treeStr(n.l)+','+treeStr(n.r)+')':''):'';
function parseStr(s){let i=0;s=s.replace(/\s+/g,'');const num=()=>{const m=/^(-?\d+|None)/.exec(s.slice(i));if(!m)return null;i+=m[0].length;return m[0]=='None'?'None':+m[0]};
  const nd=()=>{const v=num();if(v===null)return null;const n=mk(v,{});if(s[i]=='('){i++;n.l=nd();if(s[i]==',')i++;n.r=nd();if(s[i]==')')i++}return n};return nd()}
let TL={r:.05,dx:.1,dy:.1};
function adopt(tr,C,M){                            // kết quả nhận diện → cây của web
  const map={},ord=[tr.root];for(let k=0;k<ord.length;k++){const u=ord[k];u.l&&ord.push(u.l);u.r&&ord.push(u.r)}
  ord.forEach((u,k)=>map[u.i]=mk(k+1));const lk=u=>{const n=map[u.i];n.l=u.l?lk(u.l):null;n.r=u.r?lk(u.r):null;return n};
  root=lk(tr.root);
  if(C&&M){const rs=[],dys=[],dxs=[];Object.keys(map).forEach(i=>{const c=C[i];map[i].P0=[(c.x-M.cx)/M.pxS,-(c.y-M.cy)/M.pxS,0];rs.push(c.r/M.pxS)});
    (function z(u){[u.l,u.r].forEach(c=>{if(c){const a=map[u.i].P0,b=map[c.i].P0;dys.push(Math.abs(b[1]-a[1]));dxs.push(Math.abs(b[0]-a[0]));z(c)}})})(tr.root);
    const md=a=>a.sort((x,y)=>x-y)[a.length>>1]||.1;TL={r:md(rs)*.97,dy:Math.max(md(dys),md(rs)*2.4),dx:Math.max(md(dxs),md(rs)*1.4)}}
  S.sel=null;S.view='tree';S.orig=clone(root);clear();refresh();return map}
function afterScan(){                          // sau khi xác nhận số: chốt dữ liệu cây
  const seen=new Set();let fix=0;inord().forEach(n=>{while(seen.has(n.v)){n.v++;fix++}seen.add(n.v)});
  S.orig=clone(root);clear();refresh();
  toast(fix?'⚠ Có số trùng nên đã tự đổi — kiểm tra ở ⌨ Nhập / Khởi tạo cây → 🔢 Nhập / sửa số các nút':'✅ Đã kiểm tra & cố định cây — dùng các công cụ để thao tác')}

// ================= THƯ VIỆN HÌNH CÂY TRONG SÁCH (so khớp hình quét với hình mẫu) =================
// Mỗi mẫu: tên + chuỗi cây v(trái,phải), con trống để trống, None = nút giả. Muốn thêm hình mới: thêm một dòng vào LIB.
// Số trong sách được giữ nguyên, kể cả khi trùng nhau trong cùng một hình (vd Hình 7.5 a, 7.5 c, 7.1 b).
const LIB=[
 {n:'Hình 9.1 · Cây tìm kiếm nhị phân',s:'9(3(1,7(4,8)),15(12(10,14),19))'},
 {n:'Hình 7.5 a) · Các cây nhị phân',s:'6(4(1,5),11(7(5,9),17))'},
 {n:'Hình 7.5 b) · Các cây nhị phân',s:'4(2(1,3),12(7,15))'},
 {n:'Hình 7.5 c) · Các cây nhị phân',s:'4(3(0,3),10(7(,8),14))'},
 {n:'Hình 7.4 a) · Cây tìm kiếm, cây con có chiều cao gần bằng nhau',s:'4(2(1,3),12(7(6,9),15))'},
 {n:'Hình 7.4 b) · Cây tìm kiếm suy biến, chiều cao lớn nhất',s:'10(,12(,15(,20)))'},
 {n:'Hình 7.3 a) · Cây nhị phân hoàn chỉnh',s:'5(3,7)'},
 {n:'Hình 7.3 b) · Cây nhị phân tổng quát',s:'5(3,7(6,))'},
 {n:'Hình 7.3 c) · Hoàn chỉnh với các nút giả None',s:'5(3(None,None),7(6,))'},
 {n:'Hình 7.1 a) · Cây nhị phân',s:'5(2(,4),10(8,11))'},
 {n:'Hình 7.1 b) · Cây nhị phân',s:'8(5(1,4),10(8(,9),11))'},
 {n:'Hình 6.8 a) · Cây nhị phân tổng quát',s:'5(8(,3),4(7,))'},
 {n:'Hình 6.8 b) · Hoàn chỉnh biểu diễn cây tổng quát',s:'5(8(None,3),4(7,))'},
 {n:'Hình 6.6 · Đánh chỉ số cây nhị phân hoàn chỉnh',s:'5(18(4(6,20),11(12,3)),7(9(1,),15))'}];
const LP=s=>{let i=0;s=s.replace(/\s+/g,'');const nd=()=>{const m=/^(-?\d+|None)/.exec(s.slice(i));if(!m)return null;i+=m[0].length;const n={v:m[0],l:null,r:null};if(s[i]=='('){i++;n.l=nd();if(s[i]==',')i++;n.r=nd();if(s[i]==')')i++}return n};return nd()};
const lsz=u=>u?1+lsz(u.l)+lsz(u.r):0;
const lpd=(a,b)=>a&&b?lpd(a.l,b.l)+lpd(a.r,b.r):lsz(a||b);        // số vị trí nút có ở cây này mà thiếu ở cây kia (cùng vị trí trái/phải)
const lvProf=C=>{if(!C||C.length<3)return null;const rs=C.map(c=>c.r).sort((a,b)=>a-b),mr=rs[rs.length>>1],o=[...C].sort((a,b)=>a.y-b.y),p=[];let cur=[o[0]];   // số nút trên từng hàng (gom theo toạ độ y)
  for(let i=1;i<o.length;i++){const m=cur.reduce((u,c)=>u+c.y,0)/cur.length;if(o[i].y-m>1.2*mr){p.push(cur.length);cur=[o[i]]}else cur.push(o[i])}p.push(cur.length);return p};
const lvOf=t=>{const p=[];(function f(u,d){if(!u)return;p[d]=(p[d]||0)+1;f(u.l,d+1);f(u.r,d+1)})(t,0);return p};
const profSim=(a,b)=>{const n=Math.max(a.length,b.length);let df=0;for(let i=0;i<n;i++)df+=Math.abs((a[i]||0)-(b[i]||0));return 1-df/(a.reduce((u,v)=>u+v,0)+b.reduce((u,v)=>u+v,0))};
function libMatch(sr,C){const na=lsz(sr);if(na<3)return[];const pf=lvProf(C);            // sr = cây vừa quét (chỉ cần hình dạng: .l / .r)
  const all=LIB.map(L=>{const t=L.t||(L.t=LP(L.s)),d=lpd(sr,t),s1=1-d/Math.max(na,lsz(t)),s2=pf?profSim(pf,lvOf(t))-.1:0;return{L,d,sim:Math.max(s1,s2)}}).sort((a,b)=>b.sim-a.sim);
  return all.filter(m=>m.sim>=.75&&m.sim>=all[0].sim-.25).slice(0,3)}   // tối đa 3 hình giống nhất
function adoptLib(L,tr,C,M){                                        // dựng cây MẪU, nút nào có trên giấy thì đặt đúng chỗ giấy; nút thiếu tự xếp theo nút cha
  root=parseStr(L.s);const pos={},rs=[],dys=[],dxs=[];
  (function z(u,p){if(!u)return;pos[p]=C[u.i];z(u.l,p+'l');z(u.r,p+'r')})(tr.root,'');
  (function put(n,p){if(!n)return;const c=pos[p];if(c){n.P0=[(c.x-M.cx)/M.pxS,-(c.y-M.cy)/M.pxS,0];rs.push(c.r/M.pxS)}put(n.l,p+'l');put(n.r,p+'r')})(root,'');
  (function z(n){[n.l,n.r].forEach(c=>{if(c){if(n.P0&&c.P0){dys.push(Math.abs(c.P0[1]-n.P0[1]));dxs.push(Math.abs(c.P0[0]-n.P0[0]))}z(c)}})})(root);
  const md=a=>a.sort((x,y)=>x-y)[a.length>>1]||.1;
  TL={r:md(rs)*.97,dy:Math.max(md(dys),md(rs)*2.4),dx:Math.max(md(dxs),md(rs)*1.4)};
  S.sel=null;S.view='tree';S.orig=clone(root);clear();refresh()}