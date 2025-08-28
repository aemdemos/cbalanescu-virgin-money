/* global WebImporter */
export default function parse(element, { document }) {
  // Get direct .sl-list child, then its .sl-item children (columns)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.children).filter((el) => el.classList.contains('sl-item'));

  const columns = slItems.map((item) => {
    // If the .sl-item has exactly one child and it's a div, use that as the cell (e.g. .cm or .cm-rich-text)
    const mainChild = item.children.length === 1 && item.firstElementChild.tagName === 'DIV' ? item.firstElementChild : item;
    return mainChild;
  });

  // Create table manually so we can span the header cell across all columns
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns (columns32)';
  headerTh.colSpan = columns.length;
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  const contentTr = document.createElement('tr');
  for (const col of columns) {
    const td = document.createElement('td');
    td.append(col);
    contentTr.appendChild(td);
  }
  table.appendChild(contentTr);

  element.replaceWith(table);
}
