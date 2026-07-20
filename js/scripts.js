// 作品を追加・編集するときは、この配列の内容を書き換えてください。
const works = [
  {
    title: 'PROJECT ORBIT', category: '3D ACTION GAME', year: '2026', tool: 'Unity / C#', role: '企画・プログラム', period: '3か月',
    thumbnail: 'assets/img/portfolio/thumbnails/1.jpg',
    images: ['assets/img/portfolio/fullsize/1.jpg', 'assets/img/portfolio/fullsize/2.jpg', 'assets/img/portfolio/fullsize/3.jpg'],
    description: '重力を切り替えながら空間を進む、3Dアクションゲームです。直感的な操作感と、短いサイクルで何度も挑戦したくなるレベル設計を意識して制作しました。',
    links: [{ label: 'プレイ動画', url: 'https://www.youtube.com/' }]
  },
  {
    title: 'SIGNAL LOST', category: 'PUZZLE / ADVENTURE', year: '2025', tool: 'Unreal Engine', role: 'ゲーム設計・実装', period: '2か月',
    thumbnail: 'assets/img/portfolio/thumbnails/2.jpg',
    images: ['assets/img/portfolio/fullsize/2.jpg', 'assets/img/portfolio/fullsize/4.jpg'],
    description: '限られた情報を手がかりに、静かな施設を探索するパズルアドベンチャー。照明と音による誘導、プレイヤーが自分で気づく体験をテーマにしています。',
    links: [{ label: 'プレイ動画', url: 'https://www.youtube.com/' }, { label: 'GitHub', url: 'https://github.com/' }]
  },
  {
    title: 'NEON RUNNER', category: '2D ACTION GAME', year: '2025', tool: 'Unity / C#', role: 'プログラム', period: '4週間',
    thumbnail: 'assets/img/portfolio/thumbnails/3.jpg', images: ['assets/img/portfolio/fullsize/3.jpg', 'assets/img/portfolio/fullsize/1.jpg'],
    description: 'テンポの良い移動と回避を楽しむ2Dアクション。入力に対する反応とエフェクトの気持ちよさを、小さな調整の積み重ねで仕上げました。', links: [{ label: 'プレイ動画', url: 'https://www.youtube.com/' }]
  },
  {
    title: 'DIRECTX STUDY', category: 'GRAPHICS PROGRAMMING', year: '2025', tool: 'DirectX 11 / C++', role: 'グラフィックス実装', period: '継続制作',
    thumbnail: 'assets/img/portfolio/thumbnails/4.jpg', images: ['assets/img/portfolio/fullsize/4.jpg', 'assets/img/portfolio/fullsize/5.jpg'],
    description: 'DirectX 11を使ったリアルタイムグラフィックスの習作です。シェーダー、ライティング、ポストエフェクトなどを一つずつ実装しています。', links: [{ label: 'GitHub', url: 'https://github.com/' }]
  },
  {
    title: 'TINY GARDEN', category: 'SIMULATION GAME', year: '2024', tool: 'Unity / C#', role: '企画・開発全般', period: '2か月',
    thumbnail: 'assets/img/portfolio/thumbnails/5.jpg', images: ['assets/img/portfolio/fullsize/5.jpg', 'assets/img/portfolio/fullsize/6.jpg', 'assets/img/portfolio/fullsize/2.jpg'],
    description: '小さな庭を自分のペースで育てるシミュレーションゲーム。遊ぶ人が落ち着けるテンポと、少しずつ景色が変わる達成感を目指しました。', links: [{ label: 'プレイ動画', url: 'https://www.youtube.com/' }]
  },
  {
    title: 'PROTO LAB', category: 'GAME PROTOTYPES', year: '2024–', tool: 'Unity / UE', role: 'プロトタイプ制作', period: '各1〜2週間',
    thumbnail: 'assets/img/portfolio/thumbnails/6.jpg', images: ['assets/img/portfolio/fullsize/6.jpg', 'assets/img/portfolio/fullsize/3.jpg'],
    description: '操作やルールのアイデアを素早く確かめるために制作した、小さなゲームプロトタイプ集です。完成度よりも、遊びの核を見つけることを重視しています。', links: [{ label: '動画リスト', url: 'https://www.youtube.com/' }]
  }
];

const grid = document.querySelector('#worksGrid');
const dialog = document.querySelector('#workDialog');
const dialogImage = document.querySelector('#dialogImage');
const thumbs = document.querySelector('#dialogThumbs');
let lastTrigger = null;

works.forEach((work, index) => {
  const card = document.createElement('button');
  card.type = 'button'; card.className = 'work-card';
  card.setAttribute('aria-label', `${work.title}の詳細を見る`);
  card.innerHTML = `<div class="work-card-media"><img src="${work.thumbnail}" alt="${work.title}の作品画像" loading="lazy"></div><div class="work-info"><div><h3>${work.title}</h3><p>${work.category} · ${work.year}</p></div><span class="work-index">${String(index + 1).padStart(2, '0')}</span></div>`;
  card.addEventListener('click', () => openWork(work, card));
  grid.appendChild(card);
});

function openWork(work, trigger) {
  lastTrigger = trigger;
  document.querySelector('#dialogCategory').textContent = `${work.category} · ${work.year}`;
  document.querySelector('#dialogTitle').textContent = work.title;
  document.querySelector('#dialogDescription').textContent = work.description;
  document.querySelector('#dialogMeta').innerHTML = `<div><dt>Tools</dt><dd>${work.tool}</dd></div><div><dt>Role</dt><dd>${work.role}</dd></div><div><dt>Period</dt><dd>${work.period}</dd></div>`;
  document.querySelector('#dialogLinks').innerHTML = work.links.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join('');
  thumbs.innerHTML = '';
  work.images.forEach((src, index) => {
    const button = document.createElement('button'); button.type = 'button';
    button.setAttribute('aria-label', `画像${index + 1}を表示`);
    button.innerHTML = `<img src="${src}" alt="">`;
    button.addEventListener('click', () => selectImage(src, `${work.title} 画像${index + 1}`, button));
    thumbs.appendChild(button);
  });
  selectImage(work.images[0], `${work.title} メイン画像`, thumbs.firstElementChild);
  dialog.showModal(); document.body.classList.add('dialog-open');
}

function selectImage(src, alt, button) {
  dialogImage.src = src; dialogImage.alt = alt;
  thumbs.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
}

function closeDialog() { dialog.close(); document.body.classList.remove('dialog-open'); lastTrigger?.focus(); }
document.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
document.querySelector('#year').textContent = new Date().getFullYear();
