/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure header row matches specification
  const headerRow = ['Cards (cards43)'];

  // Find all direct card items
  const cardItems = Array.from(element.querySelectorAll('.sl-list > .sl-item'));
  const rows = cardItems.map(card => {
    // Within each card
    const contentPanel = card.querySelector('.cm-content-panel-container');
    if (!contentPanel) return [document.createElement('div'), document.createElement('div')];
    const richText = contentPanel.querySelector('.cm-rich-text');
    if (!richText) return [document.createElement('div'), document.createElement('div')];

    // Image/icon (first cell) - always present in example
    const img = richText.querySelector('img');
    // If missing, add empty div for placeholder
    const imageCell = img ? img : document.createElement('div');

    // Text cell: heading, description, CTA
    const textParts = [];
    // Heading
    const heading = richText.querySelector('h5, h4, h3');
    if (heading) textParts.push(heading);
    // Description: <p> except those containing <img> or which are only CTA (with <a>)
    const ps = Array.from(richText.querySelectorAll('p'));
    // p with <img>
    const psWithoutImg = ps.filter(p => !p.querySelector('img'));
    // Find CTA p (contains <a>)
    let ctaP = null;
    const descPs = [];
    psWithoutImg.forEach(p => {
      if (p.querySelector('a')) {
        ctaP = p;
      } else {
        descPs.push(p);
      }
    });
    descPs.forEach(p => textParts.push(p));
    if (ctaP) textParts.push(ctaP);

    // If no descriptive content, add an empty div
    if (textParts.length === 0) textParts.push(document.createElement('div'));

    return [imageCell, textParts];
  });

  // Build table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
