//#AN-START
// ===== NHẬN DIỆN HÌNH CÂY (JS thuần): ngưỡng thích nghi → "lỗ" hình elip = nút → dò đường nối → chọn cây lớn nhất → dựng cha–con =====
// all=true (quét trong KHUNG VÀNG): lấy mọi nút trong khung, thiếu/thừa đường nối thì tự nối (infer)
function analyze(gray,w,h,ds=[1,2,4],los=[0,1],all,col,fs){let best=null,bs=-1;   // fs: 0 = chỉ thuật toán "lỗ rỗng", 1 = chỉ thuật toán nút đặc/màu, bỏ trống = thử lần lượt
  const T=(r,d,lo,sm)=>{const sc=(r.tr.ok?1e3:0)+r.ed.length*20+r.C.length*5;if(sc>bs){bs=sc;best=r;r.dd=d;r.lo=lo;r.sm=sm}};
  if(fs!==1){for(const lo of los){for(const d of ds)T(an(gray,w,h,d,lo,all),d,lo,0);if(best&&best.tr.ok)break}}      // lo=1: chế độ ảnh yếu (tương phản thấp/nhiễu)
  if(col&&fs!==0&&!(best&&best.tr.ok&&best.ed.length>=best.C.length-1)){const d=ds.includes(2)?2:ds[0];for(const lo of los){T(an(gray,w,h,d,lo,all,col,1),d,lo,1);if(best&&best.tr.ok)break}}   // nút tô đặc / nét màu (đen, xanh, đỏ, vàng…)
  return best}
function an(gray,w,h,dd,lo,all,col,sm){
  const N=w*h,W1=w+1,I=new Float64Array(W1*(h+1));
  for(let y=0;y<h;y++){let s=0;for(let x=0;x<w;x++){s+=gray[y*w+x];I[(y+1)*W1+x+1]=I[y*W1+x+1]+s}}
  if(lo){const g2=new Uint8Array(N);for(let y=0;y<h;y++){const y0=Math.max(0,y-1),y1=Math.min(h,y+2);for(let x=0;x<w;x++){const x0=Math.max(0,x-1),x1=Math.min(w,x+2);g2[y*w+x]=(I[y1*W1+x1]-I[y0*W1+x1]-I[y1*W1+x0]+I[y0*W1+x0])/((x1-x0)*(y1-y0))}}gray=g2}
  const k=Math.max(8,w>>4),ink=new Uint8Array(N);
  for(let y=0;y<h;y++){const y0=Math.max(0,y-k),y1=Math.min(h,y+k+1);
    for(let x=0;x<w;x++){const x0=Math.max(0,x-k),x1=Math.min(w,x+k+1),g=gray[y*w+x],
      m=(I[y1*W1+x1]-I[y0*W1+x1]-I[y1*W1+x0]+I[y0*W1+x0])/((x1-x0)*(y1-y0));
      ink[y*w+x]=lo?(g<m-6&&g<m*.9?1:0):(g<m-14&&g<m*.72?1:0)}}
  if(sm&&col)colInk(ink,gray,w,h,col,lo);const t=new Uint8Array(N),dl=new Uint8Array(N);                      // giãn nét (dd px) để nối chỗ hở của nét vẽ tay
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let v=0;for(let j=-dd;j<=dd&&!v;j++){const X=x+j;if(X>=0&&X<w&&ink[y*w+X])v=1}t[y*w+x]=v}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let v=0;for(let j=-dd;j<=dd&&!v;j++){const Y=y+j;if(Y>=0&&Y<h&&t[Y*w+x])v=1}dl[y*w+x]=v}
  const seen=new Uint8Array(N),q=new Int32Array(N);let qn=0,cs=[];     // vùng nền kín (không chạm biên) có dạng elip = nút (máy nghiêng vẫn nhận)
  for(let s0=0;s0<N;s0++){if(dl[s0]||seen[s0])continue;
    const st=qn;let hd=qn,tl=qn,bd=0,sx=0,sy=0;q[tl++]=s0;seen[s0]=1;
    while(hd<tl){const i=q[hd++],x=i%w,y=(i/w)|0;sx+=x;sy+=y;if(!x||!y||x==w-1||y==h-1)bd=1;
      if(x>0&&!dl[i-1]&&!seen[i-1]){seen[i-1]=1;q[tl++]=i-1}
      if(x<w-1&&!dl[i+1]&&!seen[i+1]){seen[i+1]=1;q[tl++]=i+1}
      if(y>0&&!dl[i-w]&&!seen[i-w]){seen[i-w]=1;q[tl++]=i-w}
      if(y<h-1&&!dl[i+w]&&!seen[i+w]){seen[i+w]=1;q[tl++]=i+w}}
    qn=tl;const area=tl-st;if(bd||area<30||area>N/8)continue;
    const cx=sx/area,cy=sy/area,fx=new Float64Array(32),fy=new Float64Array(32),fb=new Float64Array(32);   // điểm xa nhất mỗi hướng = đường viền ngoài (không bị số trong nút làm lệch)
    for(let j=st;j<tl;j++){const i=q[j],dx=i%w-cx,dy=((i/w)|0)-cy,s=((Math.atan2(dy,dx)/6.2832+1)*32|0)%32,d=dx*dx+dy*dy;if(d>fb[s]){fb[s]=d;fx[s]=dx;fy[s]=dy}}
    if(fb.some(v=>v<=0))continue;
    let mx=0,my=0;for(let s=0;s<32;s++){mx+=fx[s];my+=fy[s]}mx/=32;my/=32;let xx=0,yy=0,xy=0;
    for(let s=0;s<32;s++){const a=fx[s]-mx,b=fy[s]-my;xx+=a*a;yy+=b*b;xy+=a*b}xx/=32;yy/=32;xy/=32;
    const tr=xx+yy,sq=Math.sqrt(Math.max(0,tr*tr/4-(xx*yy-xy*xy))),l1=tr/2+sq,l2=tr/2-sq;if(l2<=0)continue;
    const A=Math.SQRT2*Math.sqrt(l1),B=Math.SQRT2*Math.sqrt(l2);if(A/B>2.4||B<3)continue;
    const th=.5*Math.atan2(2*xy,xx-yy),co=Math.cos(th),si=Math.sin(th),mr=new Float64Array(32);
    for(let s=0;s<32;s++){const a=fx[s]-mx,b=fy[s]-my;mr[s]=Math.hypot((a*co+b*si)/A,(-a*si+b*co)/B)}
    const mean=mr.reduce((u,v)=>u+v)/32,sd=Math.sqrt(mr.reduce((u,v)=>u+(v-mean)**2,0)/32)/mean,fill=area/(Math.PI*A*B);
    if(sd>.12||fill<.35||fill>1.25)continue;
    cs.push({x:cx+mx,y:cy+my,r:Math.max(A,B)+1.5})}
  if(sm&&col)solidNodes(dl,w,h,dd,cs);cs.sort((a,b)=>b.r-a.r);let C=[];                                    // bỏ lỗ nằm trong nút khác (ruột số 0,6,8,9…)
  for(const c of cs)if(!C.some(b=>Math.hypot(b.x-c.x,b.y-c.y)<b.r))C.push(c);
  if(C.length>2){const rs=C.map(c=>c.r).sort((a,b)=>a-b),md=rs[rs.length>>1];C=C.filter(c=>c.r>md*.55&&c.r<md*1.8)}
  C.sort((a,b)=>a.y-b.y||a.x-b.x);
  const n=C.length,ed=[];                                              // đường nối: đoạn thẳng giữa 2 nút phủ kín nét mực
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
    const a=C[i],b=C[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,g0=a.r+2,g1=d-b.r-2;
    if(g1-g0<4)continue;
    let bl=false;for(let m=0;m<n;m++)if(m!=i&&m!=j){const c=C[m],tt=(c.x-a.x)*ux+(c.y-a.y)*uy;if(tt>0&&tt<d&&Math.abs((c.x-a.x)*uy-(c.y-a.y)*ux)<c.r*1.05){bl=true;break}}
    if(bl)continue;
    let hit=0,tot=0;const tw=Math.max(2,Math.min(a.r,b.r)*.3|0),OS=[0];for(let o=2;o<=tw;o+=2)OS.push(o,-o);
    for(let s=g0;s<=g1;s++){tot++;const px=a.x+ux*s,py=a.y+uy*s;let ok=0;
      for(const o of OS){const X=Math.round(px-uy*o),Y=Math.round(py+ux*o);if(X>=0&&Y>=0&&X<w&&Y<h&&dl[Y*w+X]){ok=1;break}}hit+=ok}
    if(hit/tot>.9)ed.push([i,j])}
  const cp=C.map((_,i)=>i),fd=i=>cp[i]===i?i:(cp[i]=fd(cp[i]));ed.forEach(([i,j])=>cp[fd(i)]=fd(j));   // chỉ giữ cây lớn nhất (gần giữa khung nếu bằng nhau)
  const gp={};C.forEach((_,i)=>(gp[fd(i)]=gp[fd(i)]||[]).push(i));let pk=null,bs=-1;
  for(const key in gp){const m=gp[key],sc=m.length*1e5-Math.hypot(m.reduce((u,i)=>u+C[i].x,0)/m.length-w/2,m.reduce((u,i)=>u+C[i].y,0)/m.length-h/2);if(sc>bs){bs=sc;pk=m}}
  if(all&&C.length)pk=C.map((_,i)=>i);                                 // trong khung vàng: lấy mọi nút người dùng đã khoanh
  if(!pk)return{C:[],ed:[],tr:mkTree([],[]),extra:0};
  const ix={};pk.forEach((o,i)=>ix[o]=i);const C2=pk.map(i=>C[i]),e2=ed.filter(([i,j])=>i in ix&&j in ix).map(([i,j])=>[ix[i],ix[j]]);
  let tr=mkTree(C2,e2);if(!tr.ok&&all&&C2.length>=3)tr=mkTree(C2,infer(C2,e2),1);
  return {C:C2,ed:e2,tr,extra:n-C2.length};
}
function infer(C,ed){                                              // thiếu/thừa đường nối: tự nối mỗi nút với nút gần nhất ở hàng trên (tối đa 2 con), ưu tiên đường đã dò thấy
  const n=C.length,E=new Set(ed.map(([a,b])=>a<b?a+','+b:b+','+a)),o=C.map((_,i)=>i).sort((a,b)=>C[a].y-C[b].y),kids=C.map(()=>0),out=[];
  for(let t=1;t<n;t++){const i=o[t];let b=-1,bs=1e9;
    for(let u=0;u<t;u++){const j=o[u];if(kids[j]>=2)continue;const dy=C[i].y-C[j].y;if(dy<Math.min(C[i].r,C[j].r)*.8)continue;
      const d=Math.hypot(C[i].x-C[j].x,dy)*(E.has(i<j?i+','+j:j+','+i)?.35:1);if(d<bs){bs=d;b=j}}
    if(b>=0){kids[b]++;out.push([b,i])}}
  return out}
