/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row exactly matching example
  const headerRow = ['Columns (columns39)'];

  // 2. Extract immediate sl-list child containing columns
  let columnsContainer = element.querySelector('.sl-list');
  if (!columnsContainer) {
    columnsContainer = element;
  }
  // Extract all direct column items
  const columnElements = Array.from(columnsContainer.children).filter(
    el => el.classList.contains('sl-item')
  );

  // 3. For each column, extract its panel container (reference existing elements)
  const columns = columnElements.map(colEl => {
    // Find the content panel in each column for true column content
    const panel = colEl.querySelector('.cm-content-panel-container');
    // Defensive: If no panel, use column element itself
    return panel || colEl;
  });

  // 4. If there are no columns, handle gracefully (empty content block)
  const secondRow = columns.length ? columns : [''];

  // 5. Compose the table structure as per example
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the new block table
  element.replaceWith(block);
}
