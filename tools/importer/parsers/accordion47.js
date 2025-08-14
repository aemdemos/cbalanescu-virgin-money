/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header, must match example exactly
  const headerRow = ['Accordion (accordion47)'];
  const cells = [headerRow];

  // Find the accordion list
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;

  // For each accordion item:
  Array.from(accordionList.children).forEach((li) => {
    // Title cell: extract the main question from the <a>
    const link = li.querySelector('a.accordion-item');
    let titleText = '';
    if (link) {
      // Get only the text nodes before <div class="ec">
      let textParts = [];
      for (let node of link.childNodes) {
        // Stop at the icon div
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('ec')) break;
        if (node.nodeType === Node.TEXT_NODE) {
          textParts.push(node.textContent);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'DIV') {
          textParts.push(node.textContent);
        }
      }
      titleText = textParts.join('').trim();
    }

    // Content cell: find the expanded accordion content
    let contentCell = '';
    const contentDiv = li.querySelector('div.expandcollapse-content');
    if (contentDiv) {
      // The actual rich content is usually inside:
      const richContent = contentDiv.querySelector('.cm-rich-text.module__content');
      if (richContent) {
        // Reference all its children (p, ul, etc) for semantic meaning
        const contentNodes = Array.from(richContent.childNodes).filter(node => {
          // Only meaningful elements or non-empty text
          return (node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        });
        // If only one node, use directly
        contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
      } else {
        // Fallback to all children of the contentDiv
        const contentNodes = Array.from(contentDiv.childNodes).filter(node => {
          return (node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        });
        contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
      }
    }
    // Add row to table
    cells.push([titleText, contentCell]);
  });

  // Create accordion block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
