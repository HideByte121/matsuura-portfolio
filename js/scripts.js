'use strict';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function imageBlock(src, alt, className) {
  const block = element('div', className);
  const placeholder = () => block.replaceChildren(element('span', 'image-placeholder', '画像準備中'));
  if (typeof src !== 'string' || !src.trim()) {
    placeholder();
    return block;
  }
  const image = element('img');
  image.alt = alt;
  image.loading = 'lazy';
  image.addEventListener('error', placeholder, { once: true });
  image.src = src;
  block.append(image);
  return block;
}

function youtubeId(work) {
  return /^[a-zA-Z0-9_-]{11}$/.test(work.youtubeId || '') ? work.youtubeId : null;
}

function videoBlock(work, id) {
  const block = element('div', 'work-video');
  const frame = element('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0`;
  frame.title = `${work.title}のプレイ動画（YouTube）`;
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  block.append(frame);
  return block;
}

const dialog = document.querySelector('#workDialog');
let lastTrigger = null;
if (dialog) {
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not([disabled]), a[href], iframe')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  let startedOnBackdrop = false;
  const isBackdrop = event => {
    const box = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom);
  };
  dialog.addEventListener('pointerdown', event => { startedOnBackdrop = isBackdrop(event); });
  dialog.addEventListener('click', event => {
    if (startedOnBackdrop && isBackdrop(event)) dialog.close();
    startedOnBackdrop = false;
  });
  dialog.addEventListener('close', () => {
    // iframeを取り除いて、閉じた後に音声・再生が残らないようにする。
    dialog.querySelectorAll('iframe').forEach(frame => frame.remove());
    document.body.classList.remove('dialog-open');
    lastTrigger?.focus({ preventScroll: true });
  });
}

function openWork(work, trigger) {
  const content = document.querySelector('#dialogContent');
  content.replaceChildren();
  renderWork(content, work, true);
  lastTrigger = trigger;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
}

const grid = document.querySelector('#worksGrid');
if (grid) {
  works.forEach(work => {
    const card = element('button', 'work-card');
    card.type = 'button';
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-controls', 'workDialog');
    card.setAttribute('aria-label', work.title + 'の詳細を見る');
    card.addEventListener('click', () => openWork(work, card));
    const body = element('div', 'work-info');
    body.append(element('h3', '', work.title), element('p', '', work.summary), element('p', 'work-tools', work.tools), element('span', 'detail-label', '詳細を見る →'));
    const id = youtubeId(work);
    const thumbnail = work.thumbnail || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
    card.append(imageBlock(thumbnail, `${work.title}の作品画像`, 'work-card-media'), body);
    grid.append(card);
  });
}

function renderWork(detail, work, inDialog = false) {
  const title = element(inDialog ? 'h2' : 'h1', 'detail-title', work.title);
  if (inDialog) title.id = 'dialogTitle';
  detail.append(title, element('p', 'detail-summary', work.summary));
  const gallery = element('div', 'work-gallery');
  const id = youtubeId(work);
  if (id) {
    gallery.append(videoBlock(work, id));
    const fallback = element('a', 'video-fallback', 'YouTubeで見る ↗');
    fallback.href = `https://www.youtube.com/watch?v=${id}`;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.setAttribute('aria-label', 'YouTubeで見る（新しいタブで開く）');
    gallery.append(fallback);
  }
  const images = (work.images || []).filter(src => typeof src === 'string' && src.trim());
  if (!images.length && !id) images.push(work.thumbnail || '');
  images.forEach((src, index) => gallery.append(imageBlock(src, `${work.title}の画像 ${index + 1}`, 'detail-image')));
  detail.append(gallery);
  const overview = element('section', 'detail-section');
  overview.append(element(inDialog ? 'h3' : 'h2', '', '概要'), element('p', 'prose', work.description));
  const facts = element('dl', 'facts');
  [['制作期間', work.period], ['制作人数', work.teamSize], ['担当', work.role], ['使用技術', work.tools]].forEach(([label, value]) => {
    const row = element('div');
    row.append(element('dt', '', label), element('dd', '', value));
    facts.append(row);
  });
  overview.append(facts);
  const highlights = element('section', 'detail-section');
  highlights.append(element(inDialog ? 'h3' : 'h2', '', '工夫した点'), element('p', 'prose', work.highlights));
  detail.append(overview, highlights);
  const links = element('div', 'work-links');
  (work.links || []).forEach(link => {
    let url;
    try { url = new URL(link.url); } catch { return; }
    if (!['https:', 'http:'].includes(url.protocol) || !link.label?.trim()) return;
    const anchor = element('a', 'button-link', `${link.label} ↗`);
    anchor.href = url.href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.setAttribute('aria-label', `${link.label}（新しいタブで開く）`);
    links.append(anchor);
  });
  if (links.childElementCount) detail.append(links);
}

const detail = document.querySelector('#workDetail');
if (detail) {
  const id = new URLSearchParams(window.location.search).get('id');
  const work = works.find(item => item.id === id);
  if (!work) {
    document.title = '作品が見つかりません | Portfolio';
    detail.append(element('h1', 'detail-title', '作品が見つかりません'), element('p', '', '作品一覧から作品を選び直してください。'));
  } else {
    document.title = `${work.title} | Portfolio`;
    renderWork(detail, work);
    const back = element('a', 'back-link bottom-back', '← 作品一覧に戻る');
    back.href = 'index.html#works';
    detail.append(back);
  }
}

const contact = document.querySelector('#contactDetails');
const email = portfolio.email.trim();
if (contact && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email)) {
  const link = element('a', 'button-link', 'メールする');
  link.href = `mailto:${encodeURIComponent(email).replace(/%40/g, '@')}`;
  contact.replaceChildren(element('p', 'email-address', email), link);
}
