// ================= GIAO DIỆN =================
let MOK=null;
let MXC=null;
function modal(t,h,ok,txt,cancel,ctxt,low){const _d=$('#mxd');if(_d)_d.remove();$('#mo').className=low?'q':'';MXC=cancel||null;$('#mx').textContent=ctxt||'Đóng';$('#mh').textContent=t;$('#mbd').innerHTML=h;$('#mo').style.display='flex';MOK=ok;$('#mok').style.display=ok?'':'none';$('#mok').textContent=txt||'Xác nhận'}
// thanh xác nhận GỌN ở đáy màn hình (không che cây, vẫn kéo/chạm được phía trên)
function bar(h){$('#mo').className='q c';MXC=null;MOK=null;$('#mh').textContent='';$('#mbd').innerHTML=h;$('#mo').style.display='flex';$('#mok').style.display='none'}
const close=()=>{$('#mo').style.display='none';const _d=$('#mxd');if(_d)_d.remove();$('#mo').className='';MOK=null;MXC=null;$('#mx').textContent='Đóng'};
$('#mok').onclick=()=>{const b=H.snap();if(MOK&&MOK()===false)return;H.push(b);close();refresh()};$('#mx').onclick=()=>{const f=MXC;close();if(f)f()};
const X={};$('#mbd').addEventListener('click',e=>{const b=e.target.closest('[data-x]');if(b&&X[b.dataset.x])X[b.dataset.x]()});
$('#mbd').addEventListener('input',e=>{const t=e.target;if(t.id=='sb')S.bright=+t.value;if(t.id=='ss')S.size=+t.value;if(t.id=='sn')S.snd=t.checked;if(t.id=='sg'){S.notes=t.checked;ui()}
  if(t.id=='sth'){TH.m=t.value=='light'?'light':'dark';try{localStorage.setItem('arbt_theme',TH.m)}catch(_){}applyTheme()}sync()});
