/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row, matches example exactly
  const headerRow = ['Hero (hero23)'];

  // 2. Background image row - no image in provided HTML, so blank cell
  const bgRow = [''];

  // 3. Content row: Title (heading), subtitle, description, CTA
  // Collect content in order and only include non-empty elements
  const contentEls = [];

  // Title: use .header or h1; if it's wrapped or contains child elements, use the entire element for full formatting
  const title = element.querySelector('.header, h1');
  if (title && title.textContent.trim()) contentEls.push(title);

  // Subtitle: .subtitle
  const subtitle = element.querySelector('.subtitle');
  if (subtitle && subtitle.textContent.trim()) contentEls.push(subtitle);

  // Paragraph description: first non-empty <p> that's not inside .header
  // Exclude empty paragraphs and those inside the header
  const paragraphs = Array.from(element.querySelectorAll('p')).filter(
    p => p.textContent.trim().length > 0 && !p.closest('.header, h1')
  );
  if (paragraphs.length) contentEls.push(paragraphs[0]);

  // CTA: .cta
  const cta = element.querySelector('.cta');
  if (cta && cta.textContent.trim()) contentEls.push(cta);

  // Assemble table rows
  const cells = [headerRow, bgRow, [contentEls]];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
