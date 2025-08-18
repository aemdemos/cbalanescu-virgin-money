/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns container
  const slList = element.querySelector('.sl-list');
  const items = slList ? Array.from(slList.children) : Array.from(element.children);

  // Compose columns as before
  const columns = items.map((item) => {
    const rt = item.querySelector('.cm-rich-text');
    if (rt) return rt;
    const iconTitle = item.querySelector('.cm-icon-title');
    if (iconTitle) {
      const frag = document.createDocumentFragment();
      const header = iconTitle.querySelector('.header');
      if (header) {
        const img = header.querySelector('img');
        if (img) frag.appendChild(img);
        const h2 = header.querySelector('h2');
        if (h2) frag.appendChild(h2);
      }
      const content = iconTitle.querySelector('.content');
      if (content) {
        Array.from(content.children).forEach(child => frag.appendChild(child));
      }
      return frag;
    }
    return item;
  });

  // Fix: Ensure header row has the same number of columns as content row
  // First cell is the block name, others are empty strings
  const headerRow = ['Columns (columns51)'];
  while (headerRow.length < columns.length) headerRow.push('');

  const cells = [
    headerRow,
    columns
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