function mkTree(C,ed,inf){
  const n=C.length;if(!n)return{ok:false,msg:'chưa thấy nút hình tròn nào'};
  if(n<3)return{ok:false,msg:'cần ít nhất 3 nút nối với nhau'};
  if(ed.length<n-1)return{ok:false,msg:`thiếu đường nối (cần ${n-1}, thấy ${ed.length})`};
  if(ed.length>n-1)return{ok:false,msg:'có vòng kín → không phải cây'};
  const adj=C.map(()=>[]);ed.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a)});
  const run=r=>{const seen=new Set([r]),qq=[r],ch=C.map(()=>[]);let down=0;
    while(qq.length){const u=qq.shift();for(const v of adj[u])if(!seen.has(v)){seen.add(v);ch[u].push(v);qq.push(v);if(C[v].y>C[u].y)down++}}
    return{ch,down,cnt:seen.size,r}};
  let tp=0,bt=0;C.forEach((c,i)=>{if(c.y<C[tp].y)tp=i;if(c.y>C[bt].y)bt=i});
  const A=run(tp),B=run(bt),T=B.down>A.down?B:A,fl=T===B?-1:1;
  if(T.cnt<n)return{ok:false,msg:'các nút chưa nối liền nhau'};
  const bad=T.ch.findIndex(c=>c.length>2);if(bad>=0)return{ok:false,msg:`một nút có ${T.ch[bad].length} con (>2) → không phải cây nhị phân`};
  const nd=i=>{const c=T.ch[i].slice().sort((p,q)=>fl*(C[p].x-C[q].x));let l=null,r=null;
    if(c.length==2){l=nd(c[0]);r=nd(c[1])}else if(c.length==1){const s=nd(c[0]);(fl*(C[c[0]].x-C[i].x)<0?(l=s):(r=s))}
    return{i,l,r}};
  const root=nd(T.r);let lv=0,full=true,idx=new Set(),ht=0;
  (function f(u,d,p){idx.add(p);ht=Math.max(ht,d);if(!u.l&&!u.r)lv++;else if(!(u.l&&u.r))full=false;u.l&&f(u.l,d+1,p*2);u.r&&f(u.r,d+1,p*2+1)})(root,0,1);
  const comp=[...idx].every(p=>p<=n);
  const sg=u=>u?'('+sg(u.l)+sg(u.r)+')':'.';
  return{ok:true,root,n,sig:sg(root),info:`Nhận ra CÂY NHỊ PHÂN: ${n} nút · cao ${ht} · ${lv} lá`+(full?' · đầy đủ':'')+(comp?' · hoàn chỉnh':'')+(inf?' · đã tự nối đường':'')};
}

// ===== MÀU BẤT KỲ: "mực" = điểm khác màu giấy xung quanh (không chỉ tối hơn) → nét/nút đen, xanh, đỏ, vàng… đều thành mực =====
function colInk(ink,gray,w,h,col,lo){const N=w*h,W1=w+1,K=Math.max(24,w>>2),T=lo?70:110,H=new Int32Array(256);
  for(let i=0;i<N;i++)H[gray[i]]++;let c=0,v7=255;for(let i=0;i<256;i++){c+=H[i];if(c>=N*.7){v7=i;break}}
  const paper=new Uint8Array(N),P0=new Float64Array(W1*(h+1)),P1=new Float64Array(W1*(h+1)),P2=new Float64Array(W1*(h+1)),P3=new Float64Array(W1*(h+1));
  for(let i=0;i<N;i++)paper[i]=gray[i]>=v7*.75?1:0;                       // lần 1: giấy ≈ phần sáng; lần 2: giấy = mọi điểm chưa bị coi là mực
  for(let it=0;it<2;it++){
    for(let y=0;y<h;y++){let a=0,b=0,g=0,n=0;for(let x=0;x<w;x++){const i=y*w+x,q=i*4;if(paper[i]){a+=col[q];b+=col[q+1];g+=col[q+2];n++}const o=(y+1)*W1+x+1,u=y*W1+x+1;P0[o]=P0[u]+a;P1[o]=P1[u]+b;P2[o]=P2[u]+g;P3[o]=P3[u]+n}}
    const L=(h+1)*W1-1,gn=P3[L]||1,gr=P0[L]/gn,gg=P1[L]/gn,gb=P2[L]/gn;
    for(let y=0;y<h;y++){const y0=Math.max(0,y-K),y1=Math.min(h,y+K+1);for(let x=0;x<w;x++){const x0=Math.max(0,x-K),x1=Math.min(w,x+K+1),i=y*w+x,q=i*4,
      A=y1*W1+x1,B=y0*W1+x1,C=y1*W1+x0,D=y0*W1+x0,n=P3[A]-P3[B]-P3[C]+P3[D];let r=gr,g=gg,b=gb;
      if(n>25){r=(P0[A]-P0[B]-P0[C]+P0[D])/n;g=(P1[A]-P1[B]-P1[C]+P1[D])/n;b=(P2[A]-P2[B]-P2[C]+P2[D])/n}
      ink[i]=Math.abs(col[q]-r)+Math.abs(col[q+1]-g)+Math.abs(col[q+2]-b)>T?1:0}}
    if(!it)for(let i=0;i<N;i++)paper[i]=ink[i]?0:1}}
function fitC(q,st,tl,w,sx,sy,tol){const area=tl-st,cx=sx/area,cy=sy/area,fx=new Float64Array(32),fy=new Float64Array(32),fb=new Float64Array(32);
  for(let j=st;j<tl;j++){const i=q[j],dx=i%w-cx,dy=((i/w)|0)-cy,s=((Math.atan2(dy,dx)/6.2832+1)*32|0)%32,d=dx*dx+dy*dy;if(d>fb[s]){fb[s]=d;fx[s]=dx;fy[s]=dy}}
  if(fb.some(v=>v<=0))return null;
  let mx=0,my=0;for(let s=0;s<32;s++){mx+=fx[s];my+=fy[s]}mx/=32;my/=32;let xx=0,yy=0,xy=0;
  for(let s=0;s<32;s++){const a=fx[s]-mx,b=fy[s]-my;xx+=a*a;yy+=b*b;xy+=a*b}xx/=32;yy/=32;xy/=32;
  const tr=xx+yy,sq=Math.sqrt(Math.max(0,tr*tr/4-(xx*yy-xy*xy))),l1=tr/2+sq,l2=tr/2-sq;if(l2<=0)return null;
  const A=Math.SQRT2*Math.sqrt(l1),B=Math.SQRT2*Math.sqrt(l2);if(A/B>2.4||B<3)return null;
  const th=.5*Math.atan2(2*xy,xx-yy),co=Math.cos(th),si=Math.sin(th),mr=new Float64Array(32);
  for(let s=0;s<32;s++){const a=fx[s]-mx,b=fy[s]-my;mr[s]=Math.hypot((a*co+b*si)/A,(-a*si+b*co)/B)}
  const mean=mr.reduce((u,v)=>u+v)/32,sd=Math.sqrt(mr.reduce((u,v)=>u+(v-mean)**2,0)/32)/mean,fill=area/(Math.PI*A*B);
  if(sd>tol||fill<.35||fill>1.25)return null;
  return{x:cx+mx,y:cy+my,r:Math.max(A,B)+1.5}}
