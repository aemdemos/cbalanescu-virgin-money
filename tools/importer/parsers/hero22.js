/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the block table for Hero (hero22)
  // 1. Header row: block name
  const headerRow = ['Hero (hero22)'];

  // 2. Background image row: none present in HTML, leave empty string
  const imageRow = [''];

  // 3. Content row: headline, subtitle, description, CTA
  // Get headline (h1.header)
  const h1 = element.querySelector('h1');
  // Get subtitle (span.subtitle)
  const subtitle = element.querySelector('span.subtitle');
  // Get non-empty paragraph (the description)
  let descPara = null;
  Array.from(element.querySelectorAll('p')).forEach(p => {
    if (p.textContent.trim().length > 0) {
      descPara = p;
    }
  });
  // Get CTA (span.cta)
  const cta = element.querySelector('span.cta');

  // Compile all present content into a single cell (array of elements)
  const cellContent = [];
  if (subtitle) cellContent.push(subtitle);
  if (h1) cellContent.push(h1);
  if (descPara) cellContent.push(descPara);
  if (cta) cellContent.push(cta);

  const contentRow = [cellContent];

  // Build the table for the block
  const cells = [headerRow, imageRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(blockTable);
}