const F=(id,l,v='',ty='text')=>`<label>${l}</label><input id="${id}" type="${ty}" value="${esc(v)}">`;
const fields=n=>F('f1','Khoá v',n?n.v:'','number');
function recFrom(){const a=$('#f1').value.trim();if(!a||!Number.isFinite(+a)){toast('Khoá phải là số');return null}return{v:+a}}
const sure=(t,msg,fn,txt)=>modal(t,'<p>'+msg+'</p>',()=>{fn()},txt||'Đồng ý',null,'Hủy');   // hộp xác nhận cho thao tác làm mất cây
const OP={
 ad(){OP.add()},
 add(){if(root&&!byId(S.sel))return hint('👆 Chạm chọn một nút trên cây trước (nút cha khi thêm, hoặc nút cần xóa), rồi bấm lại ＋/－',1);
   const sn=byId(S.sel),full=sn&&sn.l&&sn.r,pick=sn&&sn.l&&!sn.r?'r':'l';
   const info=sn?'<div class="adinfo">Nút đang chọn <b>'+esc(sn.v)+'</b></div>':'<div class="adinfo">Cây đang rỗng: nút đầu tiên sẽ là gốc.</div>';
   const side=root?'<label>Thêm làm con của nút '+esc(sn.v)+'</label><select id="f3"><option value="l"'+(sn.l?' disabled':'')+(pick=='l'?' selected':'')+'>Con trái'+(sn.l?' (đã có)':'')+'</option><option value="r"'+(sn.r?' disabled':'')+(pick=='r'?' selected':'')+'>Con phải'+(sn.r?' (đã có)':'')+'</option></select>'+(full?'<small class="adwarn">Nút này đã đủ 2 con, không thể thêm nữa.</small>':(sn.l||sn.r)?'<small class="adnote">Tự chọn '+(sn.l?'con phải':'con trái')+' vì '+(sn.l?'con trái':'con phải')+' đã có.</small>':''):'';
   modal('Thêm / Xóa nút',info+fields()+side,()=>{
   const r=recFrom();if(!r)return false;
   if(!root)root=mk(r.v);else{const p=byId(S.sel);if(!p){toast('Chạm chọn nút cha trước');return false}if(p.l&&p.r){toast('Nút này đã có đủ 2 con');return false}const d=p.l?'r':p.r?'l':$('#f3').value;p[d]=mk(r.v);S.grow=0}clear()},'＋ Thêm');
   if(sn){const x=document.createElement('button');x.id='mxd';x.className='bad';x.dataset.x='adDel';x.textContent='－ Xóa nút '+sn.v;x.onclick=()=>X.adDel();$('#mx').parentNode.insertBefore(x,$('#mx'))}},
 del(){const n=byId(S.sel);if(!n)return hint('👆 Chưa chọn nút: hãy chạm vào nút cần xóa trên cây (các nút đang nhấp nháy), rồi bấm lại Xóa',1);
   const c=!n.l&&!n.r?'Nút lá → xóa trực tiếp.':n.l&&n.r?'Nút có 2 con → nút nhỏ nhất bên cây con phải sẽ trượt lên thế chỗ.':'Nút có 1 con → con của nó trượt lên thế vào vị trí.';
   modal('Xóa nút '+disp(n),'<p>'+c+'</p>',()=>{remove(n);S.sel=null;clear();beep(220)},'Xóa')},
 search(){modal('Tìm kiếm',F('f1','Khoá cần tìm','','number'),()=>{const a=$('#f1').value.trim();if(!a)return false;if(!root){toast(EM);return false}setSteps(sSteps(+a))},'Tìm')},
 upd(){const n=byId(S.sel);if(!n)return hint('👆 Chưa chọn nút: hãy chạm vào nút cần cập nhật trên cây (các nút đang nhấp nháy), rồi bấm lại Cập nhật',1);
   modal('Cập nhật nút',fields(n),()=>{const a=$('#f1').value.trim();if(!a||!Number.isFinite(+a))return false;n.v=+a;S.spin=n.id;clear()},'Lưu')},
 inp(){modal('Nhập / Khởi tạo cây','<p>Nhập tay hoặc dựng lại cây từ dữ liệu đã quét:</p><button class="bt or" data-x="i1">⌨ Nhập cây bằng chuỗi v(trái,phải)</button><button class="bt or" data-x="i2">🔢 Nhập / sửa số các nút</button><hr style="opacity:.2"><button class="bt" data-x="rand">🎲 Cây ngẫu nhiên</button><button class="bt" data-x="deg">📏 Cây suy biến (đường thẳng)</button><button class="bt" data-x="bal">⚖ Cây cân bằng</button><button class="bt" data-x="orig">↩ Khôi phục cây quét ban đầu</button>')},
 str(){modal('Nhập cây bằng chuỗi','<p>⚠ Cây đang hiển thị sẽ bị thay bằng cây mới (có thể khôi phục cây quét ban đầu ở menu Nhập / Khởi tạo).</p>'+F('f1','Dạng v(trái,phải) — ví dụ 1(2(3(5,6),4),) ; để trống con thì bỏ số',treeStr(root)||'1(2(3(5,6),4),)'),()=>{
   const t=parseStr($('#f1').value);if(!t){toast('Chuỗi chưa đúng, ví dụ: 1(2,3)');return false}
   const nn=(function c(n){return n?1+c(n.l)+c(n.r):0})(t);if(nn>31){toast('Tối đa 31 nút');return false}
   root=t;S.sel=null;S.orig=clone(root);S.grow=1;clear()},'Dựng cây')},
 vals(){if(!root)return toast(EM);modal('Nhập số các nút',F('f1','Giá trị theo từng mức, trái → phải ('+lvl().length+' số, cách nhau bởi dấu cách)',lvl().map(n=>n.v).join(' ')),()=>{
   const A=$('#f1').value.split(/[\s,;]+/).filter(Boolean).map(Number),L=lvl();if(A.length!=L.length||A.some(x=>!Number.isFinite(x))){toast('Cần đúng '+L.length+' số');return false}
   L.forEach((n,i)=>n.v=A[i]);S.orig=clone(root);clear()},'Áp dụng')},
 lay(){inord().forEach(n=>delete n.P);Object.assign(S,{px:0,py:0,roll:0,yaw:0,pitch:0,zoom:1,grow:0});clear();refresh();toast('Đã đặt lại vị trí nút và góc nhìn')},
 undo(){H.undo()},redo(){H.redo()},
 quiz(){newQ();drawQ()},
 game(){modal('Chơi game','<p>Chạm vào nút trên cây. Sai 3 lần là thua, qua màn sẽ khó dần.</p><button class="bt or" data-x="g1">🔢 Duyệt đúng thứ tự</button><button class="bt or" data-x="g2">🍃 Săn nút theo đặc điểm</button><button class="bt or" data-x="g3">🔍 Đi tìm khoá</button><button class="bt or" data-x="gq">📝 Trắc nghiệm</button><small>Điểm cao nhất: '+GM.best+'</small>')},
 ana(){if(!root)return toast(EM);const a=inord(),ks=a.map(n=>n.v).filter(v=>typeof v=='number').sort(cmp),n=a.length,h=hE(root),lv=a.filter(x=>!x.l&&!x.r).length,two=a.filter(x=>x.l&&x.r).length,
   full=a.every(x=>!x.l==!x.r),comp=Math.max(...wk().list.map(e=>e.k))==n-1,perf=n==2**(h+1)-1,
   kinds=perf?['hoàn hảo (cũng đầy đủ và hoàn chỉnh)']:[full&&'đầy đủ',comp&&'hoàn chỉnh'].filter(Boolean);
   modal('Thông số cây',`<table><tr><td>Số nút n</td><td>${n}</td></tr><tr><td>Chiều cao cây h</td><td>${h}</td></tr><tr><td>Số mức</td><td>${h+1} (mức 0…${h})</td></tr><tr><td>Số lá</td><td>${lv}</td></tr><tr><td>Số nút nhánh</td><td>${n-lv}</td></tr><tr><td>Nút có đủ 2 con</td><td>${two}</td></tr><tr><td>Giá trị nhỏ nhất</td><td>${esc(ks[0]??'—')}</td></tr><tr><td>Giá trị lớn nhất</td><td>${esc(ks[ks.length-1]??'—')}</td></tr></table><p>Loại: ${kinds.length?kinds.join(', '):'thường'}</p><small>Quy ước: gốc ở mức 0 · lá có chiều cao 0 · chiều cao cây = số cạnh trên đường dài nhất từ gốc xuống lá.</small>`)}};
