// ================= MÃ GIẢ + PYTHON (khớp từng dòng với bước mô phỏng) =================
const NM={pre:'preorder',in:'inorder',post:'postorder',rin:'reverseorder'},OR={pre:'vlr',in:'lvr',post:'lrv',rin:'rvl'},TNm={pre:'duyệt trước',in:'duyệt giữa',post:'duyệt sau',rin:'duyệt ngược'};
const CODE={};for(const k in OR)CODE[k]={gia:[NM[k]+'(cây v)','  Nếu cây v khác rỗng',...[...OR[k]].map(c=>c=='v'?'    Duyệt nút v':`    ${NM[k]}(cây con ${c=='l'?'trái':'phải'} của v)`)],
  py:[`def ${NM[k]}(A,k):`,'    if k < len(A) and A[k] != None:',...[...OR[k]].map(c=>c=='v'?'        print(A[k], end=" ")':`        ${NM[k]}(A,${c=='l'?'left':'right'}(k))`)]};
function drawCode(){const el=$('#code'),tv=!S.steps.length||S.steps[0].t=='trav';
  if(!S.showCode||!tv||!(S.mode=='duyet'||S.steps.length)){el.style.display='none';return}
  const k=S.steps.length&&S.ck?S.ck:S.kind,L=(CODE[k]||CODE.pre)[S.lang],st=S.steps[S.i];el.style.display='';
  el.innerHTML=`<div class="tb"><button data-lg="gia" class="${S.lang=='gia'?'on':''}">Mã giả</button><button data-lg="py" class="${S.lang=='py'?'on':''}">Python</button></div>`+L.map((t,i)=>`<div class="ln${st&&S.ck==k&&st.l===i?' on':''}">${esc(t)}</div>`).join('')}
$('#code').addEventListener('click',e=>{const b=e.target.closest('[data-lg]');if(b){S.lang=b.dataset.lg;drawCode()}});

// ================= BƯỚC MÔ PHỎNG =================
function tSteps(k){const s=[],out=[],O=OR[k];if(!root)return s;
  const P=(n,t,l)=>s.push({t:'trav',cur:n.id,out:[...out],note:t,l});
  const f=n=>{if(!n)return;P(n,'Vào '+disp(n),1);[...O].forEach((c,i)=>{if(c=='v'){out.push(n.id);P(n,'Thăm '+disp(n),2+i)}else f(c=='l'?n.l:n.r)})};
  f(root);return s}
function sSteps(x){const s=[],out=[],P=(n,note,res)=>s.push({t:'path',cur:n?n.id:null,out:[...out],note,res});   // tìm theo thứ tự duyệt trước
  for(const n of pre()){out.push(n.id);if(n.v==x){P(n,'Tìm thấy '+n.v,'ok');return s}P(n,n.v+' ≠ '+x+' → tìm tiếp')}
  P(null,'Duyệt hết cây → không tìm thấy','no');return s}
function remove(t){const p=par(t);let rep;
  if(!t.l||!t.r)rep=t.l||t.r;
  else{let sp=t,s=t.r;while(s.l){sp=s;s=s.l}if(sp!==t){sp.l=s.r;s.r=t.r}s.l=t.l;rep=s}
  if(!p)root=rep;else if(p.l===t)p.l=rep;else p.r=rep}
// ---- điều khiển phát ----
function stopT(){clearInterval(S.tm);S.run=0}
function clear(){stopT();S.steps=[];S.i=-1}
function go(i){S.i=Math.max(-1,Math.min(S.steps.length-1,i));const st=S.steps[S.i];
  if(st){beep(380+S.i*35);if(st.fin){const f=st.fin;delete st.fin;f()}}
  if(S.run&&S.i>=S.steps.length-1)stopT();refresh()}
function startT(){stopT();S.run=1;S.tm=setInterval(()=>go(S.i+1),950/S.speed);go(S.i+1)}
function setSteps(s,k){clear();S.steps=s;S.ck=k||null;if(s.length)startT();else refresh()}
const show=(ids,note)=>setSteps([{t:'path',cur:ids[0],out:ids,note}]);
const refresh=()=>{try{sync()}catch(e){showErr('Lỗi vẽ cây 3D: '+(e&&e.message||e))}ui()};

