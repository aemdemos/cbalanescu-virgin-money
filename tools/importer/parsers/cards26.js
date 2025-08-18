/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // Helper to extract cards from a tab
  function extractCards(tab) {
    const cardRows = [];
    // Find all cards in this tab
    const slList = tab.querySelector('.sl-list');
    if (!slList) return cardRows;
    const items = slList.querySelectorAll(':scope > .sl-item');
    items.forEach(item => {
      // First cell: image
      let img = item.querySelector('.image img');
      if (!img) {
        // fallback for missing image
        img = document.createElement('span');
        img.textContent = 'No image';
      }
      // Second cell: text content
      const textContent = [];
      // Title
      const title = item.querySelector('.product-name');
      if (title) textContent.push(title);
      // Key rates
      const keyRates = item.querySelector('.product-key-rates');
      if (keyRates) textContent.push(keyRates);
      // Description
      const productDesc = item.querySelector('.product-description');
      if (productDesc) textContent.push(productDesc);
      // Features list
      const ul = item.querySelector('.content-secondary ul');
      if (ul && ul.children.length) textContent.push(ul);
      // Call-to-actions
      const ctas = Array.from(item.querySelectorAll('.content-secondary a'));
      if (ctas.length) textContent.push(...ctas);
      // Remove empty paragraphs and empty lists from textContent
      for (let i = textContent.length - 1; i >= 0; i--) {
        const el = textContent[i];
        if ((el.tagName === 'P' || el.tagName === 'UL') && !el.textContent.trim()) {
          textContent.splice(i, 1);
        }
      }
      cardRows.push([img, textContent]);
    });
    return cardRows;
  }

  // Find all tabs and extract their cards
  const tabPanels = element.querySelectorAll('.tab');
  tabPanels.forEach(tab => {
    if (tab.querySelector('.cm-product-tile')) {
      const rows = extractCards(tab);
      cells.push(...rows);
    }
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
