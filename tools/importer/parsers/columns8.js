/* global WebImporter */
export default function parse(element, { document }) {
  // Find the three columns (they are <li> in the <ul class="nav-footer has-3-items">)
  const columnsUL = element.querySelector('ul.nav-footer');
  if (!columnsUL) return;
  const columns = Array.from(columnsUL.children).filter(li => li.tagName === 'LI');

  // For each column, we want to output the heading and a link list (no extra markup)
  const columnCells = columns.map((li) => {
    const frag = document.createElement('div');
    // Heading
    const headingSpan = li.querySelector(':scope > span');
    if (headingSpan) {
      // Use <strong> for column heading (not <span>)
      const strong = document.createElement('strong');
      strong.textContent = headingSpan.textContent.trim();
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    // Links
    const linksUL = li.querySelector(':scope > ul');
    if (linksUL) {
      Array.from(linksUL.children).forEach(linkLi => {
        const a = linkLi.querySelector('a');
        if (a) {
          frag.appendChild(a); // Reference existing <a>, not cloning
          frag.appendChild(document.createElement('br'));
        }
      });
    }
    return frag;
  });

  // Create the table block: header, then columns row
  const cells = [
    ['Columns (columns8)'],
    columnCells
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
