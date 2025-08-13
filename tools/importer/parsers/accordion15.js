/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Accordion (accordion15)'];
  const rows = [headerRow];

  // Find the accordion-list
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;

  // Each direct <li> child is an accordion item
  const lis = Array.from(ul.children).filter(child => child.tagName === 'LI');

  lis.forEach(li => {
    // Title cell: find the <a> anchor, get only its visible text (not icons)
    let titleCell;
    const a = li.querySelector('a');
    if (a) {
      // Remove any child div (icon) for pure text
      const aClone = a.cloneNode(true);
      const iconDiv = aClone.querySelector('div');
      if (iconDiv) iconDiv.remove();
      // The title is all textContent left, trimmed
      const p = document.createElement('p');
      p.textContent = aClone.textContent.trim();
      titleCell = p;
    } else {
      // fallback for missing anchor
      const p = document.createElement('p');
      p.textContent = li.textContent.trim();
      titleCell = p;
    }

    // Content cell: the expanded body
    let contentCell = '';
    const expandDiv = li.querySelector('div.expandcollapse-content');
    if (expandDiv) {
      // Use the <ol> inside as content (holds all accordion body items)
      const ol = expandDiv.querySelector('ol');
      if (ol && ol.children.length > 0) {
        contentCell = ol;
      } else if (expandDiv.children.length > 0) {
        contentCell = Array.from(expandDiv.children);
      } else {
        // fallback to expandDiv itself
        contentCell = expandDiv;
      }
    } else {
      // fallback for items with body directly in the <li>
      const otherContent = Array.from(li.childNodes).filter(node => node.nodeType === 1 && node !== a);
      if (otherContent.length > 0) {
        contentCell = otherContent;
      } else {
        contentCell = '';
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block using referenced elements
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
