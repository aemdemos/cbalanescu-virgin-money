/* global WebImporter */
export default function parse(element, { document }) {
  // The block name matches the example: 'Cards (cards23)'
  const headerRow = ['Cards (cards23)'];

  // Utility to extract card rows from a tab
  function getCards(tabEl) {
    const cards = [];
    const slList = tabEl.querySelector('.sl-list');
    if (!slList) return cards;
    slList.querySelectorAll('.sl-item').forEach(item => {
      const tile = item.querySelector('section.cm-product-tile');
      if (!tile) return;
      // Image: use the <img> element directly from the DOM
      const image = tile.querySelector('.image img');
      // Text cell: gather content
      const textCell = [];
      // Title: strong (not heading to avoid making new elements)
      const titleEl = tile.querySelector('.product-name');
      if (titleEl && titleEl.textContent.trim()) {
        const titleStrong = document.createElement('strong');
        titleStrong.textContent = titleEl.textContent.trim();
        textCell.push(titleStrong);
      }
      // Key rates: each rate as a div
      const keyRates = tile.querySelector('.product-key-rates');
      if (keyRates) {
        keyRates.querySelectorAll('.product-key-rate-item').forEach(kr => {
          const rateVal = kr.querySelector('.key-value-text');
          const rateDesc = kr.querySelector('.key-bottom-text');
          let line = '';
          if (rateVal) {
            line += rateVal.textContent.trim();
          }
          if (rateDesc) {
            line += ' ' + rateDesc.textContent.trim();
          }
          if (line) {
            const div = document.createElement('div');
            div.textContent = line;
            textCell.push(div);
          }
        });
      }
      // Description paragraph
      const desc = tile.querySelector('.content-secondary .product-description');
      if (desc && desc.textContent.trim()) {
        const descP = document.createElement('p');
        descP.textContent = desc.textContent.trim();
        textCell.push(descP);
      }
      // Feature list (bullet points)
      const ul = tile.querySelector('.content-secondary ul');
      if (ul && ul.children.length > 0) {
        textCell.push(ul);
      }
      // CTA links (keep the original <a> elements)
      const ctaContainer = tile.querySelector('.content-secondary p');
      if (ctaContainer) {
        ctaContainer.querySelectorAll('a').forEach(a => {
          textCell.push(a);
        });
      }
      // Compose card row: [image, text content]
      cards.push([image, textCell]);
    });
    return cards;
  }

  // Process all tabs, active and inactive
  const tabContainers = element.querySelectorAll('.tabs > .tab');
  const allCards = [];
  tabContainers.forEach(tab => {
    const cards = getCards(tab);
    cards.forEach(row => allCards.push(row));
  });

  // Final block construction
  const table = [headerRow, ...allCards];
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
