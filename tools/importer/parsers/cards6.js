/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Cards (cards6)'];
  const rows = [];
  // Find all cards in order
  const cardSections = element.querySelectorAll('section.cm-content-tile');
  cardSections.forEach((section) => {
    // Left cell: card image (img only)
    let imgCell = null;
    const img = section.querySelector('.image img');
    if (img) imgCell = img;
    // Right cell: all text content (title, description, cta)
    const textCellContent = [];
    const content = section.querySelector('.content');
    if (content) {
      // Title (h3.header)
      const title = content.querySelector('.header');
      if (title && title.textContent.trim()) textCellContent.push(title);
      // Description (first non-empty p:not(.subheading) that does not only contain a link)
      const paragraphs = Array.from(content.querySelectorAll('p'));
      // Find description paragraph
      let foundDescription = false;
      for (const p of paragraphs) {
        if (p.classList.contains('subheading')) continue;
        // If this p has a link and nothing else, it's probably just the CTA, skip for description
        if (p.querySelector('a') && p.textContent.trim() === p.querySelector('a').textContent.trim()) continue;
        if (p.textContent.trim() !== '' && !foundDescription) {
          textCellContent.push(p);
          foundDescription = true;
        }
      }
      // CTA: last <p> that has a link
      for (let i = paragraphs.length - 1; i >= 0; i--) {
        const p = paragraphs[i];
        if (p.querySelector('a')) {
          textCellContent.push(p);
          break;
        }
      }
    }
    rows.push([imgCell, textCellContent]);
  });
  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
