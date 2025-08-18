/* global WebImporter */
export default function parse(element, { document }) {
  // Set up header row exactly as required
  const rows = [['Accordion (accordion20)']];

  // Find the accordion section
  let accordionSection = element.querySelector('section.cm-accordion, section.cm.cm-accordion');
  if (!accordionSection) {
    // Fallback: look for ul.accordion-list
    const ulAccordion = element.querySelector('ul.accordion-list');
    if (ulAccordion) {
      accordionSection = ulAccordion.closest('section') || ulAccordion.closest('div');
    }
  }
  if (!accordionSection) return;

  // Find the <ul class="accordion-list">
  const accordionList = accordionSection.querySelector('ul.accordion-list');
  if (!accordionList) return;

  // For each <li> in accordion-list
  const items = accordionList.querySelectorAll(':scope > li');
  items.forEach((li) => {
    // Title cell: anchor with class 'accordion-item'
    const anchor = li.querySelector('a.accordion-item');
    let titleElem = '';
    if (anchor) {
      // Remove the <div class="ec">
      const tempAnchor = anchor.cloneNode(true);
      const ecDiv = tempAnchor.querySelector('div.ec');
      if (ecDiv) ecDiv.remove();
      // Wrap in a div for consistent referencing
      titleElem = document.createElement('div');
      // Keep the HTML structure and formatting
      titleElem.innerHTML = tempAnchor.innerHTML;
    } else {
      titleElem = document.createElement('div');
      titleElem.textContent = '';
    }

    // Content cell: the content div which is typically the next sibling
    let contentElem = '';
    if (anchor && anchor.nextElementSibling) {
      // Find any child with cm-rich-text or cq-dd-paragraph for actual content
      const contentDiv = anchor.nextElementSibling;
      const richTextContent = contentDiv.querySelector('.cm-rich-text, .cq-dd-paragraph');
      if (richTextContent) {
        contentElem = richTextContent;
      } else {
        contentElem = contentDiv;
      }
    } else {
      contentElem = document.createElement('div');
      contentElem.textContent = '';
    }

    rows.push([titleElem, contentElem]);
  });

  // Check for extra content immediately after the accordion (like "See more")
  let afterAccordion = accordionList.nextElementSibling;
  while (afterAccordion && afterAccordion.nodeType === 1) {
    if (afterAccordion.classList.contains('cm-rich-text')) {
      // Place into a final row, span first column, leave second empty
      rows.push([afterAccordion, '']);
      break; // Only one such block is shown in example
    }
    afterAccordion = afterAccordion.nextElementSibling;
  }

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
