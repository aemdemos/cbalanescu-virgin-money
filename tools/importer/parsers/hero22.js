/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: must exactly match the block name
  const headerRow = ['Hero (hero22)'];
  // Background image row: no background image, so put empty string
  const backgroundImageRow = [''];

  // Gather content for the content row, using only existing elements
  const contentElements = [];
  // Title (h1.header, which may contain a <p> and <span> etc.)
  const h1 = element.querySelector('h1.header');
  if (h1) contentElements.push(h1);
  // Subheading (span.subtitle)
  const subtitle = element.querySelector('span.subtitle');
  if (subtitle) contentElements.push(subtitle);
  // Main content paragraph(s): non-empty p that is not visually blank
  // Note: ignore empty <p>, and skip p within h1
  const paragraphs = Array.from(element.querySelectorAll(':scope > p')).filter(
    p => p.textContent.trim().length > 0
  );
  paragraphs.forEach(p => contentElements.push(p));
  // CTA (span.cta)
  const cta = element.querySelector('span.cta');
  if (cta) contentElements.push(cta);

  // Assemble table structure for block
  const cells = [
    headerRow,
    backgroundImageRow,
    [contentElements]
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
