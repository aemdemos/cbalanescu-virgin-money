/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a content-tile section
  function extractCard(section) {
    // Find image
    const img = section.querySelector('.image img');
    // Find text content
    const contentDiv = section.querySelector('.content');
    let textElements = [];
    if (contentDiv) {
      // Title (as heading)
      const heading = contentDiv.querySelector('.header');
      if (heading) textElements.push(heading);
      // Description (first non-empty <p> after heading)
      const ps = contentDiv.querySelectorAll('p');
      for (const p of ps) {
        if (p.classList.contains('subheading')) continue;
        // Exclude CTA links
        if (p.querySelector('a')) continue;
        if (p.textContent.trim()) {
          textElements.push(p);
          break;
        }
      }
      // CTA (last <p> containing a link)
      for (const p of Array.from(ps).reverse()) {
        const a = p.querySelector('a');
        if (a) {
          textElements.push(p);
          break;
        }
      }
    }
    return [img, textElements];
  }

  // Find all .cm-content-tile sections
  const cards = Array.from(element.querySelectorAll('section.cm-content-tile'));

  // Build rows for WebImporter.DOMUtils.createTable
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  cards.forEach(section => {
    const [img, textElements] = extractCard(section);
    if (img && textElements.length) {
      rows.push([img, textElements]);
    }
  });

  // Use WebImporter.DOMUtils.createTable to create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