X.build=k=>{const f=kf(),R=inord().map(n=>{const c=Object.assign({},n,{l:null,r:null});delete c.P;delete c.P0;return c}).sort((p,q)=>cmp(p[f],q[f]));let t=null;
  const ins=r=>{const m=mk(r.v,r);if(!t){t=m;return}let c=t;for(;;){const d=cmp(r[f],c[f])<0?'l':'r';if(!c[d]){c[d]=m;return}c=c[d]}};
  if(k=='bal'){const b=(l,h)=>{if(l>h)return null;const m=(l+h+1)>>1,n=mk(R[m].v,R[m]);n.l=b(l,m-1);n.r=b(m+1,h);return n};t=b(0,R.length-1)}
  else if(k=='deg')R.forEach(ins);else R.sort(()=>Math.random()-.5).forEach(ins);
  root=t;S.grow=1;S.sel=null;clear();close();refresh();toast('Cây mới mọc lên từ mặt bàn')};
const RB=(k,nm)=>()=>sure('Tạo '+nm,'Cây hiện tại sẽ được dựng lại theo dạng này (giá trị các nút giữ nguyên, vị trí kéo tay bị xóa). Muốn quay lại: Nhập / Khởi tạo cây → Khôi phục cây quét ban đầu.',()=>X.build(k),'Tạo');
X.rand=RB('rand','cây ngẫu nhiên');X.deg=RB('deg','cây suy biến');X.bal=RB('bal','cây cân bằng');
X.orig=()=>sure('Khôi phục cây quét ban đầu','Mọi thay đổi (thêm / xóa / sửa nút, vị trí đã kéo) sẽ mất, cây trở về lúc vừa quét.',()=>{if(!S.orig)return;root=clone(S.orig);S.grow=1;S.sel=null;clear();close();refresh()},'Khôi phục');
$('#bSet').onclick=()=>modal('Cài đặt',`<label>Giao diện</label><select id="sth"><option value="dark" ${TH.m=='dark'?'selected':''}>Tối (mặc định)</option><option value="light" ${TH.m=='light'?'selected':''}>Sáng</option></select><label>Độ sáng hiệu ứng</label><input id="sb" type="range" min=".4" max="2" step=".1" value="${S.bright}"><label><input id="sn" type="checkbox" style="width:auto" ${S.snd?'checked':''}> Âm thanh tương tác</label><label><input id="sg" type="checkbox" style="width:auto" ${S.notes?'checked':''}> Hiện ghi chú hướng dẫn (bong bóng gợi ý)</label>`);
$('#bHelp').onclick=()=>modal('Trợ giúp',`<button class="bt or" data-x="tour">↺ Xem lại hướng dẫn 3 bước</button><p><span class="hand">👆</span> Chạm một nút để xem thông tin. Thanh trên có 3 chế độ: <b>🔎 Khám phá</b> (xem và sửa cây), <b>🚶 Duyệt cây</b> (xem từng bước kèm code), <b>🎮 Trò chơi</b>. Nút trên thanh trên đổi cách kéo 1 ngón: <b>⟳ Xoay cây</b> (kéo để xoay 3D) hoặc <b>✋ Kéo nút</b> (kéo từng nút; kéo chỗ trống để dời cả cây).<br>Hai ngón: chụm để thu/phóng, vặn để xoay cây.<br>📌 Cây tự cố định ngay khi bạn xác nhận quét đúng. Muốn đổi cây: bấm 🔍 Quét lại. Giữ lâu một nút bất kỳ để xem ghi chú tác dụng.</p><p><b style="color:#fab005">●</b> Nút gốc &nbsp;<b style="color:#4dabf7">●</b> Nút trong (nhánh) &nbsp;<b style="color:#40c057">●</b> Nút lá<br><b style="color:#ff6b35">●</b> Đang duyệt &nbsp;<b style="color:#ffd43b">●</b> Đã duyệt &nbsp;<b style="color:#fa5252">●</b> Không tìm thấy</p>`);
// nút ⋯ trên màn hình hẹp: gom Cài đặt / Trợ giúp / Đo thông số
$('#bMore').onclick=()=>{const nf=q=>$(q).classList.contains('nf');modal('Thêm',(nf('#bSet')?'<button class="bt" data-x="mSet">⚙ Cài đặt</button>':'')+(nf('#bHelp')?'<button class="bt" data-x="mHelp">? Trợ giúp</button>':'')+(nf('#bAna')&&S.mode=='kham'&&root?'<button class="bt" data-x="mAna">📐 Đo thông số</button>':''))};
X.mSet=()=>{close();$('#bSet').click()};X.mHelp=()=>{close();$('#bHelp').click()};X.mAna=()=>{close();OP.ana()};
document.querySelectorAll('[data-op]').forEach(b=>b.onclick=()=>OP[b.dataset.op]());
$('#bAna').onclick=OP.ana;
const MVL={rot:['⟳','Xoay cây'],node:['✋','Kéo nút']},MVT={rot:'⟳ Xoay cây: kéo 1 ngón để xoay 3D · 2 ngón để thu/phóng',node:'✋ Kéo nút: kéo từng nút · kéo chỗ trống để dời cả cây'};
$('#bMv').onclick=()=>{S.dm=S.dm=='rot'?'node':'rot';S.mv=S.dm=='rot'?'orbit':'pan';toast(MVT[S.dm]);ui()};
const MDESC={kham:'Xem thông số & thông tin nút · thêm / xóa / sửa nút · nhập cây',duyet:'Xem từng bước duyệt cây và tìm kiếm, kèm mã giả / Python',choi:'Trắc nghiệm sinh từ cây · đoán nút tiếp theo · sửa cây lỗi · duyệt · săn nút · tìm khoá'};
const setMode=m=>{if(m==S.mode&&!GM.on)return;
  if(GM.on){clearInterval(GM.tm);GM.on=0;document.body.classList.remove('game')}   // đang chơi mà đổi chế độ → thoát game
  S.mode=m;if(m=='choi'){S.dm='rot';S.mv='orbit'}                                  // chế độ chơi chỉ chạm nút, không kéo nút
  $('#tools').classList.remove('cl');                                               // mặc định mở thanh công cụ của chế độ vừa chọn
  clear();refresh();if(m=='choi')OP.game()};
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$('#vw').onchange=e=>{S.view=e.target.value;sync.w=0;refresh()};
$('#tk').onchange=e=>{S.kind=e.target.value;clear();refresh()};
$('#spd').onchange=e=>{S.speed=+e.target.value;if(S.run)startT()};
const trav=()=>{if(!S.steps.length||S.steps[0].t!='trav'||S.i>=S.steps.length-1){const s=tSteps(S.kind);if(!s.length){toast(EM);return false}S.steps=s;S.i=-1;S.ck=S.kind}return true};
$('#bPlay').onclick=()=>{if(S.run){stopT();return ui()}if(trav())startT()};
$('#bNx').onclick=()=>{stopT();if(!S.steps.length||S.steps[0].t!='trav'){if(!trav())return}go(S.i+1)};
$('#bPv').onclick=()=>{stopT();go(S.i-1)};
$('#bLock').onclick=()=>lockFn?lockFn():toast('Chưa bật AR');
const KS=[['pre','Duyệt trước (preorder)'],['in','Duyệt giữa (inorder)'],['post','Duyệt sau (postorder)'],['rin','Duyệt ngược (reverse order)']];
const TS=[{t:'👆 Bước 1/3: chạm vào <b>một nút</b> trên cây để xem thông tin của nó.',ok:()=>S.sel!=null},
 {t:'🚶 Bước 2/3: chuyển sang <b>Duyệt cây</b>, rồi bấm ▶ để xem máy duyệt cây từng bước kèm code.',sel:'[data-mode="duyet"]',ok:()=>S.mode=='duyet'||S.steps.length>0},
 {t:'🎮 Bước 3/3: thử chế độ <b>Trò chơi</b> — chạm các nút đúng thứ tự duyệt!',sel:'[data-mode="choi"]',ok:()=>GM.on||S.mode=='choi'}];
