/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element is a UL with accordion-list class
  if (!element || !element.classList.contains('accordion-list')) return;

  // Table header row
  const headerRow = ['Accordion (accordion16)'];
  const rows = [headerRow];

  // Get all LI (accordion items)
  const items = Array.from(element.querySelectorAll(':scope > li'));

  items.forEach((li) => {
    // Title cell: find the first <a> with class 'accordion-item'
    const titleLink = li.querySelector('a.accordion-item');
    let titleCell;
    if (titleLink) {
      // Defensive: clone only the text node (not icons/divs)
      // Remove any child <div class="ec"> (icon)
      const linkClone = titleLink.cloneNode(true);
      const ecDiv = linkClone.querySelector('.ec');
      if (ecDiv) ecDiv.remove();
      // Remove aria attributes for cleanliness
      linkClone.removeAttribute('aria-controls');
      linkClone.removeAttribute('aria-expanded');
      titleCell = linkClone;
    } else {
      // Fallback: use first text node in LI
      titleCell = document.createTextNode(li.textContent.trim());
    }

    // Content cell: find the first div with class 'expandcollapse-content'
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentCell;
    if (contentDiv) {
      // Defensive: Use the entire contentDiv for resilience
      contentCell = contentDiv;
    } else {
      // Fallback: empty cell
      contentCell = document.createTextNode('');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
