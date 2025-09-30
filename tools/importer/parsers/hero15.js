/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section containing the hero content
  const section = element.querySelector('section.cm-hero-banner, section.cm-image-block-link');
  if (!section) return;

  // --- Background Image Row ---
  // Find the background image from the .intrinsic-el.img div
  let bgImgEl = null;
  const intrinsicEl = section.querySelector('.intrinsic-el.img');
  if (intrinsicEl) {
    // Try to get background-image from style or data-hlx-background-image
    let bgUrl = '';
    const style = intrinsicEl.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(["']?(.*?)["']?\)/);
    if (match && match[1] && match[1] !== '' && match[1] !== 'about:blank') {
      bgUrl = match[1];
    } else {
      // fallback to data-hlx-background-image
      const dataBg = intrinsicEl.getAttribute('data-hlx-background-image');
      if (dataBg) {
        const dataMatch = dataBg.match(/url\(["']?(.*?)["']?\)/);
        if (dataMatch && dataMatch[1] && dataMatch[1] !== '' && dataMatch[1] !== 'about:blank') {
          bgUrl = dataMatch[1];
        }
      }
    }
    if (bgUrl && bgUrl !== '""' && bgUrl !== '' && bgUrl !== 'about:blank') {
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgUrl.replace(/^['"]|['"]$/g, '');
      bgImgEl.alt = '';
    }
  }

  // --- Build Table Rows ---
  const headerRow = ['Hero (hero15)'];
  // Only include the image element if it exists, otherwise use an empty string
  const imageRow = bgImgEl ? [bgImgEl] : [''];

  // --- Content Row ---
  // Find the content container
  const content = section.querySelector('.content');
  let contentEls = [];
  if (content) {
    // Find heading (h2.header)
    const heading = content.querySelector('h2.header');
    if (heading && heading.textContent.trim()) contentEls.push(heading);

    // Find subtitle (span.subtitle) if not empty
    const subtitle = content.querySelector('span.subtitle');
    if (subtitle && subtitle.textContent.trim()) contentEls.push(subtitle);

    // Find all paragraphs (excluding empty ones)
    const paragraphs = Array.from(content.querySelectorAll('p')).filter(p => p.textContent.trim() || p.querySelector('img'));
    paragraphs.forEach(p => contentEls.push(p));
  }
  const contentRow = contentEls.length ? [contentEls] : [''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
