/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the block table starting with the header row matching the example
  const cells = [['Cards (cards25)']];

  // Find the actual cards inside the deeply nested structure
  // Each card: section.cm-content-tile (one per card)
  const cardSections = Array.from(element.querySelectorAll('section.cm-content-tile'));

  cardSections.forEach(section => {
    // Extract image (first cell)
    let imgElem = null;
    const img = section.querySelector('.image img');
    if (img) {
      imgElem = img;
    }
    // Compose text content (second cell): heading, description, CTA
    const contentDiv = section.querySelector('.content');
    const textElems = [];
    if (contentDiv) {
      // Heading (h3) with <b> retained
      const heading = contentDiv.querySelector('h3');
      if (heading) {
        textElems.push(heading);
      }
      // Description (any <p> not subheading and not containing the CTA)
      const ps = Array.from(contentDiv.querySelectorAll('p'));
      ps.forEach(p => {
        if (
          !p.classList.contains('subheading') && // skip subheading (empty in example)
          !p.querySelector('a') && // skip CTA, handled later
          p.textContent.trim() // skip empty
        ) {
          textElems.push(p);
        }
      });
      // CTA (link inside last <p>, if present)
      const ctaP = Array.from(contentDiv.querySelectorAll('p')).find(p => p.querySelector('a'));
      if (ctaP) {
        const a = ctaP.querySelector('a');
        if (a) {
          textElems.push(a);
        }
      }
    }
    // Row: [imgElem, textElems]
    cells.push([
      imgElem,
      textElems.length === 1 ? textElems[0] : textElems
    ]);
  });

  // Create the table using the helper and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
