/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match example exactly
  const headerRow = ['Hero (hero25)'];

  // 2. Background row: example has background image but HTML does not, so leave empty
  const backgroundRow = [''];

  // 3. Content row: must include all of the content in a single cell
  // Find the inner content panel
  let contentRow = [''];
  const panelContainer = element.querySelector('.cm-content-panel-container');
  if (panelContainer) {
    // Get the content block inside
    const richText = panelContainer.querySelector('.cm-rich-text');
    if (richText) {
      // Reference all children (h2, p, p>a)
      const cellDiv = document.createElement('div');
      Array.from(richText.children).forEach(child => {
        cellDiv.appendChild(child);
      });
      contentRow = [cellDiv];
    }
  }

  // Compose the block table
  const cells = [headerRow, backgroundRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
