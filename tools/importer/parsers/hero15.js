/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table, matches example exactly
  const headerRow = ['Hero (hero15)'];

  // --- Background Image Row ---
  let imageEl = null;
  const imgDiv = element.querySelector('.img');
  if (imgDiv && imgDiv.style && imgDiv.style.backgroundImage) {
    const match = imgDiv.style.backgroundImage.match(/url\(("|')?(.*?)("|')?\)/);
    if (match && match[2]) {
      const bgImageUrl = match[2];
      imageEl = document.createElement('img');
      imageEl.src = bgImageUrl;
      const altSpan = imgDiv.querySelector('span');
      imageEl.alt = altSpan ? altSpan.textContent.trim() : '';
    }
  }
  const imageRow = [imageEl ? imageEl : ''];

  // --- Content Row: Gather all text content flexibly ---
  // Get all direct children of the content div and flatten all text and elements
  const contentDiv = element.querySelector('.content');
  let contentChildren = [];
  if (contentDiv) {
    // For each direct child node
    Array.from(contentDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // If it's a <h1> that contains a <p>, flatten the <p> into <h1>
        if (node.tagName === 'H1' && node.querySelector('p')) {
          const h1 = document.createElement('h1');
          // preserve <span> etc inside the <p>
          Array.from(node.querySelector('p').childNodes).forEach(child => {
            h1.appendChild(child.cloneNode(true));
          });
          contentChildren.push(h1);
        } else if (node.classList.contains('cta')) {
          // handled below
        } else {
          contentChildren.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        contentChildren.push(document.createTextNode(node.textContent));
      }
    });
    // CTA logic: if a .cta span exists, wrap in link if parent <a> exists
    const ctaSpan = contentDiv.querySelector('.cta');
    const parentLink = element.querySelector('a');
    if (ctaSpan && parentLink && parentLink.href) {
      const ctaLinkEl = document.createElement('a');
      ctaLinkEl.href = parentLink.href;
      ctaLinkEl.textContent = ctaSpan.textContent;
      contentChildren.push(ctaLinkEl);
    } else if (ctaSpan && !parentLink) {
      contentChildren.push(ctaSpan);
    }
  }

  const contentRow = [contentChildren.length ? contentChildren : ''];

  // Compose the block table with 3 rows, 1 column per the example
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