function solidNodes(dl,w,h,dd,cs){        // nút tô đặc hoặc vòng kín: lấp ruột → "mở" hình để cắt bỏ đường nối → còn lại các khối tròn = nút
  const N=w*h,S=new Uint8Array(dl),seen=new Uint8Array(N),q=new Int32Array(N);let qn=0;
  for(let s0=0;s0<N;s0++){if(dl[s0]||seen[s0])continue;                    // vùng nền kín (không chạm biên) nhỏ = ruột nút → lấp
    const st=qn;let hd=qn,tl=qn,bd=0;q[tl++]=s0;seen[s0]=1;
    while(hd<tl){const i=q[hd++],x=i%w,y=(i/w)|0;if(!x||!y||x==w-1||y==h-1)bd=1;
      if(x>0&&!dl[i-1]&&!seen[i-1]){seen[i-1]=1;q[tl++]=i-1}
      if(x<w-1&&!dl[i+1]&&!seen[i+1]){seen[i+1]=1;q[tl++]=i+1}
      if(y>0&&!dl[i-w]&&!seen[i-w]){seen[i-w]=1;q[tl++]=i-w}
      if(y<h-1&&!dl[i+w]&&!seen[i+w]){seen[i+w]=1;q[tl++]=i+w}}
    qn=tl;if(!bd&&tl-st<N/6)for(let j=st;j<tl;j++)S[q[j]]=1}
  const W1=w+1,I=new Int32Array(W1*(h+1));
  for(let y=0;y<h;y++){let s=0;for(let x=0;x<w;x++){s+=S[y*w+x];I[(y+1)*W1+x+1]=I[y*W1+x+1]+s}}
  const e=Math.max(4,(w/110|0)+dd),side=(2*e+1)*(2*e+1),core=new Uint8Array(N);let nc=0;
  for(let y=e;y<h-e;y++)for(let x=e;x<w-e;x++){const s=I[(y+e+1)*W1+x+e+1]-I[(y-e)*W1+x+e+1]-I[(y+e+1)*W1+x-e]+I[(y-e)*W1+x-e];if(s==side){core[y*w+x]=1;nc++}}
  if(!nc)return;
  const t=new Uint8Array(N),op=new Uint8Array(N);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let v=0;for(let j=-e;j<=e&&!v;j++){const X=x+j;if(X>=0&&X<w&&core[y*w+X])v=1}t[y*w+x]=v}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let v=0;for(let j=-e;j<=e&&!v;j++){const Y=y+j;if(Y>=0&&Y<h&&t[Y*w+x])v=1}op[y*w+x]=v&S[y*w+x]}
  seen.fill(0);qn=0;
  for(let s0=0;s0<N;s0++){if(!op[s0]||seen[s0])continue;
    const st=qn;let hd=qn,tl=qn,bd=0,sx=0,sy=0;q[tl++]=s0;seen[s0]=1;
    while(hd<tl){const i=q[hd++],x=i%w,y=(i/w)|0;sx+=x;sy+=y;if(!x||!y||x==w-1||y==h-1)bd=1;
      if(x>0&&op[i-1]&&!seen[i-1]){seen[i-1]=1;q[tl++]=i-1}
      if(x<w-1&&op[i+1]&&!seen[i+1]){seen[i+1]=1;q[tl++]=i+1}
      if(y>0&&op[i-w]&&!seen[i-w]){seen[i-w]=1;q[tl++]=i-w}
      if(y<h-1&&op[i+w]&&!seen[i+w]){seen[i+w]=1;q[tl++]=i+w}}
    qn=tl;const area=tl-st;if(bd||area<30||area>N/8)continue;
    const c=fitC(q,st,tl,w,sx,sy,.16);if(c)cs.push(c)}}
//#AN-END

// ================= AR (CAMERA HOẶC KHÔNG CẦN CAMERA) =================
const AC=document.createElement('canvas');
function grayOf(cv){const d=cv.getContext('2d',{willReadFrequently:true}).getImageData(0,0,cv.width,cv.height).data,o=new Uint8Array(cv.width*cv.height);for(let i=0,j=0;i<o.length;i++,j+=4)o[i]=(d[j]*77+d[j+1]*150+d[j+2]*29)>>8;return o}
function scanSrc(src,sw,sh,max=640,ds,los,crop,fs){const s0=max/Math.max(sw,sh);let s=s0,cx=0,cy=0,cw=sw,ch=sh;if(crop){cx=crop.x;cy=crop.y;cw=crop.w;ch=crop.h;s=Math.min(1,900/Math.max(cw,ch))}   // crop = KHUNG VÀNG (toạ độ ảnh gốc)
  AC.width=Math.round(cw*s);AC.height=Math.round(ch*s);AC.getContext('2d',{willReadFrequently:true}).drawImage(src,cx,cy,cw,ch,0,0,AC.width,AC.height);const r=analyze(grayOf(AC),AC.width,AC.height,ds,los,!!crop,AC.getContext('2d',{willReadFrequently:true}).getImageData(0,0,AC.width,AC.height).data,fs);let shp=0;{const g=grayOf(AC),W=AC.width,H=AC.height;let t=0,c=0;for(let y=1;y<H;y+=2)for(let x=1;x<W;x+=2){t+=Math.abs(g[y*W+x]-g[y*W+x-1])+Math.abs(g[y*W+x]-g[(y-1)*W+x]);c++}shp=t/c}
  if(crop){const f=s0/s;r.C.forEach(c=>{c.x=(c.x/s+cx)*s0;c.y=(c.y/s+cy)*s0;c.r=c.r/s*s0});r.dd=Math.max(1,Math.round((r.dd||2)*f))}
  r.sh=shp;r.s=crop?s0:s;return r}

let ocrW=null;
async function getOcr(){if(ocrW)return ocrW;
  if(!window.Tesseract)await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=ok;s.onerror=()=>no(new Error('không tải được Tesseract.js'));document.head.appendChild(s)});
  const w=await Tesseract.createWorker('eng');await w.setParameters({tessedit_char_whitelist:'0123456789',tessedit_pageseg_mode:'7'});return ocrW=w}
// Bước 3/3: thanh xác nhận số GỌN. Bấm ✔ → kiểm tra số, TỰ ĐỘNG cố định cây, rồi mới hiện các chức năng.
function cfm(msg){const L=lvl();
  bar(`<p style="margin:0 0 6px;font-size:13px">Bước 3/3 · ${msg} Đối chiếu số trên cây với giấy, sai thì sửa (theo từng mức, trái → phải, ${L.length} số):</p><input id="f1" value="${esc(L.map(x=>x.v).join(' '))}"><div style="display:flex;gap:6px;margin-top:8px"><button class="or" data-x="s3ok" style="flex:2">✔ Xác nhận & cố định</button><button data-x="s3re" style="flex:1">↻ Quét lại</button></div>`)}
X.s3ok=()=>{const L=lvl(),n=L.length,A=$('#f1').value.split(/[\s,;]+/).filter(Boolean).map(Number);
  if(A.length!=n||A.some(x=>!Number.isFinite(x)))return toast('Cần đúng '+n+' số');
  if(new Set(A).size<n)return toast('Có số trùng nhau — mỗi nút cần một số khác nhau');
  close();L.forEach((x,i)=>x.v=A[i]);document.body.classList.remove('cfm');   // hiện lại các chức năng
  afterScan();if(!isLocked&&lockFn)lockFn(true)};                              // tự động cố định, không cần bấm khóa
