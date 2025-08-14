/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row
  const headerRow = ['Columns (columns11)'];

  // Get all immediate <li> children of the main <ul>
  const columns = Array.from(element.querySelectorAll(':scope > ul > li'));
  // Defensive: if less than 3 columns, pad with empty arrays
  while (columns.length < 3) columns.push([]);

  // Helper for content columns (first two columns)
  function buildColumnCell(liEl) {
    if (!liEl || liEl.length === 0) return '';
    const cellItems = [];
    // Get section title
    const span = liEl.querySelector(':scope > span');
    if (span) cellItems.push(span);
    // Get <ul> with links
    const innerList = liEl.querySelector(':scope > ul');
    if (innerList) cellItems.push(innerList);
    return cellItems.length === 1 ? cellItems[0] : cellItems;
  }

  // Helper for social links column (third column)
  function buildSocialCell(liEl) {
    if (!liEl || liEl.length === 0) return '';
    const cellItems = [];
    // Get section title
    const span = liEl.querySelector(':scope > span');
    if (span) cellItems.push(span);
    // Get <ul> with social links
    const ul = liEl.querySelector(':scope > ul');
    if (ul) {
      // For each <a> in <ul>, produce a text-only <a> with href
      const links = Array.from(ul.querySelectorAll('a'));
      links.forEach(link => {
        let label = '';
        // Try to get svg <title> text for label
        const svgTitle = link.querySelector('svg title');
        if (svgTitle && svgTitle.textContent) {
          label = svgTitle.textContent.trim();
        }
        // Fallback: use link.host or 'Social'
        if (!label) {
          try {
            label = new URL(link.href, document.location.origin).hostname.replace('www.','');
          } catch (e) {
            label = 'Social';
          }
        }
        // Create a text link
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = label;
        if (link.target) a.target = link.target;
        cellItems.push(a);
      });
    }
    return cellItems.length === 1 ? cellItems[0] : cellItems;
  }

  // Build the block table data
  const row = [
    buildColumnCell(columns[0]),
    buildColumnCell(columns[1]),
    buildSocialCell(columns[2]),
  ];

  const tableData = [headerRow, row];

  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(blockTable);
}
