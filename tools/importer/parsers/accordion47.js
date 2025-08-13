/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table rows, starting with the header exactly as in the example
  const rows = [
    ['Accordion (accordion47)']
  ];

  // Find all accordion items (li) inside the ul.accordion-list (must be direct child!)
  const accordionList = element.querySelector('ul.accordion-list');
  if (accordionList) {
    const lis = accordionList.querySelectorAll(':scope > li');
    lis.forEach((li) => {
      // --- TITLE CELL ---
      // The clickable title is the <a class="accordion-item">, but the arrow <div class="ec"> should be ignored
      const a = li.querySelector('a.accordion-item');
      let titleCell = '';
      if (a) {
        // Create a span for the title
        const titleSpan = document.createElement('span');
        // Remove any .ec div (arrow)
        Array.from(a.childNodes).forEach((node) => {
          // Only include text and elements that are NOT the arrow div
          if (!(node.nodeType === 1 && node.classList && node.classList.contains('ec'))) {
            titleSpan.append(node.cloneNode(true));
          }
        });
        // Use titleSpan if it has any content, else fallback to just the text
        titleCell = titleSpan.childNodes.length ? titleSpan : a.textContent.trim();
      }
      // --- CONTENT CELL ---
      // The associated content div is <div class="expandcollapse-content">
      const contentDiv = li.querySelector('div.expandcollapse-content');
      let contentCell = '';
      if (contentDiv) {
        // The expandcollapse-content will usually have a .cm-rich-text child, but may contain multiple elements
        // We want to preserve lists, links, formatting, etc., so put all children into the cell
        const children = Array.from(contentDiv.children).filter(child =>
          child.textContent.trim() !== '' || child.querySelector('img,iframe,a')
        );
        if (children.length > 0) {
          contentCell = children;
        } else {
          // If for some reason there are no non-empty children, use the div itself
          contentCell = contentDiv;
        }
      }
      rows.push([titleCell, contentCell]);
    });
  }
  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(table);
}
