/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Accordion (accordion20)'];
  const rows = [];

  // Find accordion block
  const accordionSection = element.querySelector('.cm-accordion');
  if (!accordionSection) return;
  const ul = accordionSection.querySelector('ul.accordion-list');
  if (!ul) return;

  // Get accordion items (li)
  const items = Array.from(ul.querySelectorAll('li'));
  items.forEach((li) => {
    // Title: anchor text (excluding .ec)
    const a = li.querySelector('a.accordion-item');
    let titleContent = '';
    if (a) {
      // Remove trailing ec div if present
      const ecDiv = a.querySelector('.ec');
      if (ecDiv) ecDiv.remove();
      titleContent = a;
    }
    // Body: all content blocks in .expandcollapse-content
    const expandDiv = li.querySelector('.expandcollapse-content');
    let bodyContent = '';
    if (expandDiv) {
      // Collect all direct rich-content children (not descendants)
      const contentBlocks = Array.from(expandDiv.children).filter(
        (el) => el.classList.contains('cm-rich-text') || el.classList.contains('cq-dd-paragraph')
      );
      if (contentBlocks.length === 0) {
        bodyContent = expandDiv;
      } else if (contentBlocks.length === 1) {
        bodyContent = contentBlocks[0];
      } else {
        bodyContent = contentBlocks;
      }
    }
    rows.push([titleContent, bodyContent]);
  });

  // See more link at end (after all accordion items)
  const seeMore = ul.querySelector('h6');
  if (seeMore) {
    rows.push(['', seeMore]);
  }

  // Create and replace
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
