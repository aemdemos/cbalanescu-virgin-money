/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // Get all tabs (variable/fixed)
  const tabPanels = element.querySelectorAll(':scope > div.tabs > div.tab');
  tabPanels.forEach(tabPanel => {
    // Get all product tiles within this tab
    const slItems = tabPanel.querySelectorAll('.sl-list .sl-item');
    slItems.forEach(slItem => {
      // Image cell
      const img = slItem.querySelector('.image img');
      // Text cell composite
      const textCellParts = [];
      // Heading (h2)
      const heading = slItem.querySelector('.product-name');
      if (heading) textCellParts.push(heading);
      // Key rates table (if present)
      const keyRates = slItem.querySelector('.product-key-rates');
      if (keyRates) textCellParts.push(keyRates);
      // Description (main p)
      const description = slItem.querySelector('.content-secondary .product-description');
      if (description) textCellParts.push(description);
      // Feature list (ul not .product-features)
      const features = slItem.querySelector('.content-secondary ul:not(.product-features)');
      if (features && features.children.length) textCellParts.push(features);
      // CTA buttons (within content-secondary p containing links)
      const ctaPList = slItem.querySelectorAll('.content-secondary p');
      ctaPList.forEach(pEl => {
        if (pEl.querySelector('a')) {
          // Only include if it has at least one link
          textCellParts.push(pEl);
        }
      });
      // Build row: [image, composite text cell]
      // If image missing, use null for cell
      cells.push([img || '', textCellParts.length ? textCellParts : '']);
    });
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
