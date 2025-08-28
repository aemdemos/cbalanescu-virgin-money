/* global WebImporter */
export default function parse(element, { document }) {
  // Only one table needs to be created (the Accordion block)
  // The header row should be exactly: 'Accordion (accordion21)'

  // Find the accordion section (should be on the right side)
  let accordionSection = null;
  const slItems = element.querySelectorAll(':scope > div > div > div.sl-item');
  for (const slItem of slItems) {
    const section = slItem.querySelector('section.cm-accordion, section.cm.cm-accordion');
    if (section) {
      accordionSection = section;
      break;
    }
  }
  if (!accordionSection) return;

  // Find all accordion items (li elements)
  const accordionList = accordionSection.querySelector('ul.accordion-list');
  if (!accordionList) return;
  const rows = [['Accordion (accordion21)']]; // Header row as required

  // Each accordion item: one row, two columns (title and content)
  Array.from(accordionList.querySelectorAll(':scope > li')).forEach((li) => {
    // Title cell: take the text content inside the <a class="accordion-item">
    const titleLink = li.querySelector('a.accordion-item');
    let titleElem;
    if (titleLink) {
      // Create a span referencing the text content only (not the dropdown icon)
      const span = document.createElement('span');
      // Sometimes there are child nodes, first one is text
      if (titleLink.childNodes.length) {
        // Collect only text nodes up to the first <div class="ec">
        for (let node of titleLink.childNodes) {
          if (node.nodeType === 3) { // Text node
            span.appendChild(document.createTextNode(node.textContent));
          }
          if (node.nodeType === 1 && node.classList.contains('ec')) {
            break;
          }
        }
      } else {
        span.textContent = titleLink.textContent;
      }
      titleElem = span;
    } else {
      titleElem = document.createTextNode('');
    }

    // Content cell: reference the expandcollapse-content's main child (prefer .cm-rich-text)
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentElem;
    if (contentDiv) {
      // Prefer .cm-rich-text, but may be .cq-dd-paragraph or the whole contentDiv
      let mainContent = contentDiv.querySelector('.cm-rich-text') ||
                        contentDiv.querySelector('.cq-dd-paragraph') ||
                        contentDiv.querySelector('.cm-content-panel-container');
      contentElem = mainContent ? mainContent : contentDiv;
    } else {
      contentElem = document.createTextNode('');
    }

    rows.push([titleElem, contentElem]);
  });

  // Handle extra content under the accordion (e.g. 'See more' link)
  // These are NOT part of the accordion items, so add after as a single row, only if present
  // In the input, this is a .cm-rich-text (with <h6><a>See more</a></h6>) after <li>s in ul.accordion-list
  let extras = [];
  let foundExtra = false;
  Array.from(accordionList.children).forEach((child) => {
    if (child.tagName !== 'LI') {
      extras.push(child);
      foundExtra = true;
    }
  });
  if (foundExtra && extras.length) {
    rows.push(['', extras]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the accordion block (right-side sl-item) with the new table
  // Find the parent .sl-item containing accordionSection
  const parentItem = accordionSection.closest('.sl-item');
  if (parentItem) {
    parentItem.replaceWith(table);
  }
}
