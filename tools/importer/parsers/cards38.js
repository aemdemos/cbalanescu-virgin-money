/* global WebImporter */
export default function parse(element, { document }) {
  // Find the card list container
  const cardList = element.querySelector('.sl-list');
  if (!cardList) return;
  // Each .sl-item contains two cards (sections)
  const cardItems = Array.from(cardList.querySelectorAll(':scope > .sl-item'));

  // Table header: block name exactly as specified
  const rows = [['Cards (cards38)']];

  // Aggregate all cards (sections) in row order
  cardItems.forEach((item) => {
    const sections = Array.from(item.querySelectorAll(':scope > section'));
    sections.forEach((section) => {
      // First column: image/icon (mandatory), the <img> inside .image
      const imageWrapper = section.querySelector('.image');
      let imageCell = '';
      if (imageWrapper) {
        const imgEl = imageWrapper.querySelector('img');
        if (imgEl) imageCell = imgEl;
      }
      // Second column: all content from .content (heading, text, cta etc)
      // Reference the actual .content element so all formatting and links are preserved
      let textCell = '';
      const contentEl = section.querySelector('.content');
      if (contentEl) {
        textCell = contentEl;
      }
      rows.push([imageCell, textCell]);
    });
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
