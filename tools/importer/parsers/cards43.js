/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per requirements
  const headerRow = ['Cards (cards43)'];
  const rows = [headerRow];

  // Each sl-item is a card
  const cardEls = element.querySelectorAll('.sl-list > .sl-item');
  cardEls.forEach((card) => {
    // First cell: the image/icon (mandatory)
    // Second cell: all text content (heading, description, CTA)
    const rich = card.querySelector('.cm-rich-text');
    if (!rich) return;

    // Find image (first <img> inside rich)
    const imgP = rich.querySelector('p img') ? rich.querySelector('p img').closest('p') : null;
    const img = imgP ? imgP.querySelector('img') : null;

    // For text, collect all but the image paragraph
    const cells = Array.from(rich.children);
    // Find the <p> with the image and exclude it
    let imgIndex = -1;
    cells.forEach((el, idx) => {
      if (el.querySelector && el.querySelector('img')) imgIndex = idx;
    });
    const textContent = document.createElement('div');
    cells.forEach((el, idx) => {
      if (idx !== imgIndex) textContent.appendChild(el);
    });

    // Only include if there is an image and text content
    if (img && textContent.childNodes.length) {
      rows.push([img, textContent]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