X.s3re=()=>{rescanFn&&rescanFn()};
async function readDigits(src,C,f,map){         // đọc số trong từng nút: cắt ruột nút, nhị phân hoá Otsu, thử 2 chế độ nhận dạng
  const my=scanId,n=C.length,v={};let got=0;
  const prep=c=>{const s=c.r*f*2.1,k=document.createElement('canvas');k.width=k.height=160;const g=k.getContext('2d',{willReadFrequently:true});
    g.fillStyle='#fff';g.fillRect(0,0,160,160);g.drawImage(src,c.x*f-s/2,c.y*f-s/2,s,s,0,0,160,160);
    const im=g.getImageData(0,0,160,160),d=im.data,R=76*.88,H=new Int32Array(256),gy=new Uint8Array(25600);let tot=0;
    for(let y=0;y<160;y++)for(let x=0;x<160;x++){const i=y*160+x,q=i*4,l=(d[q]*77+d[q+1]*150+d[q+2]*29)>>8;gy[i]=l;if(Math.hypot(x-80,y-80)<R){H[l]++;tot++}}
    let sm=0;for(let i=0;i<256;i++)sm+=i*H[i];let wb=0,sb=0,mx=0,th=128;
    for(let i=0;i<256;i++){wb+=H[i];if(!wb)continue;const wf=tot-wb;if(!wf)break;sb+=i*H[i];const m1=sb/wb,m2=(sm-sb)/wf,bv=wb*wf*(m1-m2)*(m1-m2);if(bv>mx){mx=bv;th=i}}
    let blk=0;const bw=new Uint8Array(25600);
    for(let y=0;y<160;y++)for(let x=0;x<160;x++){const i=y*160+x,ins=Math.hypot(x-80,y-80)<R;bw[i]=ins&&gy[i]<=th?1:0;blk+=bw[i]}
    const inv=blk>tot*.5;for(let i=0;i<25600;i++){const q=i*4,b=inv?(Math.hypot(i%160-80,((i/160)|0)-80)<R&&!bw[i]):bw[i],c=b?0:255;d[q]=d[q+1]=d[q+2]=c;d[q+3]=255}
    g.putImageData(im,0,0);return k};
  try{const w=await getOcr();
    for(let i=0;i<n;i++){if(my!=scanId)return false;const rd=$('#rd');if(rd)rd.textContent=`${i+1}/${n}`;const k=prep(C[i]);let best=null;
      for(const m of['7','10']){await w.setParameters({tessedit_pageseg_mode:m});const {data}=await w.recognize(k),t=data.text.replace(/\D/g,'');
        if(t&&t.length<=3&&(!best||data.confidence>best.c))best={t,c:data.confidence};if(best&&best.c>70)break}
      if(best&&best.c>30){v[i]=+best.t;got++}}
  }catch(e){if(my!=scanId)return false;cfm('⚠ Không đọc tự động được số ('+e.message+') — hãy nhập số theo giấy.');return}
  if(my!=scanId)return false;
  const cnt={};Object.values(v).forEach(x=>cnt[x]=(cnt[x]||0)+1);const dup=Object.keys(cnt).filter(x=>cnt[x]>1);
  const used=new Set(Object.values(v));let nx=1;
  Object.keys(map).forEach(i=>{if(v[i]==null||dup.includes(String(v[i]))){while(used.has(nx))nx++;v[i]=nx;used.add(nx)}map[i].v=v[i]});
  clear();refresh();const ino=inord().map(n=>n.v);
  cfm(got<Math.ceil(n*.7)?`⚠ Chỉ đọc được ${got}/${n} số, các số còn lại là số tạm.`:dup.length?'⚠ Có số đọc trùng nhau nên đã đổi tạm.':`🔤 Đã đọc ${got}/${n} số`+(ino.every((x,i)=>!i||x>ino[i-1])&&n>1?' · cây này cũng là BST':'')+'.')}

async function loadLibs(){try{THREE=await import('three');stt('✅ Sẵn sàng');$('#bAR').disabled=false;$('#bDemo').disabled=false}catch(e){stt('❌ Không tải được Three.js ('+(e&&e.message||e)+'). Kiểm tra mạng rồi tải lại trang.')}}
loadLibs();
const cxMk=()=>['#tools','#trav','#info','#code'].forEach(q=>{const p=$(q);if(p&&!p.querySelector(':scope>.cx')){const b=document.createElement('button');b.className='cx';b.textContent=p.classList.contains('cl')?'▸':'▾';b.title='Ẩn / hiện khung này';p.prepend(b)}});
['#tools','#trav','#info','#code'].forEach(q=>new MutationObserver(cxMk).observe($(q),{childList:true}));cxMk();
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.cx');if(!b)return;const p=b.parentElement;p.classList.toggle('cl');if(b.classList.contains('tgl')){ui()}else{b.textContent=p.classList.contains('cl')?'▸':'▾';ui()}});

// giữ lâu (≥0.5s) một nút để xem ghi chú tác dụng — không kích hoạt nút đó
(()=>{let t=0,fired=null;const clr=()=>clearTimeout(t);
 document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('button[title]');clr();fired=null;if(!b)return;t=setTimeout(()=>{fired=b;toast('ℹ '+b.title)},500)},true);
 ['pointerup','pointercancel'].forEach(k=>document.addEventListener(k,clr,true));
 document.addEventListener('click',e=>{if(fired&&e.target.closest&&e.target.closest('button[title]')===fired){e.stopPropagation();e.preventDefault()}fired=null},true);
 document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('button[title]'))e.preventDefault()})})();
$('#bAR').onclick=()=>startAR(true);$('#bDemo').onclick=()=>startAR(false);

