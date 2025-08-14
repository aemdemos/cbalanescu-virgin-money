/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion'];
  const rows = [headerRow];

  // Find the accordion items (li elements directly under ul.accordion-list)
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;
  const items = accordionList.querySelectorAll(':scope > li');

  items.forEach((item) => {
    // Title cell: the clickable a.accordion-item (reference original element)
    const titleLink = item.querySelector('a.accordion-item');
    let titleElem = null;
    if (titleLink) {
      // Remove trailing .ec icon for clarity (but don't clone, reference original)
      // Instead, create a DocumentFragment that only includes text and links from the original 'a'
      // We want to preserve link if present, but not include unnecessary icon divs
      // If .ec exists, exclude it
      const frag = document.createDocumentFragment();
      Array.from(titleLink.childNodes).forEach((node) => {
        // Only add text nodes or inline elements (ignore .ec)
        if (node.nodeType === 3 || (node.nodeType === 1 && !node.classList.contains('ec'))) {
          frag.append(node);
        }
      });
      // Wrap fragment in a <span> if it's just text, but keep <a> if link exists
      if (titleLink.href) {
        // Reference the actual anchor but remove the .ec child
        const anchor = titleLink;
        const ec = anchor.querySelector('.ec');
        if (ec) ec.remove();
        titleElem = anchor;
      } else {
        const span = document.createElement('span');
        span.appendChild(frag);
        titleElem = span;
      }
    } else {
      // Fallback: just use textContent
      const span = document.createElement('span');
      span.textContent = item.textContent.trim();
      titleElem = span;
    }

    // Content cell: the corresponding expandcollapse-content div for this <li>
    // Reference its <ol> if present, otherwise include whole div
    const contentDiv = item.querySelector('.expandcollapse-content');
    let contentElem;
    if (contentDiv) {
      const ol = contentDiv.querySelector('ol');
      if (ol) {
        contentElem = ol;
      } else {
        contentElem = contentDiv;
      }
    } else {
      // fallback: empty cell
      contentElem = document.createElement('div');
    }
    rows.push([titleElem, contentElem]);
  });

  // Create and inject Accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
