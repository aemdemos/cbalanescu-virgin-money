/* global WebImporter */
export default function parse(element, { document }) {
  // Find the right column containing the accordion
  const columns = element.querySelectorAll(':scope > div');
  if (!columns || columns.length < 2) return;
  const rightCol = columns[1];

  // Find the accordion section
  const accordionSection = rightCol.querySelector('section.cm-accordion, section.cm.cm-accordion');
  if (!accordionSection) return;

  // Find the accordion list
  const accordionList = accordionSection.querySelector('ul.accordion-list');
  if (!accordionList) return;

  // Prepare table rows
  const rows = [];
  // Header row: must be exactly one column
  rows.push(['Accordion (accordion21)']);

  // Each <li> is an accordion item
  const items = accordionList.querySelectorAll(':scope > li');
  items.forEach((li) => {
    // Title cell: the <a> with class 'accordion-item'
    const titleLink = li.querySelector('a.accordion-item');
    let titleCell = '';
    if (titleLink) {
      // Get the full HTML content of the link, minus trailing <div class="ec">
      const clonedLink = document.createElement('div');
      Array.from(titleLink.childNodes).forEach((node) => {
        if (!(node.nodeType === 1 && node.classList.contains('ec'))) {
          clonedLink.appendChild(node.cloneNode(true));
        }
      });
      titleCell = clonedLink;
    } else {
      titleCell = document.createTextNode(li.textContent.trim());
    }

    // Content cell: the div with class 'expandcollapse-content'
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentCell = '';
    if (contentDiv) {
      // Find the rich text content inside
      const richContent = contentDiv.querySelector('.cm-rich-text, .cq-dd-paragraph');
      if (richContent) {
        contentCell = richContent.cloneNode(true);
      } else {
        contentCell = contentDiv.cloneNode(true);
      }
    } else {
      contentCell = document.createElement('div');
    }

    rows.push([titleCell, contentCell]);
  });

  // Replace the original element with the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  if (block) {
    element.replaceWith(block);
  }
}