async function startAR(useCam){
  $('#err').style.display='none';rescanBtn.hidden=false;let stream,vid,renderer,ovl,running=true;
  try{
    if(useCam){
      if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error('Trình duyệt đang chặn camera. Hãy mở bằng https:// hoặc http://localhost, dùng Chrome hoặc Safari, không dùng trình duyệt trong Zalo/Facebook. (Hoặc chọn "Không cần camera")');
      if(!(await navigator.mediaDevices.enumerateDevices()).some(d=>d.kind=='videoinput'))throw new Error('Thiết bị này không có camera — hãy chọn "Không cần camera".');
    }
    $('#start').style.display='none';
    if(useCam){
      document.body.classList.add('scan');load('📷 Đang bật camera...<br><small>Hãy bấm <b>Cho phép</b> khi trình duyệt hỏi quyền camera</small>');
      stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
      vid=document.createElement('video');vid.playsInline=true;vid.muted=true;vid.srcObject=stream;await vid.play();load('');
      vid.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover';$('#ar').append(vid);
    }else{document.body.classList.remove('scan');applyTheme()}
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    ovl=document.createElement('canvas');const og=ovl.getContext('2d');
    renderer.domElement.style.cssText='position:absolute;inset:0';ovl.style.cssText='position:absolute;inset:0;pointer-events:none';
    $('#ar').append(renderer.domElement,ovl);
    // camera phối cảnh: mặt phẳng z=0 khớp 1:1 với pixel màn hình → cây có chiều sâu thật
    const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,10,50000);let SW=1,SH=1;const ROI={x:0,y:0,w:0,h:0};
    const fit=()=>{SW=innerWidth;SH=innerHeight;renderer.setSize(SW,SH);ovl.width=SW;ovl.height=SH;cam.aspect=SW/SH;cam.position.set(SW/2,-SH/2,SH/2/Math.tan(cam.fov*Math.PI/360));cam.updateProjectionMatrix();if(!ROI.w){ROI.x=SW*.08;ROI.y=SH*.22;ROI.w=SW*.84;ROI.h=SH*.52}ui()};fit();addEventListener('resize',fit);
    scene.add(new THREE.AmbientLight(0xffffff,.85));const sun=new THREE.DirectionalLight(0xffffff,1.2);sun.position.set(.4,.9,1.5);scene.add(sun);
    const rig=new THREE.Group(),tilt=new THREE.Group(),spin=new THREE.Group(),content=new THREE.Group(),slots=new THREE.Group();
    rig.add(tilt);tilt.add(spin);spin.add(content,slots);scene.add(rig);rig.visible=false;
    // ---- tài nguyên 3D ----
    const geoS=new THREE.SphereGeometry(1,32,24),geoB=new THREE.BoxGeometry(1,1,1),geoC=new THREE.CylinderGeometry(1,1,1,8).translate(0,.5,0);
    const em=(c,i,o=1)=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:i,transparent:o<1,opacity:o,roughness:.3});
    const mEn=em('#748ffc',.8,.9),mEg=em('#ff922b',1.2),mEs=em('#ffa94d',1.4),mSlot=new THREE.MeshBasicMaterial({color:'#748ffc',transparent:true,opacity:.16});
    const tc={},labTex=(t,col='#fff')=>{const k=t+col;if(tc[k])return tc[k];const c=document.createElement('canvas');c.width=256;c.height=128;const g=c.getContext('2d');let f=92;g.font=`bold ${f}px sans-serif`;while(g.measureText(t).width>236&&f>28)g.font=`bold ${f-=6}px sans-serif`;
      g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=12;g.strokeStyle='#07202c';g.strokeText(t,128,68);g.fillStyle=col;g.fillText(t,128,68);const x=new THREE.CanvasTexture(c);x.colorSpace=THREE.SRGBColorSpace;return tc[k]=x};
    const rc=document.createElement('canvas');rc.width=rc.height=128;const rg=rc.getContext('2d');rg.strokeStyle='#f76707';rg.lineWidth=9;rg.shadowColor='#ff922b';rg.shadowBlur=14;rg.beginPath();rg.arc(64,64,52,0,7);rg.stroke();const ringTex=new THREE.CanvasTexture(rc);
    const O={},E={},dying=[];let hits=[];
    const newO=()=>{const g=new THREE.Group(),m1=new THREE.MeshStandardMaterial({roughness:.25,metalness:.2}),sph=new THREE.Mesh(geoS,m1),
      m2=new THREE.MeshBasicMaterial({transparent:true,opacity:.3,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false}),glow=new THREE.Mesh(geoS,m2);glow.scale.setScalar(1.3);sph.add(glow);
      const sp=()=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false}));s.renderOrder=5;return s};
      const lab=sp(),pl=sp(),pr=sp(),mr=new THREE.MeshStandardMaterial({roughness:.3}),rec=new THREE.Group();
      [-1,0,1].forEach(i=>{const b=new THREE.Mesh(geoB,mr);b.scale.set(.96,1.2,.5);b.position.x=i;rec.add(b)});
      pl.position.set(-1,0,.4);pr.position.set(1,0,.4);pl.scale.set(.9,.45,1);pr.scale.set(.9,.45,1);rec.add(pl,pr);
      const ring=new THREE.Sprite(new THREE.SpriteMaterial({map:ringTex,transparent:true,depthTest:false}));ring.renderOrder=6;ring.visible=false;
      const hit=new THREE.Mesh(geoS,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
      g.add(sph,rec,lab,ring,hit);content.add(g);return{g,m1,m2,mr,sph,rec,lab,pl,pr,ring,hit,t:new THREE.Vector3(),a:{sph:0,rec:0,lab:0},b:{sph:0,rec:0,lab:0},spin:0}};
    const newE=()=>{const g=new THREE.Group(),cyl=new THREE.Mesh(geoC,mEn);g.add(cyl);content.add(g);return{g,cyl}};
    sync=()=>{
      const a=lvl(),n=a.length,v=S.view,st=S.steps[S.i],vis=(st&&st.out)||[],cu=st&&st.cur,rs=st&&st.res,Lm={};
      inord().forEach((x,i)=>Lm[x.id]={x:i,d:0,z:0,k:0});
      a.forEach(x=>{const e=Lm[x.id];[['l',1,1],['r',-1,2]].forEach(([s,g,o])=>{const c=x[s];if(c){const q=Lm[c.id];q.d=e.d+1;q.z=e.z+g*.07/(1+e.d*.6);q.k=2*e.k+o;q.p=x.id;q.left=s=='l'}})});
      const md=Math.max(0,...a.map(x=>Lm[x.id].d)),gx=Math.min(.3,.9/Math.max(n-1,1)),gy=Math.min(.2,.5/Math.max(md,1)),r=Math.min(.065,gx*.4,gy*.4),cw=Math.min(gx*.3,.05);
      const mxk=Math.max(0,...a.map(x=>Lm[x.id].k)),N=Math.min(mxk+1,48),cols=Math.min(8,N)||1,rows=Math.ceil(N/cols)||1,cs=Math.min(.12,.95/cols,.7/(rows*1.25));
      if(v=='arr'&&mxk>=48&&!sync.w){sync.w=1;toast('Cây quá lệch: mảng cần '+(mxk+1)+' ô, chỉ hiển thị 48 ô đầu')}
      const UP=v=='tree'&&root&&root.P0;
      if(UP)a.forEach(x=>[x.l,x.r].forEach((c,j)=>{if(c&&!c.P0){const q=x.P0;c.P0=[q[0]+(j?1:-1)*TL.dx,q[1]-TL.dy,0];for(let t=0;t<14&&a.some(o=>o!==c&&o.P0&&Math.hypot(o.P0[0]-c.P0[0],o.P0[1]-c.P0[1])<TL.r*2.1);t++)c.P0[0]+=(j?1:-1)*TL.r*2.2}}));
      const live=new Set(),ptr=v=='ptr';hits=[];
      a.forEach(x=>{const e=Lm[x.id],id=x.id;live.add(id);let tx=(e.x-(n-1)/2)*gx,ty=(md/2-e.d)*gy,tz=e.z,rad=UP?TL.r:r,hide=0;
        if(v=='arr'){if(e.k<N){tx=(e.k%cols-(cols-1)/2)*cs;ty=((rows-1)/2-(e.k/cols|0))*cs*1.25;tz=0;rad=cs*.38}else hide=1}
        else if(x.P){tx=x.P[0];ty=x.P[1];tz=x.P[2]}
        else if(UP&&x.P0){tx=x.P0[0];ty=x.P0[1];tz=e.z*.3}                       // nút đã được kéo tới vị trí riêng
        let o=O[id];if(!o){o=O[id]=newO();o.g.position.set(tx,ty+(S.grow?-.5:.5),tz)}
        o.t.set(tx,ty,tz);o.b={sph:hide||ptr?0:rad,rec:hide||!ptr?0:cw,lab:hide?0:ptr?cw*.9:rad};o.rad=rad;o.hide=hide;
        if(S.spin==id)o.spin=1;
        const inV=vis.includes(id),lf=!x.l&&!x.r,c=rs=='no'&&inV?'#fa5252':id==cu?(rs=='ok'?'#94d82d':'#ff6b35'):inV?'#ffd43b':x===root?'#fab005':lf?'#40c057':'#4dabf7',ei=(id==cu?1:inV?.7:.5)*S.bright;
        [o.m1,o.mr].forEach(m=>{m.color.set(c);m.emissive.set(c);m.emissiveIntensity=ei});o.m2.color.set(c);o.m2.opacity=.12+.12*S.bright;
        o.lab.material.map=labTex(trunc(disp(x)));o.lab.material.needsUpdate=true;
        o.pl.material.map=labTex(x.l?'●':'∅',x.l?'#ffc93c':'#ff8a9a');o.pr.material.map=labTex(x.r?'●':'∅',x.r?'#ffc93c':'#ff8a9a');o.pl.material.needsUpdate=o.pr.material.needsUpdate=true;
        o.hit.scale.setScalar(Math.max(ptr?cw*1.8:rad*1.7,.05));o.hit.userData.id=id;if(!hide)hits.push(o.hit)});
      Object.keys(E).forEach(id=>{if(!live.has(+id)||!Lm[id].p){content.remove(E[id].g);delete E[id]}});
      a.forEach(x=>{const e=Lm[x.id];if(!e.p)return;const q=E[x.id]||(E[x.id]=newE());q.pid=e.p;q.left=e.left;
        q.cyl.material=vis.includes(x.id)&&vis.includes(e.p)?mEg:S.sel==x.id||S.sel==e.p?mEs:mEn});
      Object.keys(O).forEach(id=>{if(!live.has(+id)){const o=O[id];delete O[id];o.m1.color.set('#fa5252');o.m1.emissive.set('#fa5252');o.b={sph:0,rec:0,lab:0};o.ring.visible=false;dying.push({o,f:60})}});
      while(slots.children.length){const c=slots.children[0];slots.remove(c);if(c.isSprite)c.material.dispose()}
      if(v=='arr')for(let i=0;i<N;i++){const x=(i%cols-(cols-1)/2)*cs,y=((rows-1)/2-(i/cols|0))*cs*1.25,b=new THREE.Mesh(geoB,mSlot);b.scale.set(cs*.92,cs*.92,cs*.2);b.position.set(x,y,-.03);
        const t=new THREE.Sprite(new THREE.SpriteMaterial({map:labTex('['+i+']','#9fe8ff'),transparent:true,depthTest:false}));t.scale.set(cs*.8,cs*.4,1);t.position.set(x,y-cs*.58,0);slots.add(b,t)}
      S.grow=0;S.spin=null;
    };
    const stepO=o=>{o.g.position.lerp(o.t,.15);for(const k in o.b)o.a[k]+=(o.b[k]-o.a[k])*.17;
      o.sph.scale.setScalar(Math.max(o.a.sph,1e-4));o.sph.rotation.y=o.spin>0?(o.spin-=.025)*12:0;o.rec.scale.setScalar(Math.max(o.a.rec,1e-4));
      o.lab.scale.set(o.a.lab*2.6,o.a.lab*1.3,1);o.lab.position.z=S.view=='ptr'?o.a.rec*.4:o.a.sph*1.05;
      o.sph.visible=o.a.sph>.002;o.rec.visible=o.a.rec>.002;o.lab.visible=o.a.lab>.002};
    const A=new THREE.Vector3(),B=new THREE.Vector3(),Y=new THREE.Vector3(0,1,0);
    const frame=()=>{
      if(M){const X0=(qr*M.cx-qi*M.cy+tx)*G.a+G.ox,Y0=(qi*M.cx+qr*M.cy+ty)*G.a+G.oy;rig.position.set(X0,-Y0,0);rig.rotation.z=-Math.atan2(qi,qr)+S.roll;rig.scale.setScalar(M.pxS*Math.hypot(qr,qi)*G.a*S.size*S.zoom)}
      else{rig.position.set(SW/2,-SH/2,0);rig.rotation.z=S.roll;rig.scale.setScalar(Math.min(SW,SH)*.95*S.size*S.zoom)}
      rig.position.x+=S.px;rig.position.y-=S.py;                          // dời cả cây bằng cách kéo vào chỗ trống
      tilt.rotation.x=(root&&root.P0&&S.view=='tree'?0:-.32)+S.pitch;spin.rotation.y=S.yaw;
      for(const id in O){const o=O[id];stepO(o);{const fl=S.flash>Date.now(),pu=fl&&S.sel!=+id?1+.18*Math.sin(Date.now()/110):1;o.ring.visible=(S.sel==+id||fl)&&!o.hide;o.ring.scale.setScalar((S.view=='ptr'?o.a.rec*3.6:o.a.sph*3.1+.001)*pu)}}
      for(let i=dying.length-1;i>=0;i--){const d=dying[i];stepO(d.o);if(--d.f<=0){content.remove(d.o.g);dying.splice(i,1)}}
      const arr=S.view=='arr',ptr=S.view=='ptr';
      for(const id in E){const e=E[id],c=O[id],p=O[e.pid];if(!c||!p||arr){e.g.visible=false;continue}
        A.copy(p.g.position);B.copy(c.g.position);if(ptr){A.x+=(e.left?-1:1)*p.a.rec;A.y-=p.a.rec*.6;B.y+=c.a.rec*.6}
        B.sub(A);const L=B.length();if(L<1e-4){e.g.visible=false;continue}e.g.visible=true;e.g.position.copy(A);e.g.quaternion.setFromUnitVectors(Y,B.normalize());
        e.cyl.scale.set(.006,L,.006)}
      renderer.render(scene,cam)};
    sync();
    let pend=false,fail=0,mode='scan',locked=false,stable=0,lastSig='',M=null,qr=1,qi=0,tx=0,ty=0,lost=0,busy=false,G={a:1,ox:0,oy:0};
    const hud=$('#hud'),say=(m,ms)=>{clearTimeout(say.h);hud.style.display=m?'block':'none';hud.innerHTML=m;if(m&&ms)say.h=setTimeout(()=>{hud.style.display='none'},ms)};hud.onclick=()=>{hud.style.display='none'};
    // ---- KHUNG VÀNG: chỉ quét vùng người dùng khoanh (kéo khung để dời, kéo chấm góc để đổi cỡ) ----
    const drawFrame=()=>{og.save();og.strokeStyle='#ffc93c';og.lineWidth=3;og.setLineDash([10,6]);og.strokeRect(ROI.x,ROI.y,ROI.w,ROI.h);og.setLineDash([]);og.fillStyle='#ffc93c';og.beginPath();og.arc(ROI.x+ROI.w,ROI.y+ROI.h,14,0,7);og.fill();og.restore()};
    const roiSrc=(vw,vh)=>{const k=Math.max(SW/vw,SH/vh),ox=(SW-vw*k)/2,oy=(SH-vh*k)/2,x0=Math.max(0,(ROI.x-ox)/k),y0=Math.max(0,(ROI.y-oy)/k),x1=Math.min(vw,(ROI.x+ROI.w-ox)/k),y1=Math.min(vh,(ROI.y+ROI.h-oy)/k);return{x:x0,y:y0,w:Math.max(40,x1-x0),h:Math.max(40,y1-y0)}};
    const drawDet=(r,vw,vh)=>{const k=Math.max(SW/vw,SH/vh),a=k/r.s,ox=(SW-vw*k)/2,oy=(SH-vh*k)/2,P=c=>[c.x*a+ox,c.y*a+oy];
      og.clearRect(0,0,SW,SH);drawFrame();og.lineWidth=3;og.strokeStyle='#ff4d8d';
      const seg=(i,j)=>{const p=P(r.C[i]),q=P(r.C[j]);og.beginPath();og.moveTo(p[0],p[1]);og.lineTo(q[0],q[1]);og.stroke()};
      if(r.tr.ok)(function z(u){[u.l,u.r].forEach(c=>{if(c){seg(u.i,c.i);z(c)}})})(r.tr.root);else r.ed.forEach(([i,j])=>seg(i,j));
      og.strokeStyle='#27d7a1';r.C.forEach(c=>{const p=P(c);og.beginPath();og.arc(p[0],p[1],c.r*a,0,7);og.stroke()})};
    const fitSim=pr=>{const n=pr.length,mx=pr.reduce((u,p)=>u+p[0].x,0)/n,my=pr.reduce((u,p)=>u+p[0].y,0)/n,cx=pr.reduce((u,p)=>u+p[1].x,0)/n,cy=pr.reduce((u,p)=>u+p[1].y,0)/n;
      let a1=0,a2=0,dn=0,nr=qr,ni=qi;pr.forEach(([m,c])=>{const ux=m.x-mx,uy=m.y-my,vx=c.x-cx,vy=c.y-cy;a1+=ux*vx+uy*vy;a2+=ux*vy-uy*vx;dn+=ux*ux+uy*uy});
      if(n>=2&&dn>1e-6){const k=Math.hypot(a1,a2)/dn;if(k>.3&&k<3){nr=a1/dn;ni=a2/dn}}
      return[nr,ni,cx-(nr*mx-ni*my),cy-(ni*mx+nr*my)]};   // phép biến đổi đồng dạng (xoay + co giãn + dịch) từ nút lúc quét → nút hiện tại
    const ransac=(MP,C)=>{                                       // định vị lại khi chỉ thấy một phần hình: thử giả thuyết đồng dạng từ từng cặp nút, chọn giả thuyết nhiều điểm khớp nhất
      let best=null,bn=0;const need=Math.max(3,Math.ceil(.6*Math.min(MP.length,C.length)));
      for(let a=0;a<MP.length;a++)for(let b=0;b<MP.length;b++){if(a==b)continue;const A=MP[a],B=MP[b],zx=B.x-A.x,zy=B.y-A.y,zz=zx*zx+zy*zy;if(zz<1)continue;
        for(let c=0;c<C.length;c++)for(let d=0;d<C.length;d++){if(c==d)continue;const wx=C[d].x-C[c].x,wy=C[d].y-C[c].y,qa=(wx*zx+wy*zy)/zz,qb=(wy*zx-wx*zy)/zz,sc=Math.hypot(qa,qb);
          if(sc<.4||sc>2.5||sc*A.r<C[c].r*.65||sc*A.r>C[c].r*1.5||sc*B.r<C[d].r*.65||sc*B.r>C[d].r*1.5)continue;
          const tx0=C[c].x-(qa*A.x-qb*A.y),ty0=C[c].y-(qb*A.x+qa*A.y);let k=0;
          for(const m of MP){const px=qa*m.x-qb*m.y+tx0,py=qb*m.x+qa*m.y+ty0,tol=Math.max(6,sc*m.r*.8);if(C.some(q=>Math.hypot(q.x-px,q.y-py)<tol))k++}
          if(k>bn){bn=k;best=[qa,qb,tx0,ty0]}}}
      if(!best||bn<need)return null;
      const pp=[];MP.forEach(m=>{const px=best[0]*m.x-best[1]*m.y+best[2],py=best[1]*m.x+best[0]*m.y+best[3];let q=null,bd=Math.max(6,Math.hypot(best[0],best[1])*m.r*.8);C.forEach(c=>{const d=Math.hypot(c.x-px,c.y-py);if(d<bd){bd=d;q=c}});if(q)pp.push([m,q])});
      return pp.length>=2?fitSim(pp):best};
    // ---- Bước 2/3: thanh xác nhận HÌNH gọn ở đáy; hình nhận diện vẫn hiện ngay trên giấy để đối chiếu ----
    const ask2=(r,snap)=>{pend=true;say('');const ms=libMatch(r.tr.root,r.C);
      bar(`<p style="margin:0 0 6px;font-size:13px">Bước 2/3 · ${esc(r.tr.info)}. Đối chiếu với giấy: <b>đủ nút</b> và <b>nối đúng</b> chưa? (vòng xanh = nút, nét hồng = đường nối)</p>`+
        (ms.length?`<p style="margin:0 0 5px;font-size:13px">📚 Giống hình trong sách — chọn đúng hình để dùng luôn số chuẩn:</p>`+ms.map((m,k)=>`<button ${k?'':'class="or" '}data-x="lib${k}" style="width:100%;margin-bottom:5px;text-align:left">📚 ${esc(m.L.n)} · giống ${Math.round(m.sim*100)}%</button>`).join(''):'')+
        `<div style="display:flex;gap:6px"><button ${ms.length?'':'class="or" '}data-x="s2ok" style="flex:2">${ms.length?'Dùng cây vừa quét':'✔ Đúng, dùng cây này'}</button><button data-x="s2re" style="flex:1">↻ Quét lại</button></div>`);
      ms.forEach((m,k)=>X['lib'+k]=()=>{close();accept(r,snap,m.L)});
      X.s2ok=()=>{close();accept(r,snap)};
      X.s2re=()=>{close();pend=false;stable=0;lastSig='';og.clearRect(0,0,SW,SH);drawFrame();say('🔍 Quét lại…',1500)}};
    const accept=(r,snap,L)=>{const vw=snap.width,vh=snap.height;const xs=r.C.flatMap(c=>[c.x-c.r,c.x+c.r]),ys=r.C.flatMap(c=>[c.y-c.r,c.y+c.r]),bw=Math.max(...xs)-Math.min(...xs),bh=Math.max(...ys)-Math.min(...ys);
            M={dd:r.dd,lo:r.lo||0,sm:r.sm||0,pts:r.C.map(c=>({x:c.x,y:c.y,r:c.r})),tree:r.tr.root,sig:r.tr.sig,cx:(Math.max(...xs)+Math.min(...xs))/2,cy:(Math.max(...ys)+Math.min(...ys))/2,pxS:Math.max(bw*1.18,bh*1.18/.77,60)};
            qr=1;qi=0;tx=ty=0;lost=0;mode='track';pend=false;og.clearRect(0,0,SW,SH);rig.visible=true;
            document.body.classList.remove('scan');document.body.classList.add('cfm');   // cây 3D hiện ra, chức năng CHƯA hiện cho tới khi xác nhận số
            if(L){adoptLib(L,r.tr,r.C,M);locked=false;isLocked=false;document.body.classList.remove('locked','cfm');say('');ui();toast('📚 Đã nhận hình: '+L.n+' — dùng số chuẩn của sách');if(lockFn)lockFn(true);return}
            const map=adopt(r.tr,r.C,M);locked=false;isLocked=false;document.body.classList.remove('locked');say('');ui();
            ++scanId;bar('<p style="margin:0 0 8px;font-size:13px">Bước 3/3 · 🔤 Đang đọc số trong các nút… <b id="rd"></b></p><button data-x="s3re" style="width:100%">↻ Quét lại</button>');
            readDigits(snap,r.C,1/r.s,map)};
    const step=()=>{
      const vw=vid.videoWidth,vh=vid.videoHeight;if(!vw)return;
      const isS=mode=='scan',r=scanSrc(vid,vw,vh,640,isS?undefined:[M.dd||2],isS?undefined:[M.lo||0],isS?roiSrc(vw,vh):null,isS?undefined:(M.sm?1:0)),k=Math.max(SW/vw,SH/vh),a=k/r.s,ox=(SW-vw*k)/2,oy=(SH-vh*k)/2;G={a,ox,oy};
      if(isS){
        if(pend)return;
        drawDet(r,vw,vh);
        if(r.tr.ok){fail=0;stable=r.tr.sig==lastSig?stable+1:1;lastSig=r.tr.sig;say(`Bước 1/3 · 🌳 Đang xác nhận cây nhị phân (${r.tr.n} nút${r.extra?`, bỏ qua ${r.extra} nút ngoài cây`:''})… ${Math.min(stable,4)}/4`);
          if(stable>=4&&!pend){const snap=document.createElement('canvas');snap.width=vw;snap.height=vh;snap.getContext('2d').drawImage(vid,0,0);
            ask2(r,snap)}}
        else{stable=0;lastSig='';fail++;say(r.C.length?`Bước 1/3 · 🔍 Thấy ${r.C.length} nút, ${r.ed.length} đường nối — ${r.tr.msg}`:(r.sh<2.2?'🌫 Ảnh đang mờ — giữ máy yên, lau ống kính, hoặc bấm 📸 Chụp quét / 🖼 Tải ảnh':'Bước 1/3 · 🔍 Đưa hình cây vào KHUNG VÀNG (kéo khung để dời, kéo chấm góc để đổi cỡ)')+(fail>25?'<br><small>Quét mãi không được? Bấm 📸 Chụp quét, 🖼 Tải ảnh hoặc ⌨ Nhập tay</small>':''))}
        return}
      if(r.tr.ok&&r.tr.sig==M.sig){const pp=[];(function z(a,b){if(!a||!b)return;pp.push([M.pts[a.i],r.C[b.i]]);z(a.l,b.l);z(a.r,b.r)})(M.tree,r.tr.root);
        if(pp.length>=2){const[nr,ni,nx,ny]=fitSim(pp),al=lost>0?1:.85;qr+=(nr-qr)*al;qi+=(ni-qi)*al;tx+=(nx-tx)*al;ty+=(ny-ty)*al;if(lost>=8)say('');lost=0;return}}
      const pr=[],used=new Set();                                   // theo dõi: ghép nút cũ ↔ nút mới
      M.pts.forEach(m=>{const px=qr*m.x-qi*m.y+tx,py=qi*m.x+qr*m.y+ty,sc=Math.hypot(qr,qi);let b=-1,bd=sc*m.r*1.6+8;
        r.C.forEach((c,j)=>{if(used.has(j))return;const d=Math.hypot(c.x-px,c.y-py);if(d<bd){bd=d;b=j}});if(b>=0){used.add(b);pr.push([m,r.C[b]])}});
      if(pr.length>=Math.max(1,Math.ceil(M.pts.length*.5))){
        const[nr,ni,nx,ny]=fitSim(pr),al=.8;qr+=(nr-qr)*al;qi+=(ni-qi)*al;tx+=(nx-tx)*al;ty+=(ny-ty)*al;
        if(lost>=8)say('');lost=0;
      }else{lost++;
        if(r.C.length>=3){const T=ransac(M.pts,r.C);if(T){[qr,qi,tx,ty]=T;lost=0;say('');return}}
        if(lost==8&&!locked)say('⚠ Mất dấu hình — đưa hình trở lại khung (chạm dòng này để tắt)',3500);
        if(lost>=8&&r.tr.ok&&r.tr.sig==M.sig){                       // thấy lại đúng cây: ghép theo cấu trúc cha–con để định vị lại ngay
          const pp=[];(function z(a,b){if(!a||!b)return;pp.push([M.pts[a.i],r.C[b.i]]);z(a.l,b.l);z(a.r,b.r)})(M.tree,r.tr.root);
          [qr,qi,tx,ty]=fitSim(pp);lost=0;say('')}}
    };
    const tick=()=>{if(!running)return;if(!locked&&!busy){busy=true;try{step()}catch(e){console.error(e)}busy=false}setTimeout(tick,mode=='scan'?200:120)};
    const fromStill=(src,iw,ih,snap,crop,ask)=>{                  // quét ảnh tĩnh độ phân giải cao (ảnh chụp hoặc ảnh tải lên)
      const r=scanSrc(src,iw,ih,1280,[2,4,8],undefined,crop),f=.5;r.C.forEach(c=>{c.x*=f;c.y*=f;c.r*=f});r.s*=f;r.dd=Math.max(1,(r.dd||2)>>1);
      if(!r.tr.ok){toast('Chưa nhận ra cây: '+r.tr.msg+(r.sh<2.2?' (ảnh mờ)':''));return null}
      if(ask){drawDet(r,iw,ih);ask2(r,snap)}else{const ms=libMatch(r.tr.root,r.C),m=ms[0];accept(r,snap,m&&m.sim>=.85&&(!ms[1]||m.sim-ms[1].sim>=.15)?m.L:undefined)}return r};
    $('#bMan').onclick=()=>{if(mode!='scan')return;root=parseStr('1(2(3,4),5)');S.orig=clone(root);S.view='tree';S.sel=null;S.grow=1;mode='track';locked=true;isLocked=true;pend=false;M=null;rig.visible=true;og.clearRect(0,0,SW,SH);document.body.classList.remove('scan');document.body.classList.add('locked');say('');clear();refresh();OP.str()};
    $('#bSnap').onclick=()=>{if(mode!='scan'||!vid.videoWidth)return toast('Chỉ chụp quét được khi đang ở chế độ quét camera');if(pend)return;
      const vw=vid.videoWidth,vh=vid.videoHeight,snap=document.createElement('canvas');snap.width=vw;snap.height=vh;snap.getContext('2d').drawImage(vid,0,0);
      fromStill(snap,vw,vh,snap,roiSrc(vw,vh),true)};
    // Tải ảnh: A = cây có nút hình tròn (quy trình nhận diện hiện tại); B = chữ số viết trực tiếp trên giấy.
    async function readPaperDigits(imageCanvas){
      const worker=await getOcr();
      await worker.setParameters({tessedit_char_whitelist:'0123456789',tessedit_pageseg_mode:'11'});
      const {data}=await worker.recognize(imageCanvas);
      return (data.words||[]).map(w=>{
        const text=String(w.text||'').trim(), b=w.bbox||{};
        return {text,value:Number(text),confidence:Number(w.confidence)||0,
          x:((b.x0||0)+(b.x1||0))/2,y:((b.y0||0)+(b.y1||0))/2};
      }).filter(x=>/^\d{1,3}$/.test(x.text)&&Number.isFinite(x.value))
        .sort((a,b)=>a.y-b.y||a.x-b.x);
    }
    function countTree(n){return n?1+countTree(n.l)+countTree(n.r):0}
    function loadPaperTree(snap,items){
      const detected=items.map(x=>x.text).join('  ');
      const suggestion=prompt(
        'OCR đọc được các số (theo vị trí gần từ trên xuống):\n'+(detected||'(chưa đọc được số nào)')+
        '\n\nNhập cấu trúc cây để web dựng 3D. Ví dụ: 8(3(1,6),10)\n'+
        'Cú pháp: gốc(con_trái,con_phải); để trống nếu thiếu nút, ví dụ 8(,10).',
        ''
      );
      if(suggestion===null)return;
      let parsed;
      try{parsed=parseStr(suggestion)}catch(e){toast('Không phân tích được cấu trúc cây.');return}
      if(!parsed||!Number.isFinite(Number(parsed.v))||countTree(parsed)<1||String(suggestion).replace(/\s+/g,'')!==treeStr(parsed)){toast('Cấu trúc cây chưa hợp lệ hoặc còn ký tự thừa. Ví dụ: 8(3(1,6),10)');return}
      // Chỉ dùng OCR làm gợi ý; học sinh phải xác nhận cấu trúc để tránh dựng nhầm quan hệ cha-con.
      if(!confirm('Cây bạn nhập có '+countTree(parsed)+' nút.\nCấu trúc: '+treeStr(parsed)+'\n\nDùng cây này để mở mô hình 3D?'))return;
      root=parsed;S.orig=clone(root);S.sel=null;S.view='tree';S.grow=1;clear();refresh();
      mode='track';locked=true;isLocked=true;pend=false;M=null;rig.visible=true;
      document.body.classList.remove('scan','cfm');document.body.classList.add('locked');
      og.clearRect(0,0,SW,SH);say('');ui();
      toast('✅ Đã dựng cây từ ảnh hỗ trợ OCR. Hãy kiểm tra lại các nút và đường nối.');
    }
    $('#bUp').onclick=()=>{const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
      inp.onchange=()=>{const fl=inp.files[0];if(!fl)return;if(!fl.type.startsWith('image/'))return toast('Vui lòng chọn file ảnh.');
        const im=new Image();im.onload=async()=>{try{
          const iw=im.naturalWidth,ih=im.naturalHeight,snap=document.createElement('canvas');snap.width=iw;snap.height=ih;snap.getContext('2d').drawImage(im,0,0);
          const choice=prompt('Chọn kiểu sơ đồ trong ảnh:\nA — Chữ số nằm trong các nút hình tròn (nhận diện cây hiện có).\nB — Chữ số viết trực tiếp trên giấy ô li, không có hình tròn.','A');
          if(!choice)return;
          if(choice.trim().toUpperCase()==='B'){
            toast('Đang đọc chữ số trên ảnh…');
            const items=await readPaperDigits(snap);
            if(!items.length){toast('OCR chưa đọc được chữ số. Hãy dùng ảnh rõ hơn hoặc nhập cây bằng tay.');return}
            await loadPaperTree(snap,items);
            return;
          }
          if(choice.trim().toUpperCase()!=='A'){toast('Vui lòng chọn A hoặc B.');return}
          const r=fromStill(snap,iw,ih,snap);if(!r)return;
          const k=Math.max(SW/iw,SH/ih);G={a:k/r.s,ox:(SW-iw*k)/2,oy:(SH-ih*k)/2};locked=true;isLocked=true;document.body.classList.add('locked');ui();toast('🖼 Cây dựng từ ảnh tải lên — đã cố định tại chỗ');
        }catch(e){console.error(e);toast('Không xử lý được ảnh: '+(e.message||e));}};
        im.onerror=()=>toast('Không mở được ảnh này');im.src=URL.createObjectURL(fl)};inp.click()};
    if(useCam){
      say('Bước 1/3 · 🔍 Đưa hình cây vào KHUNG VÀNG (kéo khung để dời, kéo chấm góc để đổi cỡ)');
      lockFn=q=>{if(mode!='track')return toast('Chưa nhận diện được cây để cố định');locked=!locked;isLocked=locked;document.body.classList.toggle('locked',locked);say('');if(!q)toast(locked?'📌 Đã cố định — cây giữ nguyên vị trí trên màn hình':'🔓 Đã bỏ cố định — cây bám theo hình giấy trở lại');ui()};
      rescanFn=()=>{scanId++;close();root=null;S.sel=null;clear();Object.assign(S,{px:0,py:0,roll:0,yaw:0,pitch:0,zoom:1});sync();mode='scan';locked=false;isLocked=false;M=null;stable=0;lastSig='';pend=false;rig.visible=false;
        document.body.classList.remove('locked','cfm');document.body.classList.add('scan');og.clearRect(0,0,SW,SH);drawFrame();say('Bước 1/3 · 🔍 Đang quét lại…');ui()};
      ui();tick();
    }else{                                                           // chế độ không cần camera: cây mẫu ở giữa màn hình, đổi cây bằng "Nhập cây"
      root=parseStr('1(2(3(5,6),4),)');S.orig=clone(root);S.sel=null;S.grow=1;rig.visible=true;
      lockFn=()=>toast('Chế độ không camera: cây luôn nằm giữa màn hình');rescanFn=()=>toast('Chế độ không camera không cần quét');rescanBtn.hidden=true;
      say('');ui();sync();toast('Chế độ không cần camera — thử "⌨ Nhập cây", kéo nút, chơi game');
    }
    // ---- chạm chọn nút · kéo NÚT để đặt vị trí · kéo chỗ trống để dời/xoay · chụm để thu phóng, vặn để xoay · kéo KHUNG VÀNG khi đang quét ----
    const ray=new THREE.Raycaster(),v2=new THREE.Vector2(),dom=renderer.domElement,pts=new Map(),pl=new THREE.Plane(),pt=new THREE.Vector3(),nw=new THREE.Vector3();
    let moved=0,pd=0,pa=0,dragId=null,dragging=false,dnNode=false,hintD=false,roiD=null;
    const ndc=e=>{const rc=dom.getBoundingClientRect();v2.set((e.clientX-rc.left)/rc.width*2-1,-((e.clientY-rc.top)/rc.height)*2+1);ray.setFromCamera(v2,cam)};
    const pick=e=>{ndc(e);const h=ray.intersectObjects(hits,false)[0];return h?h.object.userData.id:null};
    const dragTo=(e,id)=>{const o=O[id],n=byId(id);if(!o||!n)return;ndc(e);o.g.getWorldPosition(nw);pl.set(new THREE.Vector3(0,0,1),-nw.z);
      if(ray.ray.intersectPlane(pl,pt)){content.worldToLocal(pt);o.t.copy(pt);o.g.position.copy(pt);n.P=[pt.x,pt.y,pt.z]}};
    const dist=()=>{const q=[...pts.values()];return Math.hypot(q[0][0]-q[1][0],q[0][1]-q[1][1])};
    const ang=()=>{const q=[...pts.values()];return Math.atan2(q[1][1]-q[0][1],q[1][0]-q[0][0])};
    dom.addEventListener('pointerdown',e=>{try{dom.setPointerCapture(e.pointerId)}catch(_){}pts.set(e.pointerId,[e.clientX,e.clientY]);moved=0;dragging=false;roiD=null;
      if(mode=='scan'&&useCam&&!pend&&pts.size==1){roiD=Math.hypot(e.clientX-(ROI.x+ROI.w),e.clientY-(ROI.y+ROI.h))<44?'rs':(e.clientX>ROI.x&&e.clientX<ROI.x+ROI.w&&e.clientY>ROI.y&&e.clientY<ROI.y+ROI.h)?'mv':null}
      if(pts.size==1){dragId=rig.visible&&!GM.on&&S.view!='arr'&&S.dm=='node'?pick(e):null;dnNode=!GM.on&&S.dm!='node'&&rig.visible&&pick(e)!=null}else{dragId=null;pd=dist();pa=ang()}});
    dom.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;const dx=e.clientX-p[0],dy=e.clientY-p[1];p[0]=e.clientX;p[1]=e.clientY;
      if(roiD&&pts.size==1){if(roiD=='rs'){ROI.w=Math.max(120,ROI.w+dx);ROI.h=Math.max(120,ROI.h+dy)}else{ROI.x+=dx;ROI.y+=dy}og.clearRect(0,0,SW,SH);drawFrame();return}
      if(pts.size==1){moved+=Math.abs(dx)+Math.abs(dy);
        if(!rig.visible){}
        else if(dragId!=null){if(moved>6){dragging=true;dragTo(e,dragId)}}
        else if(dnNode&&!hintD&&moved>30){hintD=true;hint('💡 Muốn kéo riêng một nút? Bấm nút “⟳ Xoay cây” trên thanh trên để chuyển sang “✋ Kéo nút”',0)}
        else if(S.mv=='pan'){S.px+=dx;S.py+=dy}
        else{S.yaw-=dx*.01;S.pitch=Math.max(-.6,Math.min(.6,S.pitch+dy*.004))}}
      else if(pts.size==2){const d=dist(),a=ang();let da=a-pa;if(da>Math.PI)da-=2*Math.PI;if(da<-Math.PI)da+=2*Math.PI;
        if(pd)S.zoom=Math.max(.4,Math.min(3,S.zoom*d/pd));S.roll-=da;pd=d;pa=a;S.px+=dx/2;S.py+=dy/2;moved=99}});
    const up=e=>{if(pts.size==1&&e.type=='pointerup'&&rig.visible){
        if(dragging){dragging=false;refresh()}
        else if(moved<8){const id=pick(e);if(GM.on){if(id!=null)gTap(id)}else{S.sel=id;if(id!=null)beep(660);refresh()}}}
      pts.delete(e.pointerId);dragId=null;roiD=null};
    dom.addEventListener('pointerup',up);dom.addEventListener('pointercancel',up);
    renderer.setAnimationLoop(frame);
  }catch(err){
    running=false;load('');document.body.classList.remove('locked','cfm');document.body.classList.add('scan');lockFn=null;rescanFn=null;isLocked=false;sync=()=>{};
    stream&&stream.getTracks().forEach(t=>t.stop());$('#ar').replaceChildren();ui();$('#start').style.display='flex';
    showErr(((err&&err.message)||err||'Camera bị từ chối hoặc không khả dụng')+'');
  }
}
const rescanBtn=document.createElement('button');rescanBtn.id='bRe';rescanBtn.className='or';rescanBtn.innerHTML='🔍<span class="tx"> Quét lại</span>';rescanBtn.title='Bỏ cây hiện tại và quét lại giấy từ đầu';rescanBtn.onclick=()=>{if(!rescanFn)return;if(root&&!document.body.classList.contains('scan'))sure('Quét lại?','Cây đang hiển thị (cùng các thay đổi bạn đã làm) sẽ bị bỏ để quét giấy lại từ đầu.',()=>rescanFn(),'Quét lại');else rescanFn()};$('#top').insertBefore(rescanBtn,$('#bSet'));
applyTheme();ui();
