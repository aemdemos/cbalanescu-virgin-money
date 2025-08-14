/* global WebImporter */
export default function parse(element, { document }) {
  // Get all card sections
  const sections = element.querySelectorAll('section.cm.cm-icon-title');
  const cells = [['Cards (cards1)']];

  sections.forEach(section => {
    // First cell: image/icon
    let img = null;
    const headerDiv = section.querySelector(':scope > .header');
    if (headerDiv) {
      img = headerDiv.querySelector('img');
    }

    // Second cell: all content except the icon
    const textFrag = document.createDocumentFragment();
    // Add title (h2)
    if (headerDiv) {
      const h2 = headerDiv.querySelector('h2');
      if (h2) {
        textFrag.appendChild(h2);
      }
    }
    // Add all content paragraphs and CTA
    const contentDiv = section.querySelector(':scope > .content');
    if (contentDiv) {
      Array.from(contentDiv.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          textFrag.appendChild(node);
        }
      });
    }

    cells.push([
      img,
      textFrag
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
