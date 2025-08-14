/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matching the example
  const headerRow = ['Cards (cards38)'];

  // Get all card sections
  const cardSections = Array.from(element.querySelectorAll(':scope .sl-list > .sl-item > section'));
  const rows = cardSections.map(section => {
    // -------- Image cell --------
    // Find the first <img> inside the section (not a link)
    const img = section.querySelector('img');

    // -------- Text cell --------
    // Find the content block
    const contentDiv = section.querySelector('.content');
    // We'll collect heading, all paragraphs (including those with CTAs)
    const cellContent = [];
    if (contentDiv) {
      // Heading (usually <h3>)
      const heading = contentDiv.querySelector('h3, h2');
      if (heading) cellContent.push(heading);
      // All paragraphs
      const ps = Array.from(contentDiv.querySelectorAll('p'));
      ps.forEach(p => {
        // Only push if there's meaningful content (text or links)
        if (p.textContent.trim() || p.querySelector('a')) {
          cellContent.push(p);
        }
      });
    }
    // Ensure all text and links are included, and original elements used
    return [img, cellContent];
  });

  // Build final table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
