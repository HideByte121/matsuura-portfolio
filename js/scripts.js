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

const grid = document.querySelector('#worksGrid');
if (grid) {
  works.forEach(work => {
    const card = element('a', 'work-card');
    card.href = `work.html?id=${encodeURIComponent(work.id)}`;
    const body = element('div', 'work-info');
    body.append(element('h3', '', work.title), element('p', '', work.summary), element('p', 'work-tools', work.tools), element('span', 'detail-label', '詳細を見る →'));
    card.append(imageBlock(work.thumbnail, `${work.title}の作品画像`, 'work-card-media'), body);
    grid.append(card);
  });
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
    detail.append(element('h1', 'detail-title', work.title), element('p', 'detail-summary', work.summary));
    const gallery = element('div', 'work-gallery');
    const images = (work.images || []).filter(src => typeof src === 'string' && src.trim());
    if (!images.length) images.push(work.thumbnail || '');
    images.forEach((src, index) => gallery.append(imageBlock(src, `${work.title}の画像 ${index + 1}`, 'detail-image')));
    detail.append(gallery);
    const overview = element('section', 'detail-section');
    overview.append(element('h2', '', '概要'), element('p', 'prose', work.description));
    const facts = element('dl', 'facts');
    [['制作期間', work.period], ['制作人数', work.teamSize], ['担当', work.role], ['使用技術', work.tools]].forEach(([label, value]) => {
      const row = element('div');
      row.append(element('dt', '', label), element('dd', '', value));
      facts.append(row);
    });
    overview.append(facts);
    const highlights = element('section', 'detail-section');
    highlights.append(element('h2', '', '工夫した点'), element('p', 'prose', work.highlights));
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
