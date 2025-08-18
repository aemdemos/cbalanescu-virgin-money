/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header from example: Cards (cards1)
  const headerRow = ['Cards (cards1)'];

  // 2. Helper to extract card info
  function extractCard(section) {
    // First cell: image/icon
    const headerDiv = section.querySelector('.header');
    let imgEl = headerDiv && headerDiv.querySelector('img');
    // Second cell: Title, description, CTA
    let titleEl = headerDiv && headerDiv.querySelector('h2');
    const contentDiv = section.querySelector('.content');
    // Compose description and CTA
    let descEls = [];
    let ctaEl = null;
    if (contentDiv) {
      const ps = Array.from(contentDiv.querySelectorAll('p'));
      ps.forEach(p => {
        const link = p.querySelector('a');
        if (link) {
          ctaEl = link;
        } else {
          descEls.push(p);
        }
      });
    }
    // Compose content cell with all elements in order: Title, description(s), CTA
    const contentCell = [];
    if (titleEl) contentCell.push(titleEl);
    descEls.forEach(e => contentCell.push(e));
    if (ctaEl) contentCell.push(ctaEl);
    return [imgEl, contentCell];
  }

  // 3. Find all cards (section.cm.cm-icon-title)
  const sectionEls = Array.from(element.querySelectorAll('section.cm.cm-icon-title'));
  // 4. Create rows for each card
  const rows = sectionEls.map(extractCard);

  // 5. Final table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace original element
  element.replaceWith(block);
}
