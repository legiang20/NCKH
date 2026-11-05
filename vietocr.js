// ================= BỘ ĐỌC CHỮ VIẾT TAY BỔ TRỢ CHO TESSERACT =================
// Phân công:
//  • Tesseract.js đọc chữ số trước (chữ in, nét rõ).
//  • Chỉ ô số nào Tesseract chưa chắc mới được cắt riêng và nhờ bộ đọc chữ viết tay bên dưới đọc bổ sung.
//  • Bộ đọc chữ viết tay (HDR, file chu-so-viet-tay.js) chạy NGAY trong trình duyệt, không cần máy chủ.
//  • VietOCR (tuỳ chọn): nếu bạn có chạy vietocr_server.py và đặt địa chỉ, những ô vẫn chưa chắc sẽ được hỏi thêm VietOCR.
//  • Không bên nào tự tìm nút / đường nối / cha–con — việc đó vẫn là của thuật toán xử lý ảnh và thuật toán cây.
// Địa chỉ máy chủ VietOCR (không bắt buộc), ưu tiên từ trên xuống:
//   1) thêm vào đường dẫn web:  ?vietocr=https://ten-may-chu.example.com   (được nhớ lại; ?vietocr=off để tắt)
//   2) sửa hằng số VIETOCR_URL bên dưới
const VIETOCR_URL='';
const VOCR={
  th:70,                       // Tesseract có độ tin cậy ≤ 70 (thang 0–100) thì mới nhờ bộ đọc viết tay
  url:'',ok:null,warned:false,
  init(){let u=VIETOCR_URL;
    try{const q=new URLSearchParams(location.search).get('vietocr');
      if(q!==null){if(q==''||q=='off')localStorage.removeItem('arbt_vietocr_url'),u='';else localStorage.setItem('arbt_vietocr_url',q),u=q}
      else u=localStorage.getItem('arbt_vietocr_url')||u}catch(e){}
    this.url=String(u||'').trim().replace(/\/+$/,'')},
  async _f(path,opt,ms){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{return await fetch(this.url+path,Object.assign({signal:c.signal},opt))}finally{clearTimeout(t)}},
  async ready(){if(!this.url)return false;if(this.ok!==null)return this.ok;
    try{const r=await this._f('/health',{},4000);this.ok=r.ok&&!!(await r.json()).ok}catch(e){this.ok=false}
    return this.ok},
  say(m){if(typeof toast=='function')toast(m)},
  // Đọc danh sách ô ảnh (canvas) → mảng {t:'chữ số',c:độ tin cậy 0–100} | null (cùng thứ tự)
  async recognize(imgs,msg){if(!imgs.length)return null;if(msg)this.say(msg);
    const out=imgs.map(cv=>{try{const r=HDR.read(cv);return r&&r.t&&r.t.length<=3?{t:r.t,c:r.c}:null}catch(e){return null}});
    if(this.url){                                                       // tuỳ chọn: hỏi thêm VietOCR cho các ô còn chưa chắc
      const weak=out.map((r,i)=>(!r||r.c<85)?i:-1).filter(i=>i>=0);
      if(weak.length&&await this.ready()){
        try{const ims=weak.map(i=>imgs[i].toDataURL('image/png')),res=[];
          for(let i=0;i<ims.length;i+=24){
            const r=await this._f('/ocr',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({images:ims.slice(i,i+24)})},45000);
            if(!r.ok)throw new Error('HTTP '+r.status);(await r.json()).results.forEach(x=>res.push(this.norm(x.text,(+x.conf||0)*100)))}
          weak.forEach((i,j)=>{const m=this.merge(out[i],res[j]||null);if(m)out[i]={t:m.t,c:m.flag?Math.min(m.c,79):m.c}})}
        catch(e){this.ok=false;if(!this.warned){this.warned=true;this.say('⚠ VietOCR không phản hồi — dùng bộ đọc có sẵn.')}}}}
    return out},
  // Chuẩn hoá chữ VietOCR trả về thành chữ số (VietOCR hay đọc nét viết tay thành chữ cái gần giống)
  norm(text,c){const M={O:'0',o:'0',D:'0',Q:'0',I:'1',l:'1',i:'1','|':'1','!':'1',Z:'2',z:'2',S:'5',s:'5',G:'6',b:'6',T:'7',B:'8',g:'9',q:'9'};
    const t=String(text||'').replace(/\s+/g,'').split('').map(ch=>/\d/.test(ch)?ch:(M[ch]||'')).join('');
    return t&&t.length<=3?{t,c:Math.max(0,Math.min(100,c))}:null},
  // Đối chiếu: a = kết quả thứ nhất {t,c} | null, b = kết quả thứ hai {t,c} | null → {t,c,src:'tess'|'viet'|'both',flag:1 nếu còn chưa chắc}
  // (src='tess' = lấy bên a, src='viet' = lấy bên b, 'both' = hai bên khớp nhau)
  merge(a,b){if(!b||!b.t)return a?{t:a.t,c:a.c,src:'tess',flag:a.c<=this.th?1:0}:null;
    if(!a||a.c<=30)return{t:b.t,c:b.c,src:'viet',flag:b.c<80?1:0};
    if(a.t==b.t)return{t:a.t,c:Math.max(a.c,b.c),src:'both',flag:0};
    const w=b.c>a.c?{t:b.t,c:b.c,src:'viet'}:{t:a.t,c:a.c,src:'tess'};w.flag=1;return w},   // hai bên khác nhau → lấy bên tin cậy hơn nhưng đánh dấu "cần kiểm tra"
  _cv(cv,x,y,w,h,pad){x=Math.max(0,x-pad);y=Math.max(0,y-pad);w=Math.min(cv.width-x,w+2*pad);h=Math.min(cv.height-y,h+2*pad);if(w<2||h<2)return null;
    const k=document.createElement('canvas');k.width=Math.round(w);k.height=Math.round(h);const g=k.getContext('2d',{willReadFrequently:true});g.fillStyle='#fff';g.fillRect(0,0,k.width,k.height);g.drawImage(cv,x,y,w,h,0,0,k.width,k.height);return k},
  // Cắt sát nét mực trong ô số đã nhị phân hoá (chữ đen trên nền trắng) rồi chừa lề
  tight(cv){const W=cv.width,H=cv.height,d=cv.getContext('2d',{willReadFrequently:true}).getImageData(0,0,W,H).data;let x0=W,y0=H,x1=-1,y1=-1;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4]<128){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
    if(x1<0)return null;const w=x1-x0+1,h=y1-y0+1,p=Math.max(6,Math.round(Math.max(w,h)*.3));return this._cv(cv,x0,y0,w,h,p)},
  // Cắt khung chữ số từ ảnh gốc theo bbox của Tesseract (dùng cho ảnh kiểu B)
  crop(cv,b){const w=b.x1-b.x0,h=b.y1-b.y0;return this._cv(cv,b.x0,b.y0,w,h,Math.max(6,Math.round(Math.max(w,h)*.25)))}
};
VOCR.init();
