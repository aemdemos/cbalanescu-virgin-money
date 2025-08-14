/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as specified
  const headerRow = ['Columns (columns33)'];

  // Find main columns by locating .sl-list direct children (.sl-item)
  const slList = element.querySelector('.sl-list');
  let row = [];

  if (slList) {
    const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
    row = slItems.map((item) => {
      // Find the .cm.cm-rich-text inside each item
      const content = item.querySelector('.cm.cm-rich-text');
      // If found, reference the full .cm (contains heading, lists, etc.)
      return content || item;
    });
  } else {
    // Fallback if structure changes
    const directDivs = Array.from(element.querySelectorAll(':scope > div'));
    row = directDivs.length ? directDivs : [element];
  }

  // If columns are empty, fall back safely
  if (row.length === 0) {
    row = [element];
  }

  const cells = [headerRow, row];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