function tour(){const el=$('#coach');document.querySelectorAll('.hl').forEach(x=>x.classList.remove('hl'));if(!S.notes){el.style.display='none';return}
  const blk=document.body.classList.contains('scan')||document.body.classList.contains('cfm')||!root||GM.on||$('#mo').style.display=='flex';
  $('#cs').textContent='Bỏ qua';if(TR.off||blk){el.style.display='none';return}
  while(TR.i<TS.length&&TS[TR.i].ok())TR.i++;
  if(TR.i>=TS.length){TR.off=1;try{localStorage.setItem('arbt_tour','1')}catch(e){}el.style.display='none';toast('🎉 Xong hướng dẫn! Bấm ? để xem lại');return}
  const c=TS[TR.i];$('#ct').innerHTML=c.t;el.style.display='flex';if(c.sel){const t=$(c.sel);t&&t.classList.add('hl')}}
$('#cs').onclick=()=>{TR.off=1;try{localStorage.setItem('arbt_tour','1')}catch(e){}tour()};
function fitTop(){const t=$('#top'),A=[$('#bAna'),$('#bSet'),$('#bHelp')],mo=$('#bMore');
  [...A,mo].forEach(b=>b.classList.remove('ic','nf'));
  if(!matchMedia('(max-width:760px)').matches)return;
  const wr=()=>{const k=[...t.children].filter(e=>e.offsetParent);if(k.length<2)return false;const c=e=>e.offsetTop+e.offsetHeight/2,y=c(k[0]);return k.some(e=>Math.abs(c(e)-y)>12)};
  A.forEach(b=>b.classList.add('nf'));                       // bắt đầu: tất cả nằm trong ⋯, rồi đưa ra ngoài nếu còn chỗ
  let full=true;                                              // hết chỗ ở nút nào thì các nút sau cũng nằm trong ⋯ (đúng thứ tự ưu tiên)
  A.forEach((b,i)=>{if(b.hidden)return;if(!full)return;b.classList.remove('nf');if(i>0)b.classList.add('ic');   // 📐 thử cả chữ; ⚙ và ? chỉ biểu tượng
    if(wr()){b.classList.add('ic');if(wr()){b.classList.add('nf');full=false}}});
  if(A.every(b=>!b.classList.contains('nf'))){mo.classList.add('nf');if(wr())mo.classList.remove('nf')}}   // ra hết thì bỏ nút ⋯
