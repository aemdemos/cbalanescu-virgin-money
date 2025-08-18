/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row
  const headerRow = ['Hero (hero16)'];

  // 2nd row: background image (none in provided HTML)
  // Both screenshots and HTML indicate no background image is present in this snippet
  const backgroundImageRow = [''];

  // 3rd row: headline, subheading, CTA
  // All provided HTML content is a single paragraph with a CTA link
  // We reference the actual child paragraph element
  const p = element.querySelector('p');
  // If there is no paragraph, fallback to all child nodes
  const contentRow = [p ? [p] : Array.from(element.childNodes)];

  // Compose rows for the table
  const cells = [headerRow, backgroundImageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
