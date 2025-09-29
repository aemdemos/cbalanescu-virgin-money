/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content panel
  const panel = element.querySelector('.cm-content-panel-container');
  // Find the rich text block inside the panel
  const richText = panel && panel.querySelector('.cm-rich-text');

  // --- 1. Table Header: Must match target block name exactly ---
  const headerRow = ['Hero (hero25)'];

  // --- 2. Background Image Row: empty, as there is no image in source HTML ---
  const bgImageRow = [''];

  // --- 3. Content Row: preserve semantic structure ---
  // Compose a fragment with all richText children (headings, paragraphs, links)
  let contentFragment = document.createDocumentFragment();
  if (richText) {
    Array.from(richText.children).forEach((child) => {
      // Reference existing elements (do not clone)
      contentFragment.appendChild(child);
    });
  } else {
    // Edge case: fallback to panel if richText is missing
    Array.from(panel.children).forEach((child) => {
      contentFragment.appendChild(child);
    });
  }
  // If fragment is empty (edge case), insert an empty cell
  const contentRow = [contentFragment.childNodes.length ? contentFragment : ''];

  // --- 4. Create the table block ---
  const rows = [headerRow, bgImageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // --- 5. Replace the original element ---
  element.replaceWith(block);
}
