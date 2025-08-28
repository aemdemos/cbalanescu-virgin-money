/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Accordion (accordion48)'];
  const cells = [headerRow];

  // Get the <ul class="accordion-list"> inside the section
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;
  // For each <li> (accordion item)
  Array.from(ul.children).forEach((li) => {
    // Title cell: the <a> element (remove any child div.ec for clarity)
    const a = li.querySelector('a');
    let titleCell = '';
    if (a) {
      // Remove any icon <div> from the <a> for just the title
      Array.from(a.querySelectorAll('div')).forEach(div => div.remove());
      // Use the <a> directly, so links and formatting are preserved
      titleCell = a;
    }
    // Content cell: the expand-collapse content
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentCell = '';
    if (contentDiv) {
      contentCell = contentDiv;
    }
    cells.push([titleCell, contentCell]);
  });

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
