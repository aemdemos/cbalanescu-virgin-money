/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches the block name exactly as required
  const headerRow = ['Hero (hero3)'];

  // There is no background image in the provided HTML, so provide an empty cell
  const imageRow = [''];

  // For the content row, gather the key parts
  const contentElements = [];

  // Title: use the .header h1
  const title = element.querySelector('h1.header');
  if (title) contentElements.push(title);

  // Subtitle: .subtitle span
  const subtitle = element.querySelector('.subtitle');
  if (subtitle) contentElements.push(subtitle);

  // Paragraph: pick the paragraph with a font-size style
  const mainParagraph = element.querySelector('p[style*="font-size"]');
  if (mainParagraph) contentElements.push(mainParagraph);

  // CTA: .cta span
  const cta = element.querySelector('.cta');
  if (cta) contentElements.push(cta);

  // Compose the rows
  const cells = [headerRow, imageRow, [contentElements]];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
