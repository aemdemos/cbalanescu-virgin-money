/* global WebImporter */
export default function parse(element, { document }) {
  // Find all product-key-rate-item children
  const items = Array.from(element.querySelectorAll(':scope .product-key-rates > .product-key-rate-item'));
  if (!items.length) return;

  // Header row must match target block name exactly
  const headerRow = ['Columns (columns6)'];

  // Build columns for the second row
  const columns = items.map(item => {
    const cellContent = [];
    // Reference the image element (not clone)
    const img = item.querySelector('img');
    if (img) cellContent.push(img);
    // Reference the key-value-text (label)
    const valueText = item.querySelector('.key-value-text');
    if (valueText) cellContent.push(valueText);
    // Reference the key-top-text (subtext)
    const topText = item.querySelector('.key-top-text');
    if (topText) cellContent.push(topText);
    return cellContent;
  });

  // Compose table rows
  const tableRows = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element with block table
  element.replaceWith(block);
}
