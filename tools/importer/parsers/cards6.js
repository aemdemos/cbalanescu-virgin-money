/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block header
  const headerRow = ['Cards (cards6)'];
  const cells = [headerRow];

  // Find all cards
  const cardItems = element.querySelectorAll(':scope .product-key-rate-item');
  cardItems.forEach((card) => {
    // First column: image/icon (mandatory)
    const img = card.querySelector('img');

    // Second column: text content (title, description, CTA)
    // Title: Use the text from the .key-value-text > span, bolded
    let titleNode = null;
    const titleSpan = card.querySelector('.key-value-text > span');
    if (titleSpan && titleSpan.textContent.trim()) {
      titleNode = document.createElement('strong');
      titleNode.textContent = titleSpan.textContent.trim();
    }

    // Description and CTA
    const keyTopText = card.querySelector('.key-top-text');
    const descriptionFragments = [];
    let ctaNode = null;
    if (keyTopText) {
      // Look for CTA <a> in .key-top-text
      // Build description from all text and elements except the CTA link
      Array.from(keyTopText.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'P') {
            // If <p> contains a link, separate it out
            const pLinks = node.querySelectorAll('a');
            if (pLinks.length > 0) {
              // Add all nodes except links
              Array.from(node.childNodes).forEach((pChild) => {
                if (pChild.nodeType === Node.ELEMENT_NODE && pChild.tagName === 'A') {
                  ctaNode = pChild;
                  // Don't push CTA to description
                } else {
                  descriptionFragments.push(pChild);
                }
              });
            } else {
              descriptionFragments.push(node);
            }
          } else if (node.tagName === 'A') {
            ctaNode = node;
          } else {
            descriptionFragments.push(node);
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.trim()) {
            descriptionFragments.push(document.createTextNode(node.textContent.trim()));
          }
        }
      });
    }

    // Build the second cell: [title, description, CTA]
    const cellElements = [];
    if (titleNode) cellElements.push(titleNode);
    // Add description/paragraphs, preserving original structure
    if (descriptionFragments.length > 0) {
      descriptionFragments.forEach(frag => {
        cellElements.push(frag);
      });
    }
    // Add CTA at the end, if present
    if (ctaNode) cellElements.push(ctaNode);

    // Push the row
    cells.push([img, cellElements]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
