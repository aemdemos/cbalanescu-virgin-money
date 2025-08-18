/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion20)'];
  const rows = [headerRow];

  // Find the accordion block section
  const accordionSection = element.querySelector('section.cm-accordion, section.cm.cm-accordion');
  if (!accordionSection) return;
  const ul = accordionSection.querySelector('ul.accordion-list');
  if (!ul) return;

  // Get all direct <li> accordion items
  const items = ul.querySelectorAll(':scope > li');
  items.forEach((li) => {
    // Title: clickable accordion label (reference existing anchor, removing chevron if present)
    const titleLink = li.querySelector('a.accordion-item');
    let titleCell;
    if (titleLink) {
      // Create a fragment with only the label (ignore chevron divs)
      const frag = document.createElement('span');
      Array.from(titleLink.childNodes).forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          frag.appendChild(document.createTextNode(n.textContent));
        } else if (n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() !== 'div') {
          frag.appendChild(n);
        }
      });
      titleCell = frag;
    } else {
      titleCell = '';
    }

    // Content: reference the first visible content block inside the item
    let contentCell = '';
    const contentDiv = li.querySelector('div.expandcollapse-content');
    if (contentDiv) {
      // Prefer the rich-text container if present
      const richContent = contentDiv.querySelector('.cm-rich-text, .module__content, .cq-dd-paragraph');
      if (richContent) {
        contentCell = richContent;
      } else {
        contentCell = contentDiv;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Check for extra rich text ("See more") outside <li> but inside <ul>
  const extraRich = ul.querySelector(':scope > .cm-rich-text');
  if (extraRich) {
    rows.push(['', extraRich]);
  }

  // Build the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace accordion section with the new table
  accordionSection.parentNode.replaceChild(block, accordionSection);
}
