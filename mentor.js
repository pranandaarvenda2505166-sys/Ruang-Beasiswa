const M=[
{n:"Aisyah Rahmawati",u:"Harvard University",m:"Public Policy (MPA)",s:"LPDP",c:"#a51c30",b:"Awardee LPDP Luar Negeri. Fokus pada kebijakan publik dan strategi esai kontribusi."},
{n:"Dimas Prasetyo",u:"University of Oxford",m:"Computer Science (MSc)",s:"Chevening",c:"#002147",b:"Chevening Scholar 2023. Ahli menyusun leadership essay dan networking essay."},
{n:"Clarissa Wijaya",u:"NTU Singapore",m:"Data Science",s:"Lainnya",c:"#b5121b",b:"Peraih beasiswa Singapore International Graduate Award (SINGA)."},
{n:"Rizky Ananda",u:"Universitas Indonesia",m:"Ilmu Hukum",s:"LPDP",c:"#d4a017",b:"Awardee LPDP Dalam Negeri. Berpengalaman lolos seleksi substansi."},
{n:"Nadia Kusuma",u:"Institut Teknologi Bandung",m:"Teknik Lingkungan",s:"AAS",c:"#1d5fa8",b:"Australia Awards Scholar. Membantu persiapan aplikasi dan wawancara AAS."},
{n:"Fajar Hidayat",u:"Universitas Gadjah Mada",m:"Manajemen Bisnis",s:"LPDP",c:"#e0a800",b:"Awardee LPDP. Mentor untuk persiapan LGD dan wawancara."},
{n:"Salsabila Putri",u:"University of Oxford",m:"Education (MSc)",s:"AAS",c:"#002147",b:"Pernah menerima AAS sebelum lanjut ke Oxford. Ahli pemetaan pilihan studi."},
{n:"Bagas Nugroho",u:"Harvard University",m:"Business Administration",s:"Chevening",c:"#a51c30",b:"Alumni Chevening & Harvard. Fokus pada storytelling dan personal branding."},
{n:"Maya Lestari",u:"NTU Singapore",m:"Biomedical Engineering",s:"LPDP",c:"#b5121b",b:"Awardee LPDP Luar Negeri bidang sains dan teknologi kesehatan."}
];
const $=id=>document.getElementById(id);
const ini=n=>n.split(" ").map(w=>w[0]).slice(0,2).join("");
const uniq=k=>[...new Set(M.map(x=>x[k]))].sort();
uniq("u").forEach(v=>$("fu").add(new Option(v,v)));
uniq("s").forEach(v=>$("fs").add(new Option(v,v)));
function render(){
 const q=$("q").value.toLowerCase(),u=$("fu").value,s=$("fs").value;
 const list=M.map((x,i)=>({...x,i})).filter(x=>(!u||x.u===u)&&(!s||x.s===s)&&(!q||(x.n+x.m+x.u).toLowerCase().includes(q)));
 $("grid").innerHTML=list.map(x=>`<div class="card" data-i="${x.i}">
 <div class="av" style="background:${x.c}">${ini(x.n)}</div><h3>${x.n}</h3><div class="uni">${x.u}</div>
 <div class="major">${x.m}</div><div class="tag">🏅 ${x.s}</div>
 <div class="row"><button class="btn line" data-a="p">Lihat Profil</button><button class="btn navy" data-a="p">Pilih Mentor</button></div></div>`).join("");
 $("empty").style.display=list.length?"none":"block";
}
["q","fu","fs"].forEach(id=>$(id).addEventListener("input",render));
$("grid").addEventListener("click",e=>{const c=e.target.closest(".card");if(c)openM(+c.dataset.i)});
let cur,selDay=0,selSlot=null;
const HR=["09.00","10.30","13.00","14.30","16.00","19.30"];
const days=[...Array(6)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()+i+1);return d});
const fmt=(d,o)=>d.toLocaleDateString("id-ID",o);
function openM(i){cur=M[i];selDay=0;selSlot=null;drawM();$("modal").classList.add("open");document.body.style.overflow="hidden"}
function closeM(){$("modal").classList.remove("open");document.body.style.overflow=""}
function drawM(){
 const x=cur;
 $("box").innerHTML=`<button class="x" aria-label="Tutup" id="cl">✕</button>
 <div class="mh"><div class="av" style="background:${x.c}">${ini(x.n)}</div><div><h3>${x.n}</h3><div class="uni">${x.u}</div></div></div>
 <div class="chips"><span class="chip">📚 ${x.m}</span><span class="chip">🏅 ${x.s}</span><span class="chip">⭐ 4.9</span></div>
 <p class="bio">${x.b}</p><h4 style="margin:14px 0 8px">Pilih Jadwal Konsultasi</h4>
 <div class="days">${days.map((d,i)=>`<button class="day ${i===selDay?"on":""}" data-d="${i}"><b>${fmt(d,{weekday:"short"})}</b>${fmt(d,{day:"numeric",month:"short"})}</button>`).join("")}</div>
 <div class="slots">${HR.map((h,i)=>`<button class="slot ${selSlot===h?"on":""}" data-s="${h}" ${(i*3+selDay*2+cur.n.length)%5===0?"disabled":""}>${h} WIB</button>`).join("")}</div>
 <button class="btn navy" style="width:100%;padding:13px" id="ok">Konfirmasi Jadwal</button>`;
}
$("box").addEventListener("click",e=>{
 const t=e.target;
 if(t.id==="cl")return closeM();
 if(t.dataset.d!==undefined){selDay=+t.dataset.d;selSlot=null;drawM()}
 else if(t.dataset.s){selSlot=t.dataset.s;drawM()}
 else if(t.id==="ok"){
  if(!selSlot)return toast("Pilih jam konsultasi dulu ya ⏰");
  const n=cur.n,d=fmt(days[selDay],{weekday:"long",day:"numeric",month:"long"});
  closeM();toast(`✅ Sesi dengan ${n} dijadwalkan: ${d}, ${selSlot} WIB`);
 }
});
$("modal").addEventListener("click",e=>{if(e.target===$("modal"))closeM()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeM()});
let tt;function toast(m){const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),3200)}
$("login").onclick=()=>toast("Fitur Masuk/Daftar segera hadir 🚀");
$("burger").onclick=()=>$("nav").classList.toggle("open");
$("nav").addEventListener("click",e=>{if(e.target.tagName==="A")$("nav").classList.remove("open")});
const msgs=["Halo! Aku Bea 👋 Siap bantu kamu kejar beasiswa!","Mau LPDP, Chevening, atau AAS? Pilih mentornya di bawah ya! 👇","Isi profilmu, aku carikan beasiswa yang paling cocok 🎯","Tahukah kamu? Esai yang personal lebih mudah diingat juri ✨"];
let mi=0;
function say(){const b=$("bubble");mi=(mi+1)%msgs.length;b.style.animation="none";void b.offsetWidth;b.textContent=msgs[mi];b.style.animation=""}
$("mascot").onclick=say;setInterval(say,7000);
render();
