/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Columns (columns46)'];

  // Locate the rates block and column items
  const ratesBlock = element.querySelector('.cc01-rates');
  if (!ratesBlock) return;
  const keyRates = ratesBlock.querySelector('.product-key-rates');
  if (!keyRates) return;

  // Collect all column items
  const items = Array.from(keyRates.querySelectorAll('.product-key-rate-item'));

  // Compose each column cell
  const columns = items.map(item => {
    const children = [];

    // Image
    const img = item.querySelector('img');
    if (img) children.push(img);

    // Title: "Call us", "In-app chat", "Operating hours"
    const valueText = item.querySelector('.key-value-text');
    if (valueText) {
      // Typically a <span>, but let's preserve its content
      children.push(valueText);
    }

    // Main text (may be <div>, <p>, <b>, <br> etc)
    const topText = item.querySelector('.key-top-text');
    if (topText) {
      // Use the block as-is for resilience
      children.push(topText);
    }

    return children;
  });

  // If no columns found, abort early
  if (columns.length === 0) return;

  // Build the table structure
  const tableData = [headerRow, columns];

  // Create the block table referencing source elements
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
