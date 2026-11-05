// ================= BỘ KIỂM TRA & CHỈNH CẤU TRÚC CÂY TRƯỚC KHI DỰNG 3D =================
// Việc của file này CHỈ là: hiện ảnh giấy + các nút/đường nối máy nhận ra, cho người dùng sửa, rồi trả về cây đã được người dùng xác nhận.
// Không tìm nút, không đọc số, không tự suy đoán cha–con (đoán nào của máy cũng được đánh dấu màu cam để người dùng kiểm tra).
// Dùng:  TEDIT.open({img:canvas, k:hệ số nhân toạ độ nút → toạ độ ảnh, C:[{x,y,r}], par:[chỉ số nút cha | -1], unc:[true nếu đường nối lên cha chưa chắc],
//                    t:[chữ số đọc được], flag:[true nếu số chưa chắc], onOk(kq), onRedo(), libs:[{n,sim,fn}]})
//        TEDIT.setVal(i,{t,flag,why})   // điền số đọc được (không ghi đè số người dùng đã sửa)
//        TEDIT.busy('đang đọc số…') / TEDIT.close()
// kq = {C:[{x,y,r}] (toạ độ như lúc truyền vào), root:{i,l,r}, vals:[số], par:[…]}
const TEDIT=(()=>{
  const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  // ---------- phần tính toán thuần (không đụng giao diện, kiểm thử được) ----------
  // m = {n:[{x,y,r,t,flag,touched,rm,side,unc,edited}], par:[…]}  (par[i] = chỉ số nút cha, -1 = chưa có cha / gốc)
  const live=m=>m.n.map((_,i)=>i).filter(i=>!m.n[i].rm);
  const kids=(m,p)=>live(m).filter(i=>m.par[i]===p);
  const isDesc=(m,u,a)=>{for(let p=m.par[u],g=0;p>=0&&g<999;p=m.par[p],g++)if(p===a)return true;return false};   // a có là tổ tiên của u không
  const parOpts=(m,i)=>live(m).filter(j=>j!==i&&!isDesc(m,j,i)&&(m.par[i]===j||kids(m,j).length<2));              // nút cha hợp lệ: không tạo vòng, không quá 2 con
  const kidOpts=(m,i)=>live(m).filter(j=>j!==i&&j!==m.par[i]&&!isDesc(m,i,j)&&kids(m,i).length<2);
  // trái/phải: người dùng đã chọn thì giữ; chưa chọn thì xếp theo vị trí trên giấy (và đánh dấu "tự xếp" nếu chỉ có 1 con)
  function sides(m){const out={},conf=[];
    live(m).forEach(p=>{const ks=kids(m,p);if(!ks.length)return;const fix={l:null,r:null},rest=[];
      ks.forEach(c=>{const s=m.n[c].side;if((s=='l'||s=='r')&&!fix[s])fix[s]=c;else rest.push(c)});
      if(rest.length&&ks.some(c=>m.n[c].side&&fix[m.n[c].side]!==c&&rest.includes(c)))conf.push(p);
      rest.sort((a,b)=>m.n[a].x-m.n[b].x);
      if(rest.length==2){fix.l=rest[0];fix.r=rest[1]}
      else if(rest.length==1){const c=rest[0];if(fix.l!=null)fix.r=c;else if(fix.r!=null)fix.l=c;else{const left=m.n[c].x<m.n[p].x;fix[left?'l':'r']=c;out[c]={s:left?'l':'r',auto:1}}}
      ['l','r'].forEach(s=>{if(fix[s]!=null&&!out[fix[s]])out[fix[s]]={s,auto:ks.length==2&&!m.n[fix[s]].side?1:0}})});
    return{side:out,conf}}
  // kiểm tra: lỗi (chặn xác nhận) và cảnh báo (chỉ nhắc)
  function check(m){const L=live(m),errs=[],warns=[],nm=i=>'#'+(i+1);
    if(!L.length)return{ok:false,errs:[{i:-1,msg:'Chưa có nút nào.'}],warns,roots:[]};
    const roots=L.filter(i=>m.par[i]<0);
    if(roots.length==0)errs.push({i:-1,msg:'Không có nút gốc (có vòng cha–con).'});
    if(roots.length>1)roots.forEach(i=>errs.push({i,msg:`Nút ${nm(i)} chưa có nút cha — chọn nút cha, hoặc bỏ nối của các nút khác để chỉ còn 1 gốc.`}));
    L.forEach(i=>{if(kids(m,i).length>2)errs.push({i,msg:`Nút ${nm(i)} có hơn 2 con.`});
      const t=String(m.n[i].t).trim();if(t===''||!/^-?\d{1,6}$/.test(t))errs.push({i,msg:`Nút ${nm(i)} chưa có giá trị số hợp lệ — nhập theo giấy.`})});
    const sd=sides(m);sd.conf.forEach(p=>errs.push({i:p,msg:`Nút ${nm(p)} có hai con cùng chọn một phía (trái/phải).`}));
    const cnt={};L.forEach(i=>{const t=String(m.n[i].t).trim();if(t!=='')(cnt[t]=cnt[t]||[]).push(i)});
    Object.keys(cnt).forEach(t=>{if(cnt[t].length>1)warns.push({i:cnt[t][0],msg:`Giá trị ${t} xuất hiện ở ${cnt[t].map(nm).join(', ')} — đúng như giấy thì giữ nguyên.`})});
    L.forEach(i=>{const n=m.n[i];if(n.flag&&!n.touched)warns.push({i,msg:`Số của nút ${nm(i)} máy đọc chưa chắc — đối chiếu với giấy.`});
      if(m.par[i]>=0&&n.unc&&!n.edited)warns.push({i,msg:`Đường nối ${nm(m.par[i])} → ${nm(i)} chưa chắc chắn.`});
      if(m.par[i]>=0&&sd.side[i]&&sd.side[i].auto&&!n.edited&&kids(m,m.par[i]).length==1)warns.push({i,msg:`Nút ${nm(i)} là con ${sd.side[i].s=='l'?'trái':'phải'} (tự xếp theo vị trí) — đúng chưa?`})});
    return{ok:!errs.length,errs,warns,roots,side:sd.side}}
  // dựng cây {i,l,r} theo chỉ số nút còn lại, đánh số lại gọn (bỏ nút đã xoá)
  function build(m){const c=check(m);if(!c.ok)return null;const L=live(m),idx={};L.forEach((o,k)=>idx[o]=k);
    const nd=u=>{const o={i:idx[u],l:null,r:null};kids(m,u).forEach(ch=>{const s=c.side[ch].s;o[s]=nd(ch)});return o};
    return{C:L.map(i=>({x:m.n[i].x,y:m.n[i].y,r:m.n[i].r})),root:nd(c.roots[0]),vals:L.map(i=>+String(m.n[i].t).trim()),par:L.map(i=>m.par[i]<0?-1:idx[m.par[i]])}}
  // ---------- giao diện ----------
  let ov=null,M=null,O=null,sel=-1,zoom=1,addMode=0,busyMsg='',view=null;
  const css=`#te{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:#0b1620;color:#e8f1f7;font:14px/1.35 system-ui,sans-serif}
#te *{box-sizing:border-box}#te .tp{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid #1e3344}#te .tp b{flex:1;font-size:15px}
#te button{font:inherit;color:inherit;background:#1d3446;border:1px solid #2c4a61;border-radius:9px;padding:8px 10px;min-height:40px;cursor:pointer}
#te button.or{background:#f76707;border-color:#f76707;color:#fff;font-weight:700}#te button:disabled{opacity:.45}#te button.on{background:#2b6cb0;border-color:#4299e1}
#te .st{flex:1 1 40%;min-height:150px;overflow:auto;background:#050c12;position:relative;touch-action:pan-x pan-y pinch-zoom}#te svg{display:block}
#te .pn{flex:0 0 auto;max-height:50vh;overflow:auto;padding:8px 10px;border-top:1px solid #1e3344;background:#0f2230}
#te .lg{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12px;opacity:.9;margin:0 0 6px}#te .lg i{display:inline-block;width:18px;height:0;border-top:3px solid;vertical-align:middle;margin-right:4px}
#te label{display:flex;align-items:center;gap:8px;margin:5px 0}#te label span{flex:0 0 78px;font-size:13px}
#te input,#te select{flex:1;min-width:0;font:inherit;font-size:16px;padding:8px;border-radius:8px;border:1px solid #2c4a61;background:#07131b;color:#fff}
#te .rw{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}#te .rw button{flex:1 1 auto}
#te .is{margin:6px 0;padding:0;list-style:none;font-size:13px}#te .is li{padding:5px 8px;margin:3px 0;border-radius:7px;background:#2a1b1b;border-left:4px solid #ef4444;cursor:pointer}
#te .is li.w{background:#2a2414;border-left-color:#f59e0b}#te .ok{color:#4ade80;font-size:13px;margin:4px 0}
#te .ch{display:inline-block;padding:1px 7px;border-radius:9px;font-size:12px;background:#f59e0b;color:#222;margin-left:6px}#te .ch.g{background:#3b82f6;color:#fff}
#te .bt{display:flex;gap:8px;padding:8px 10px;border-top:1px solid #1e3344;background:#0b1620}#te .bt .or{flex:2}#te .bt button:not(.or){flex:1}
#te .hn{font-size:12px;opacity:.75;margin:2px 0 4px}`;
  const SV='http://www.w3.org/2000/svg';
  function mkOv(){if(!document.getElementById('te-css')){const s=document.createElement('style');s.id='te-css';s.textContent=css;document.head.appendChild(s)}
    ov=document.createElement('div');ov.id='te';
    ov.innerHTML=`<div class="tp"><b>🔎 Kiểm tra cấu trúc cây</b><button id="te-zo" title="Thu nhỏ">−</button><button id="te-zi" title="Phóng to">＋</button><button id="te-ad" title="Thêm nút bị sót">＋ Nút</button></div>
<div class="st" id="te-st"></div><div class="pn" id="te-pn"></div>
<div class="bt"><button id="te-re">↻ Quét lại</button><button id="te-ok" class="or">✔ Xác nhận & dựng 3D</button></div>`;
    document.body.appendChild(ov);
    $('#te-zi').onclick=()=>{zoom=Math.min(4,zoom*1.35);drawSvg()};$('#te-zo').onclick=()=>{zoom=Math.max(.6,zoom/1.35);drawSvg()};
    $('#te-ad').onclick=()=>{addMode=!addMode;$('#te-ad').classList.toggle('on',!!addMode);if(addMode)msg('Chạm vào chỗ còn thiếu nút trên ảnh để thêm một nút.');renderPn()};
    $('#te-re').onclick=()=>{const f=O.onRedo;close();f&&f()};
    $('#te-ok').onclick=()=>{const c=check(M);if(!c.ok)return;const r=build(M),f=O.onOk;close();f&&f(r)};
    $('#te-pn').addEventListener('click',onPn);$('#te-pn').addEventListener('input',onIn);$('#te-pn').addEventListener('change',onCh)}
  const nm=i=>'#'+(i+1);
  function msg(t){const e=$('#te-msg');if(e)e.textContent=t}
  // ---- vẽ ảnh + nút + đường nối (SVG, toạ độ theo ảnh đã cắt) ----
  function drawSvg(){const st=$('#te-st');if(!st)return;const{vx,vy,vw,vh,cv}=view,Wp=Math.max(120,(st.clientWidth||360)*zoom),Hp=Wp*vh/vw;
    const s=document.createElementNS(SV,'svg');s.setAttribute('viewBox',`${vx} ${vy} ${vw} ${vh}`);s.setAttribute('width',Wp);s.setAttribute('height',Hp);
    const px=vw/Wp,sd=check(M).side||{},mk=(t,a,p)=>{const e=document.createElementNS(SV,t);for(const k in a)e.setAttribute(k,a[k]);(p||s).appendChild(e);return e};
    const im=mk('image',{x:0,y:0,width:cv.width*view.sc,height:cv.height*view.sc,opacity:.95});view.url=view.url||cv.toDataURL('image/jpeg',.85);im.setAttributeNS('http://www.w3.org/1999/xlink','href',view.url);im.setAttribute('href',view.url);
    const L=live(M),R=n=>Math.max(n.r,6*px);
    L.forEach(i=>{const p=M.par[i];if(p<0)return;const a=M.n[p],b=M.n[i],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,ra=R(a),rb=R(b),u=b.unc&&!b.edited,ed=b.edited;
      const col=ed?'#3b82f6':u?'#f59e0b':'#22c55e',w=Math.max(2.2*px,2);
      mk('line',{x1:a.x+ux*ra,y1:a.y+uy*ra,x2:b.x-ux*rb,y2:b.y-uy*rb,stroke:'#000','stroke-opacity':.55,'stroke-width':w+2.4*px,'stroke-linecap':'round'});
      mk('line',{x1:a.x+ux*ra,y1:a.y+uy*ra,x2:b.x-ux*rb,y2:b.y-uy*rb,stroke:col,'stroke-width':w,'stroke-linecap':'round',...(u?{'stroke-dasharray':`${7*px} ${5*px}`}:{})});
      const sx=b.x-ux*(rb+11*px),sy=b.y-uy*(rb+11*px),sq=sd[i];       // nhãn T / P gần nút con
      if(sq){mk('circle',{cx:sx,cy:sy,r:7.5*px,fill:sq.auto?'#f59e0b':'#1e3a5f',stroke:'#fff','stroke-width':1.2*px});
        const t=mk('text',{x:sx,y:sy+.5*px,'text-anchor':'middle','dominant-baseline':'central','font-size':9.5*px,'font-weight':'bold',fill:sq.auto?'#222':'#fff'});t.textContent=sq.s=='l'?'T':'P'}});
    L.forEach(i=>{const n=M.n[i],c=check(M),err=c.errs.some(e=>e.i===i),wv=n.flag&&!n.touched,isSel=i===sel,rr=R(n),
      col=isSel?'#60a5fa':err?'#ef4444':wv?'#f59e0b':'#22c55e';
      if(isSel)mk('circle',{cx:n.x,cy:n.y,r:rr+5*px,fill:'none',stroke:'#60a5fa','stroke-opacity':.45,'stroke-width':8*px});
      mk('circle',{cx:n.x,cy:n.y,r:rr,fill:'#000','fill-opacity':.28,stroke:col,'stroke-width':Math.max(3*px,2.6)});
      const t=String(n.t).trim(),fs=Math.max(13*px,Math.min(rr*(t.length>2?.7:.95),30*px));
      const tx=mk('text',{x:n.x,y:n.y,'text-anchor':'middle','dominant-baseline':'central','font-size':fs,'font-weight':'bold',fill:t?'#fff':'#fca5a5',stroke:'#000','stroke-width':fs*.2,'paint-order':'stroke'});tx.textContent=t||'?';
      const lb=mk('text',{x:n.x,y:n.y-rr-4*px,'text-anchor':'middle','font-size':10.5*px,fill:'#cbd5e1',stroke:'#000','stroke-width':3*px,'paint-order':'stroke'});lb.textContent=nm(i)+(M.par[i]<0&&c.roots.length==1&&c.roots[0]===i?' · gốc':'');
      const hit=mk('circle',{cx:n.x,cy:n.y,r:Math.max(rr+4*px,22*px),fill:'transparent','data-i':i,style:'cursor:pointer'})});
    s.addEventListener('click',e=>{const h=e.target.closest&&e.target.closest('[data-i]');
      if(addMode&&!h){const pt=s.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(s.getScreenCTM().inverse()),rs=live(M).map(i=>M.n[i].r).sort((a,b)=>a-b),r=rs.length?rs[rs.length>>1]:20;
        M.n.push({x:q.x,y:q.y,r,t:'',flag:0,touched:0,rm:0,side:null,unc:0,edited:1});M.par.push(-1);sel=M.n.length-1;addMode=0;$('#te-ad').classList.remove('on');renderAll();return}
      if(h){sel=+h.getAttribute('data-i');renderAll()}});
    const keep=st.scrollLeft/(st.scrollWidth||1),keepY=st.scrollTop/(st.scrollHeight||1);st.replaceChildren(s);st.scrollLeft=keep*st.scrollWidth;st.scrollTop=keepY*st.scrollHeight}
  function sideOf(i){const c=check(M);return c.side&&c.side[i]}
  function renderPn(){const pn=$('#te-pn');if(!pn)return;const c=check(M),L=live(M);let h='';
    h+=`<div class="lg"><span><i style="border-color:#22c55e"></i>nối chắc</span><span><i style="border-color:#f59e0b;border-top-style:dashed"></i>chưa chắc</span><span><i style="border-color:#3b82f6"></i>bạn đã sửa</span><span>vòng đỏ: lỗi · T/P: con trái/phải</span></div>`;
    h+=`<div id="te-msg" class="hn">${busyMsg?esc(busyMsg):addMode?'Chạm vào chỗ còn thiếu nút trên ảnh để thêm một nút.':'Chạm vào một nút để xem và sửa.'}</div>`;
    const iss=c.errs.map(e=>[e,0]).concat(c.warns.map(e=>[e,1]));
    h+=iss.length?`<ul class="is">${iss.map(([e,w])=>`<li class="${w?'w':''}" data-go="${e.i}">${w?'⚠':'✖'} ${esc(e.msg)}</li>`).join('')}</ul>`:`<div class="ok">✔ Cấu trúc hợp lệ: ${L.length} nút, 1 gốc, mỗi nút một cha, tối đa 2 con.</div>`;
    if(sel>=0&&!M.n[sel].rm){const n=M.n[sel],po=parOpts(M,sel),ko=kidOpts(M,sel),sq=sideOf(sel),isRoot=M.par[sel]<0;
      h+=`<div style="border-top:1px solid #1e3344;margin-top:6px;padding-top:4px"><b>Nút ${nm(sel)}</b>${n.flag&&!n.touched?'<span class="ch">số chưa chắc</span>':''}${n.touched?'<span class="ch g">đã sửa số</span>':''}</div>
<label><span>Giá trị</span><input id="te-v" inputmode="numeric" autocomplete="off" value="${esc(n.t)}" placeholder="số trên giấy"></label>
<label><span>Nút cha</span><select id="te-p"><option value="-1"${isRoot?' selected':''}>— Không có cha (gốc) —</option>${po.map(j=>`<option value="${j}"${M.par[sel]===j?' selected':''}>${nm(j)} · giá trị ${esc(M.n[j].t||'?')}</option>`).join('')}</select></label>`;
      if(!isRoot)h+=`<div class="rw"><button data-sd="l" class="${sq&&sq.s=='l'?'on':''}">◀ Con trái</button><button data-sd="r" class="${sq&&sq.s=='r'?'on':''}">Con phải ▶</button></div>${sq&&sq.auto?'<div class="hn">Phía này máy tự xếp theo vị trí trên giấy — bấm để xác nhận hoặc đổi.</div>':''}`;
      h+=`<div class="rw"><button data-act="cut"${isRoot?' disabled':''}>✂ Xóa nối lên cha</button><button data-act="rm">🗑 Bỏ nút này</button></div>`;
      h+=`<label><span>Thêm nối</span><select id="te-k"><option value="">Chọn nút con để nối xuống…</option>${ko.map(j=>`<option value="${j}">${nm(j)} · giá trị ${esc(M.n[j].t||'?')}${M.par[j]>=0?' (đang nối với '+nm(M.par[j])+')':''}</option>`).join('')}</select></label>`}
    else if(L.length)h+='<div class="hn">Chạm vào một nút để sửa số, nút cha, trái/phải.</div>';
    const rmv=M.n.map((n,i)=>n.rm?i:-1).filter(i=>i>=0);
    if(rmv.length)h+=`<div class="rw">${rmv.map(i=>`<button data-act="undo" data-i="${i}">↩ Khôi phục nút ${nm(i)}</button>`).join('')}</div>`;
    if(O.libs&&O.libs.length)h+=`<div class="hn" style="margin-top:6px">📚 Hình giống trong sách (chỉ khi bạn chọn mới đổi sang số chuẩn của sách):</div><div class="rw">${O.libs.map((l,k)=>`<button data-lib="${k}">${esc(l.n)} · ${Math.round(l.sim*100)}%</button>`).join('')}</div>`;
    pn.innerHTML=h;const ok=$('#te-ok');ok.disabled=!c.ok;ok.title=c.ok?'':c.errs[0].msg}
  const renderAll=()=>{drawSvg();renderPn()};
  function onPn(e){const t=e.target,go=t.closest('[data-go]');
    if(go){const i=+go.getAttribute('data-go');if(i>=0&&!M.n[i].rm){sel=i;renderAll();const n=M.n[i],st=$('#te-st');st.scrollTo&&st.scrollTo({left:Math.max(0,(n.x-view.vx)/view.vw*st.scrollWidth-st.clientWidth/2),top:Math.max(0,(n.y-view.vy)/view.vh*st.scrollHeight-st.clientHeight/2)})}return}
    const b=t.closest('button');if(!b)return;
    if(b.dataset.sd){const i=sel;M.n[i].side=b.dataset.sd;M.n[i].edited=1;
      const p=M.par[i];kids(M,p).forEach(c=>{if(c!==i&&M.n[c].side===b.dataset.sd)M.n[c].side=b.dataset.sd=='l'?'r':'l'});renderAll();return}   // đổi phía thì anh/chị em tự sang phía kia
    if(b.dataset.act=='cut'){M.par[sel]=-1;M.n[sel].side=null;M.n[sel].unc=0;M.n[sel].edited=1;renderAll()}
    else if(b.dataset.act=='rm'){const i=sel;kids(M,i).forEach(c=>{M.par[c]=-1});M.n[i].rm=1;M.par[i]=-1;sel=-1;renderAll()}
    else if(b.dataset.act=='undo'){M.n[+b.dataset.i].rm=0;renderAll()}
    else if(b.dataset.lib!=null){const l=O.libs[+b.dataset.lib],f=O.onLib,r=build(M);if(!r)return msg('Cần sửa hết lỗi trước khi dùng hình mẫu.');close();f&&f(l,r)}}
  function onIn(e){if(e.target.id=='te-v'){const n=M.n[sel];n.t=e.target.value.replace(/[^\d-]/g,'');if(e.target.value!==n.t)e.target.value=n.t;n.touched=1;drawSvg();
      const c=check(M);$('#te-ok').disabled=!c.ok;}}
  function onCh(e){const t=e.target;
    if(t.id=='te-v'){renderAll()}
    else if(t.id=='te-p'){const v=+t.value,n=M.n[sel];M.par[sel]=v;n.side=null;n.edited=1;n.unc=0;renderAll()}
    else if(t.id=='te-k'&&t.value!==''){const j=+t.value;M.par[j]=sel;M.n[j].side=null;M.n[j].edited=1;M.n[j].unc=0;renderAll()}}
  function open(o){close();O=o;const k=o.k||1,cv=o.img,mx=1400,sc=Math.max(1,Math.max(cv.width,cv.height)/mx);
    M={n:o.C.map((c,i)=>({x:c.x*k,y:c.y*k,r:c.r*k,t:o.t&&o.t[i]!=null?String(o.t[i]):'',flag:o.flag&&o.flag[i]?1:0,touched:0,rm:0,side:null,unc:o.unc&&o.unc[i]?1:0,edited:0})),par:o.par.slice()};
    const xs=M.n.flatMap(n=>[n.x-n.r,n.x+n.r]),ys=M.n.flatMap(n=>[n.y-n.r,n.y+n.r]),mg=Math.max(40,Math.max(...M.n.map(n=>n.r))*1.6);
    let vx=Math.max(0,Math.min(...xs)-mg),vy=Math.max(0,Math.min(...ys)-mg),vx1=Math.min(cv.width,Math.max(...xs)+mg),vy1=Math.min(cv.height,Math.max(...ys)+mg);
    let img=cv;if(sc>1){img=document.createElement('canvas');img.width=Math.round(cv.width/sc);img.height=Math.round(cv.height/sc);img.getContext('2d').drawImage(cv,0,0,img.width,img.height)}
    view={vx,vy,vw:vx1-vx,vh:vy1-vy,cv:img,sc};sel=-1;zoom=1;addMode=0;busyMsg=o.busy||'';
    mkOv();renderAll();const first=check(M).errs[0];if(first&&first.i>=0){sel=first.i;renderAll()}return api}
  function close(){if(ov){ov.remove();ov=null}M=null;O=null;sel=-1;busyMsg=''}
  const api={open,close,
    setVal(i,v){if(!M||!M.n[i]||M.n[i].touched)return;M.n[i].t=String(v.t);M.n[i].flag=v.flag?1:0;drawSvg();const a=document.activeElement;if(!(a&&a.id=='te-v'))renderPn()},
    busy(m){busyMsg=m||'';if(M)msg(busyMsg||'Chạm vào một nút để xem và sửa.')},
    model:()=>M};
  return Object.assign(api,{calc:{check,build,sides,parOpts,kidOpts,isDesc,kids,live}});
})();
