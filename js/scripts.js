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

const grid = document.querySelector('#worksGrid');
if (grid) {
  works.forEach(work => {
    const card = element('a', 'work-card');
    card.href = `work.html?id=${encodeURIComponent(work.id)}`;
    card.setAttribute('aria-label', work.title + 'の詳細を見る');
    const body = element('div', 'work-info');
    body.append(element('h3', '', work.title), element('p', '', work.summary), element('p', 'work-tools', work.tools), element('span', 'detail-label', '詳細を見る →'));
    const id = youtubeId(work);
    const thumbnail = work.thumbnail || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
    card.append(imageBlock(thumbnail, `${work.title}の作品画像`, 'work-card-media'), body);
    grid.append(card);
  });
}

function renderWork(detail, work) {
  const title = element('h1', 'detail-title', work.title);
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
  if (work.technicalNotes?.length) {
    const technical = element('section', 'detail-section technical-notes');
    technical.append(element('h2', '', '実装で工夫したこと'), element('p', 'section-note', '課題に対して選んだ方法と、その実装を紹介します。'));
    work.technicalNotes.forEach((note, index) => {
      const section = element('section', 'technical-note');
      section.append(element('h3', '', String(index + 1).padStart(2, '0') + ' / ' + note.title));
      const explanation = element('dl', 'technical-explanation');
      [['課題・狙い', note.problem], ['こう実装した', note.approach], ['工夫のポイント', note.point]].forEach(([label, text]) => {
        const row = element('div');
        row.append(element('dt', '', label), element('dd', '', text));
        explanation.append(row);
      });
      section.append(explanation);
      const disclosure = element('details', 'code-disclosure');
      disclosure.append(element('summary', '', '関連するコードを見る'));
      note.snippets.forEach(snippet => {
        disclosure.append(element('p', 'source-caption', snippet.source));
        const pre = element('pre', 'source-code');
        pre.tabIndex = 0;
        pre.setAttribute('aria-label', snippet.source + 'のコード抜粋');
        pre.append(element('code', 'language-' + (snippet.language || 'cpp'), snippet.code));
        disclosure.append(pre);
      });
      section.append(disclosure);
      technical.append(section);
    });
    detail.append(technical);
  }
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
