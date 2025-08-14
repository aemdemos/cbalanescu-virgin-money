/* global WebImporter */
export default function parse(element, { document }) {
  // Table header (MUST match example exactly)
  const headerRow = ['Hero (hero49)'];

  // Extract image from background-image
  let imgEl = '';
  const imgDiv = element.querySelector('.intrinsic-el.img');
  if (imgDiv && imgDiv.style && imgDiv.style.backgroundImage) {
    const urlMatch = imgDiv.style.backgroundImage.match(/url\(([^)]+)\)/);
    if (urlMatch && urlMatch[1]) {
      const src = urlMatch[1].replace(/^['"]|['"]$/g, '');
      imgEl = document.createElement('img');
      imgEl.src = src;
      const altSpan = imgDiv.querySelector('.vh');
      imgEl.alt = altSpan ? altSpan.textContent.trim() : '';
    }
  }
  const imageRow = [imgEl || ''];

  // Extract all content from .content block
  const contentDiv = element.querySelector('.content');
  let contentNodes = [];
  if (contentDiv) {
    contentNodes = Array.from(contentDiv.childNodes).map((node) => {
      // Convert CTA span to link with correct href
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList &&
        node.classList.contains('cta')
      ) {
        const parentLink = element.querySelector('a');
        if (parentLink && parentLink.href) {
          const ctaLink = document.createElement('a');
          ctaLink.href = parentLink.href;
          ctaLink.textContent = node.textContent.trim();
          return ctaLink;
        }
        // fallback: just return the span
        return node;
      }
      // For all other nodes (headings, spans, paragraphs, text), use as-is
      return node;
    }).filter((n) => {
      // Remove empty text nodes
      return (n.nodeType !== 3 || n.textContent.trim() !== '') || typeof n === 'string';
    });
  }
  const textRow = [contentNodes.length === 1 ? contentNodes[0] : contentNodes];

  // Create the block table matching the example
  const rows = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
