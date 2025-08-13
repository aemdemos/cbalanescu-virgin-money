/* global WebImporter */
export default function parse(element, { document }) {
  // Block table: 1 column, 3 rows
  // 1st row: Header -> 'Hero (hero22)'
  // 2nd row: Background image (not present in input HTML)
  // 3rd row: Title, subtitle, paragraph, CTA

  // HEADER ROW
  const headerRow = ['Hero (hero22)'];

  // IMAGE ROW (no background image in HTML)
  const imageRow = [''];

  // CONTENT ROW
  // Collect title, subtitle, paragraph, CTA

  // Title: h1.header
  let titleEl = null;
  const h1 = element.querySelector('.header');
  if (h1) {
    // Try to find bold inside h1
    const bold = h1.querySelector('b');
    if (bold) {
      // Create an h1 and move the text content
      titleEl = document.createElement('h1');
      titleEl.textContent = bold.textContent.trim();
    } else {
      // Fallback: use h1 text content
      titleEl = document.createElement('h1');
      titleEl.textContent = h1.textContent.trim();
    }
  }

  // Subtitle: .subtitle
  let subtitleEl = null;
  const subtitle = element.querySelector('.subtitle');
  if (subtitle && subtitle.textContent.trim()) {
    subtitleEl = document.createElement('div');
    subtitleEl.textContent = subtitle.textContent.trim();
  }

  // Paragraph: first non-empty <p> that is not inside h1
  let descriptionEl = null;
  const allPs = Array.from(element.querySelectorAll('p'));
  for (const p of allPs) {
    // Ignore <p> inside .header
    if (h1 && h1.contains(p)) continue;
    if (p.textContent.trim().length > 0) {
      descriptionEl = p;
      break;
    }
  }

  // CTA: .cta span
  let ctaEl = null;
  const cta = element.querySelector('.cta');
  if (cta && cta.textContent.trim()) {
    // Reference existing element
    ctaEl = cta;
  }

  // Compose content cell in semantic order
  const contentCell = [];
  if (subtitleEl) contentCell.push(subtitleEl);
  if (titleEl) contentCell.push(titleEl);
  if (descriptionEl) contentCell.push(descriptionEl);
  if (ctaEl) contentCell.push(ctaEl);

  const tableCells = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
