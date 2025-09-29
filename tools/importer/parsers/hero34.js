/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely get first matching descendant by selector
  function safeQuery(sel, parent) {
    return parent.querySelector(sel) || null;
  }

  // HEADER ROW
  const headerRow = ['Hero (hero34)'];

  // --- BACKGROUND IMAGE ROW ---
  // Find the image element (background image for hero)
  let imgEl = null;
  // The structure is: section > a > div.image ... > img
  const aTag = element.querySelector('a');
  if (aTag) {
    const imgCandidates = aTag.querySelectorAll('img');
    if (imgCandidates.length > 0) {
      imgEl = imgCandidates[0];
    }
  }
  // If no image found, leave cell empty
  const imageRow = [imgEl ? imgEl : ''];

  // --- CONTENT ROW ---
  // Find the content container
  let contentDiv = null;
  if (aTag) {
    const contentCandidates = aTag.querySelectorAll('div.content');
    if (contentCandidates.length > 0) {
      contentDiv = contentCandidates[0];
    }
  }
  // Defensive: if contentDiv not found, leave cell empty
  let contentCell = '';
  if (contentDiv) {
    // We'll build a fragment with the heading, subtitle, paragraph, and CTA as per block spec
    const frag = document.createDocumentFragment();
    // Heading (h1)
    const h1 = safeQuery('h1', contentDiv);
    if (h1) frag.appendChild(h1);
    // Subtitle (span.subtitle)
    const subtitle = safeQuery('span.subtitle', contentDiv);
    if (subtitle) frag.appendChild(subtitle);
    // Paragraph (first p)
    const para = safeQuery('p', contentDiv);
    if (para) frag.appendChild(para);
    // CTA (span.cta) as a link to the aTag's href, if present
    const cta = safeQuery('span.cta', contentDiv);
    if (cta && aTag && aTag.href) {
      const ctaLink = document.createElement('a');
      ctaLink.href = aTag.href;
      ctaLink.innerHTML = cta.innerHTML;
      frag.appendChild(ctaLink);
    }
    contentCell = frag;
  }
  const contentRow = [contentCell];

  // Compose the table
  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
