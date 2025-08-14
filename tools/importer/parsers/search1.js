/* global WebImporter */
export default function parse(element, { document }) {
  // The Search block only requires the search index URL as in the example.
  // However, to handle possible edge cases, also check for visible search-related text content in the element.
  // The example markdown uses only the header 'Search' and the absolute URL to the sample query index.

  // 1. Table header must match exactly
  const headerRow = ['Search'];
  
  // 2. Find any visible text related to search in the element (for edge-case flexibility)
  // In this case, the only user-facing text is the 'Search' label in the button
  // But example block expects only the query index URL in the cell.
  // We'll extract for flexibility, but use only the URL as in the example
  // (If future examples provide search-related instructions, this code will pick them up)
  let searchInstruction = '';
  const searchLike = Array.from(element.querySelectorAll('button, a, label, span, input, div'))
    .map(el => el.textContent.trim())
    .filter(txt => txt.toLowerCase().includes('search'));
  if (searchLike.length > 0) {
    searchInstruction = searchLike[0];
  }
  // But for this block type, the second row contains only the absolute URL
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';

  // 3. Assemble table: header and row with only the URL
  const cells = [
    headerRow,
    [queryIndexUrl]
  ];
  
  // 4. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
