(()=>{
const MF={lpdp:'LPDP',chevening:'Chevening',aa:'AAS'};
// DATA CONTOH: ubah/tambah beasiswa di sini. lv=jenjang, ipk=minimal, ielts=minimal (0=tidak wajib),
// eko=khusus keluarga kurang mampu, m/d=bulan/tanggal penutupan (perkiraan, berulang tiap tahun).
const S = [
  {id:'lpdp',k:'lpdp',nama:'LPDP Reguler',org:'Kementerian Keuangan RI',lv:['S2','S3'],ipk:3.0,ielts:5.5,eko:false,m:11,d:30,
   benefit:'Biaya kuliah, biaya hidup, dan tunjangan riset atau buku.',
   syarat:['WNI dengan IPK minimal 3,00','Sertifikat bahasa sesuai kampus tujuan','Diterima atau sedang mendaftar di kampus tujuan'],
   tahap:['Seleksi administrasi','Seleksi bakat skolastik','Wawancara dan Leaderless Group Discussion'],
   dok:['KTP','Ijazah dan transkrip','Esai komitmen dan rencana studi','Sertifikat bahasa','Surat rekomendasi']},
  {id:'kip',k:'kip',nama:'KIP Kuliah',org:'Kemendikbudristek',lv:['S1'],ipk:0,ielts:0,eko:true,m:5,d:31,
   benefit:'Biaya pendidikan dan bantuan biaya hidup selama kuliah S1.',
   syarat:['Lulusan SMA/SMK atau sederajat','Berasal dari keluarga kurang mampu','Diterima di perguruan tinggi'],
   tahap:['Pendaftaran akun','Verifikasi data ekonomi','Penetapan penerima'],
   dok:['KK','Bukti ekonomi (KIP/PKH/DTKS/SKTM)','Rapor','Bukti penerimaan kampus']},
  {id:'djarum',k:'djarum',nama:'Djarum Beasiswa Plus',org:'Djarum Foundation',lv:['S1'],ipk:3.0,ielts:0,eko:false,m:3,d:31,
   benefit:'Bantuan dana bulanan dan pelatihan soft skill.',
   syarat:['Mahasiswa aktif S1 semester 4 ke atas','IPK minimal 3,00','Aktif berorganisasi'],
   tahap:['Seleksi berkas','Tes tertulis','Wawancara'],
   dok:['Transkrip','CV','Esai','Bukti organisasi']},
  {id:'chevening',k:'chevening',nama:'Chevening',org:'Pemerintah Inggris',lv:['S2'],ipk:3.0,ielts:6.5,eko:false,m:11,d:5,
   benefit:'Biaya kuliah S2 satu tahun di Inggris, biaya hidup, dan tiket pesawat.',
   syarat:['Minimal 2 tahun pengalaman kerja','IELTS sesuai syarat kampus','Berkomitmen kembali ke Indonesia'],
   tahap:['Aplikasi daring dan esai','Wawancara','Penerimaan kampus'],
   dok:['Paspor','Ijazah','Esai kepemimpinan dan jejaring','Dua referensi']},
  {id:'aa',k:'australia',nama:'Australia Awards',org:'Pemerintah Australia',lv:['S2','S3'],ipk:3.0,ielts:6.5,eko:false,m:4,d:30,
   benefit:'Biaya kuliah, tiket, tunjangan hidup, dan asuransi kesehatan.',
   syarat:['Pengalaman kerja','IELTS 6,5 dengan skor komponen tertentu','Kontribusi bagi pembangunan Indonesia'],
   tahap:['Seleksi administrasi','Wawancara','Tes kesehatan'],
   dok:['Paspor','Ijazah dan transkrip','Sertifikat IELTS','Surat referensi']},
  {id:'unggulan',k:'unggulan',nama:'Beasiswa Unggulan',org:'Kemendikbudristek',lv:['S1','S2','S3'],ipk:3.0,ielts:0,eko:false,m:6,d:30,
   benefit:'Bantuan biaya pendidikan dan biaya hidup untuk berprestasi.',
   syarat:['Prestasi akademik atau non-akademik','IPK minimal 3,00 (S2/S3)','Terdaftar di kampus dalam negeri'],
   tahap:['Seleksi administrasi','Seleksi substansi'],
   dok:['KTP','Transkrip','Bukti prestasi','Esai']}
];
const DOCS = ['KTP dan Kartu Keluarga','Ijazah dan transkrip nilai','CV','Esai motivasi','Surat rekomendasi','Sertifikat bahasa','Pas foto terbaru'];

const $ = s => document.querySelector(s);
const store = {
  get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
};
const next = s => {const n=new Date();let t=new Date(n.getFullYear(),s.m-1,s.d);if(t<n)t=new Date(n.getFullYear()+1,s.m-1,s.d);return t};
const days = s => Math.ceil((next(s)-new Date())/864e5);
const fmt = s => next(s).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
const li = a => a.map(x=>`<li>${x}</li>`).join('');

let P = store.get('profile',{jenjang:'S1',ipk:3.2,ielts:0,eko:false});
let R = store.get('rem',[]);

function score(s){
  let sc=0,gap=[];
  if(s.lv.includes(P.jenjang))sc+=40;else gap.push('untuk jenjang '+s.lv.join('/'));
  if(P.ipk>=s.ipk)sc+=20;else gap.push('IPK minimal '+s.ipk);
  if(P.ielts>=s.ielts)sc+=20;else gap.push('sertifikat bahasa (IELTS '+s.ielts+')');
  if(!s.eko||P.eko)sc+=20;else gap.push('khusus keluarga kurang mampu');
  return {s,sc,gap};
}
const ranked = () => S.map(score).sort((a,b)=>b.sc-a.sc||days(a.s)-days(b.s));

function render(){
  const r = ranked();
  $('#top3').innerHTML = r.slice(0,3).map(x=>`<li><span>${x.s.nama}</span><b>${x.sc}%</b></li>`).join('');
  const q = $('#sq').value.toLowerCase(), only = $('#only').checked;
  const rows = r.filter(x=>x.s.nama.toLowerCase().includes(q)&&(!only||x.sc>=80));
  $('#list').innerHTML = rows.map(({s,sc,gap})=>`
    <article class="row">
      <div class="pct"><b>${sc}%</b><span>cocok</span><i><em style="width:${sc}%"></em></i></div>
      <div>
        <h3>${s.nama}</h3>
        <p class="org">${s.org}</p>
        <p>${s.benefit}</p>
        ${gap.length?`<p class="gap">Belum terpenuhi: ${gap.join(', ')}.</p>`:''}
        <details><summary>Syarat, tahapan, dan dokumen</summary>
          <h4>Persyaratan</h4><ul>${li(s.syarat)}</ul>
          <h4>Tahapan seleksi</h4><ul>${li(s.tahap)}</ul>
          <h4>Dokumen</h4><ul>${li(s.dok)}</ul>
        </details>
      </div>
      <div class="dl"><b>${days(s)} hari lagi</b><span>Tutup sekitar ${fmt(s)}</span>
        <button data-id="${s.id}" class="${R.includes(s.id)?'on':''}">${R.includes(s.id)?'Pengingat aktif':'Ingatkan saya'}</button>${MF[s.id]?`<a class="mlink" href="#mentor" data-mentor="${MF[s.id]}">Cari mentor ${MF[s.id]} →</a>`:''}</div>
    </article>`).join('') || '<p class="bsempty">Tidak ada beasiswa yang cocok dengan pencarianmu. Coba ubah profil atau matikan filter.</p>';
  const mine = R.map(id=>S.find(s=>s.id===id)).filter(Boolean).sort((a,b)=>days(a)-days(b));
  $('#rem').innerHTML = mine.length ? mine.map(s=>`<li><b>${s.nama}</b>: ${days(s)} hari lagi, tutup sekitar ${fmt(s)}</li>`).join('')
    : '<li class="bsempty">Belum ada. Tekan "Ingatkan saya" pada beasiswa yang kamu incar.</li>';
}

function readProfile(){
  P = {jenjang:$('#p-jenjang').value, ipk:parseFloat($('#p-ipk').value)||0, ielts:parseFloat($('#p-ielts').value), eko:$('#p-eko').checked};
  store.set('profile',P); render();
}
$('#p-jenjang').value=P.jenjang; $('#p-ipk').value=P.ipk; $('#p-ielts').value=String(P.ielts); $('#p-eko').checked=P.eko;
['#p-jenjang','#p-ipk','#p-ielts','#p-eko'].forEach(i=>$(i).addEventListener('input',readProfile));
$('#sq').addEventListener('input',render); $('#only').addEventListener('change',render);
$('#list').addEventListener('click',e=>{
  const id=e.target.dataset.id; if(!id)return;
  R = R.includes(id)?R.filter(x=>x!==id):[...R,id]; store.set('rem',R); render();
});

// Checklist dokumen
const done = store.get('docs',[]);
$('#docs').innerHTML = DOCS.map((d,i)=>`<li><label class="check"><input type="checkbox" data-i="${i}" ${done.includes(i)?'checked':''}> ${d}</label></li>`).join('');
$('#docs').addEventListener('change',e=>{
  const i=+e.target.dataset.i, set=new Set(store.get('docs',[]));
  e.target.checked?set.add(i):set.delete(i); store.set('docs',[...set]);
});

// Form calon mentor (belum terhubung ke server)
$('#mform').addEventListener('submit',e=>{
  e.preventDefault();
  $('#mform-msg').textContent = 'Lamaran terkirim. Tim akan menghubungimu lewat email.';
  e.target.reset();
});

// AI Assistant demo berbasis data lokal
function say(t,who){const d=document.createElement('div');d.className='m '+who;d.textContent=t;$('#log').append(d);$('#log').scrollTop=1e9}
function reply(q){
  q=q.toLowerCase();
  const s=S.find(x=>q.includes(x.k));
  if(s)return `${s.nama}: ${s.benefit} Syarat utama: ${s.syarat.join('; ')}. Tahapan: ${s.tahap.join(', ')}. Tutup sekitar ${fmt(s)}.`;
  if(/dokumen|berkas/.test(q))return 'Dokumen yang hampir selalu diminta: '+DOCS.join(', ')+'. Cek daftar dokumen pada tiap beasiswa.';
  if(/deadline|kapan|tutup/.test(q)){const n=[...S].sort((a,b)=>days(a)-days(b))[0];return `Deadline terdekat: ${n.nama}, ${days(n)} hari lagi (sekitar ${fmt(n)}).`}
  if(/ielts|toefl|bahasa/.test(q))return 'Beasiswa luar negeri umumnya meminta IELTS 6,5 atau setara. Lihat layanan tes dan kursus di bagian Persiapan.';
  if(/mentor/.test(q))return 'Pilih mentor dari Harvard, Oxford, NTU, UI, ITB, atau UGM di bagian Mentor, lalu pilih jadwal konsultasinya.';
  if(/rekomen|cocok|pilih/.test(q)){const t=ranked()[0];return `Dengan profilmu sekarang, yang paling cocok adalah ${t.s.nama} (${t.sc}% cocok).`}
  return 'Aku bisa menjawab soal syarat beasiswa (misalnya LPDP atau KIP), dokumen, deadline, tes bahasa, dan rekomendasi. Coba tanyakan salah satunya.';
}
$('#ask').addEventListener('submit',e=>{
  e.preventDefault(); const v=$('#msg').value.trim(); if(!v)return;
  say(v,'me'); say(reply(v),'bot'); $('#msg').value='';
});
say('Halo! Tanyakan soal syarat, dokumen, deadline, atau rekomendasi beasiswa.','bot');
render();

})();
