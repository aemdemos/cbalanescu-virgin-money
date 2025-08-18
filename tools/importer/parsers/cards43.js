/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example exactly
  const headerRow = ['Cards (cards43)'];
  // Find all card items
  const items = Array.from(element.querySelectorAll('.sl-item'));
  const rows = items.map(item => {
    const panel = item.querySelector('.cm-content-panel-container');
    const rich = panel && panel.querySelector('.cm-rich-text');
    // Find the image (first <img>)
    let img = null;
    if (rich) {
      img = rich.querySelector('img');
    }
    // Find the heading (h5, h4, h3, etc.)
    let heading = null;
    if (rich) {
      heading = rich.querySelector('h1,h2,h3,h4,h5,h6');
    }
    // Find the main description (the first <p> after the heading, not containing an <img>)
    let description = null;
    if (rich && heading) {
      const children = Array.from(rich.children);
      const headingIdx = children.indexOf(heading);
      for (let i = headingIdx + 1; i < children.length; i++) {
        if (
          children[i].tagName === 'P' &&
          !children[i].querySelector('img') &&
          children[i].textContent.trim()
        ) {
          description = children[i];
          break;
        }
      }
    }
    // Find CTA: the last <a> (with text) in rich
    let cta = null;
    if (rich) {
      const aTags = Array.from(rich.querySelectorAll('a'));
      // Only include if textContent is not empty
      for (let i = aTags.length - 1; i >= 0; i--) {
        if (aTags[i].textContent.trim()) {
          cta = aTags[i];
          break;
        }
      }
    }
    // Build right cell: heading, description, CTA (in order, omitting any missing)
    const textCellElements = [];
    if (heading) textCellElements.push(heading);
    if (description) textCellElements.push(description);
    if (cta) textCellElements.push(cta);
    // If all text parts are missing, leave cell empty
    return [img, textCellElements.length ? textCellElements : ''];
  });
  // Compose block table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}