/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items
  function getAccordionRows(element) {
    const rows = [];
    // Find the accordion list
    const ul = element.querySelector('ul.accordion-list');
    if (!ul) return rows;
    // Each <li> is an accordion item
    ul.querySelectorAll(':scope > li').forEach((li) => {
      // Title: <a class="accordion-item">
      const a = li.querySelector('a.accordion-item');
      let title = null;
      if (a) {
        // Remove any trailing icons/divs from the title
        // Clone to avoid modifying source
        const aClone = a.cloneNode(true);
        // Remove any child divs (e.g., icon wrappers)
        Array.from(aClone.querySelectorAll('div')).forEach((div) => div.remove());
        // Use the text content as the title
        title = aClone;
      }
      // Content: <div class="expandcollapse-content">
      const contentDiv = li.querySelector('div.expandcollapse-content');
      let content = null;
      if (contentDiv) {
        // Find the rich text content inside
        const richContent = contentDiv.querySelector('.cm-rich-text, .cm-rich-text.module__content');
        if (richContent) {
          content = richContent;
        } else {
          // If not found, use all children of contentDiv
          content = document.createElement('div');
          Array.from(contentDiv.childNodes).forEach((node) => {
            content.appendChild(node.cloneNode(true));
          });
        }
      }
      if (title && content) {
        rows.push([title, content]);
      }
    });
    return rows;
  }

  // Build table rows
  const headerRow = ['Accordion (accordion27)'];
  const accordionRows = getAccordionRows(element);
  const tableCells = [headerRow, ...accordionRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(block);
}
