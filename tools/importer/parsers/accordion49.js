/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion list
  const accordionList = element.querySelector('.accordion-list');
  if (!accordionList) return;

  // Only direct <li> children (each is an accordion item)
  const items = Array.from(accordionList.children).filter((li) => li.tagName === 'LI');

  // Table header: block name must match exactly
  const headerRow = ['Accordion (accordion49)'];
  const rows = [headerRow];

  items.forEach((li) => {
    // Title cell: clickable <a> inside <li>
    const titleLink = li.querySelector('a');
    let titleCell;
    if (titleLink) {
      // Use only the text content of the link for the title cell
      titleCell = document.createElement('div');
      titleCell.textContent = titleLink.textContent.trim();
    } else {
      // Fallback: use first text node
      titleCell = document.createElement('div');
      titleCell.textContent = li.textContent.trim();
    }

    // Content cell: the .expandcollapse-content div inside <li>
    const contentDiv = li.querySelector('.expandcollapse-content');
    let contentCell;
    if (contentDiv) {
      // Defensive: grab all children of the content div
      // Usually, it's a single <ol> with many <div.tcs-wrapper><li>...</li></div>
      // We'll collect all <li> elements inside .expandcollapse-content
      const ol = contentDiv.querySelector('ol');
      if (ol) {
        // Each tcs-wrapper contains a <li> (the actual content)
        const wrappers = Array.from(ol.children).filter((el) => el.classList.contains('tcs-wrapper'));
        // For each wrapper, extract the <li> inside
        wrappers.forEach((wrapper) => {
          const innerLi = wrapper.querySelector('li');
          if (innerLi) {
            // Create a row for each <li> found
            const contentFrag = document.createElement('div');
            Array.from(innerLi.childNodes).forEach((node) => {
              contentFrag.appendChild(node.cloneNode(true));
            });
            rows.push([titleCell.cloneNode(true), contentFrag]);
          }
        });
        return; // We've already pushed rows for each item
      } else {
        // Fallback: use the contentDiv itself
        contentCell = document.createElement('div');
        Array.from(contentDiv.childNodes).forEach((node) => {
          contentCell.appendChild(node.cloneNode(true));
        });
      }
    } else {
      // Fallback: empty cell
      contentCell = document.createElement('div');
    }

    // Only push if not handled above (no <ol> structure)
    rows.push([titleCell, contentCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
