/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches EXACTLY: Cards (cards17)
  const headerRow = ['Cards (cards17)'];
  const cells = [headerRow];

  // Get all cards (each .sl-item > section.cm-content-tile)
  const items = element.querySelectorAll('.sl-item > section.cm-content-tile');
  items.forEach((item) => {
    // Image cell: find first img inside the card
    let imgCell = null;
    const img = item.querySelector('.image img');
    if (img) {
      imgCell = img;
    } else {
      imgCell = '';
    }

    // Text cell: collect all "content" children except empty .subheading
    const contentDiv = item.querySelector('.content');
    let textParts = [];
    if (contentDiv) {
      // Title: h3.header (with <b> inside)
      const h3 = contentDiv.querySelector('h3.header');
      if (h3) {
        textParts.push(h3);
      }

      // All children in contentDiv except empty subheading
      Array.from(contentDiv.children).forEach((child) => {
        if (
          child.tagName === 'P' && 
          child.classList.contains('subheading') && 
          !child.textContent.trim()
        ) {
          // skip empty subheading
          return;
        }
        // Include paragraphs and lists for descriptive text and CTAs
        if (
          child.tagName === 'P' || 
          child.tagName === 'UL'
        ) {
          // skip empty paragraphs (usually non-breaking space)
          if (child.tagName === 'P' && !child.textContent.trim() && child.innerHTML.includes('&nbsp;')) {
            return;
          }
          textParts.push(child);
        }
      });
    }
    // If there are no parts, fallback to empty string
    let textCell = textParts.length === 0 ? '' : (textParts.length === 1 ? textParts[0] : textParts);

    cells.push([imgCell, textCell]);
  });

  // Create table using referenced elements
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