addEventListener('resize',()=>{try{ui()}catch(e){}});
function ui(){H.ui();qWatch();
  const sc=document.body.classList.contains('scan'),st=S.steps[S.i];
  $('#st').textContent=sc?'ĐANG QUÉT':isLocked?'ĐÃ CỐ ĐỊNH':'ĐÃ HOẠT ĐỘNG';$('#st').style.color=sc||isLocked?'#e67700':'#2f9e44';
  const b=$('#bLock');b.innerHTML=isLocked?'🔓<span class="tx"> BỎ CỐ ĐỊNH</span>':'📌<span class="tx"> CỐ ĐỊNH CÂY</span>';b.className=isLocked?'gr':'or';
  $('#bMv').innerHTML=MVL[S.dm][0]+'<span class="tx"> '+MVL[S.dm][1]+'</span>';$('#bMv').className=S.dm=='node'?'or':'gr';
  $('#vw').value=S.view;document.querySelectorAll('[data-mode]').forEach(b=>b.className=b.dataset.mode==S.mode?'or':'');
  const MO=MODES[S.mode].ops.split(' '),md=S.mode;document.querySelectorAll('[data-op]').forEach(x=>{x.hidden=!MO.includes(x.dataset.op)});$('#bAna').hidden=!MO.includes('ana');
  $('#trav').hidden=md=='choi'||!(md=='duyet'||S.steps.length>0);      // thanh phát mô phỏng: Duyệt cây (và khi đang chạy tìm kiếm / thêm nút)
  $('#info').hidden=md!='kham';                                         // thông tin nút: chỉ Khám phá
  $('#vw').hidden=md=='choi';$('#bMv').hidden=md=='choi';               // đổi cách hiển thị / cách kéo: Khám phá + Duyệt cây
  $('#mdesc').textContent=MDESC[md];
  const tg=$('#tg');tg.innerHTML=$('#tools').classList.contains('cl')?'🧰 ▸':'▾ Thu gọn';tg.title=$('#tools').classList.contains('cl')?'Mở rộng thanh công cụ':'Thu gọn thanh công cụ';
  const ks=KS;if(!ks.some(k=>k[0]==S.kind))S.kind='in';
  const th=ks.map(k=>`<option value="${k[0]}" ${k[0]==S.kind?'selected':''}>${k[1]}</option>`).join('');if(ui.th!==th){ui.th=th;$('#tk').innerHTML=th}
  $('#tt').textContent=st&&st.t=='path'?'ĐƯỜNG ĐI':'MÔ PHỎNG';$('#bPlay').textContent=S.run?'⏸':'▶';
  const ids=st?st.out:[];$('#out').innerHTML=ids.map((id,j)=>`<span class="${st.cur==id&&j==ids.length-1?'cu':''}">${esc(trunc(disp(byId(id))))}</span>`).join('')||'<small style="opacity:.6;font-weight:400">Kết quả sẽ hiện ở đây</small>';
  $('#nt').textContent=st?st.note:'';
  const n=byId(S.sel);let h='<h4>THÔNG TIN NÚT</h4>';
  if(!n)h+=root?'<div><i>Chạm vào một nút 3D để xem chi tiết</i></div>':'<div><i>Cây rỗng — dùng ⌨ Nhập / Khởi tạo cây</i></div>';
  else{const p=par(n),k=(function g(t,k){return t===n?k:t?(g(t.l,2*k+1)??g(t.r,2*k+2)):null})(root,0);
    h+=`<div>Giá trị: ${esc(n.v)}</div><div>Loại: ${n===root?'Nút gốc':!n.l&&!n.r?'Nút lá':'Nút trong (nút nhánh)'}</div><div>Mức: ${depth(n)} <i>(gốc = 0)</i></div><div>Chiều cao: ${hE(n)} <i>(lá = 0)</i></div><div>Bậc: ${(n.l?1:0)+(n.r?1:0)}</div><div>Cha: ${p?esc(disp(p)):'—'}</div><div>Con trái: ${n.l?esc(disp(n.l)):'—'} · phải: ${n.r?esc(disp(n.r)):'—'}</div><div>Mảng: k=${k} → 2k+1=${2*k+1}, 2k+2=${2*k+2}</div>`}
  $('#info').innerHTML=h;drawCode();tour();
  fitTop();
  const tbH=$('#top').offsetHeight,mbH=$('#modes').offsetHeight;document.documentElement.style.setProperty('--tm',(tbH+14)+'px');document.documentElement.style.setProperty('--ti',(tbH+16+(mbH?mbH+6:0))+'px');document.documentElement.style.setProperty('--tb',($('#trav').offsetHeight+16)+'px');
}
document.body.classList.add('scan');

