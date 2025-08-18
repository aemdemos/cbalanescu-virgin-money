/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row, exactly as in the example
  const headerRow = ['Cards (cards25)'];

  // Find all the .cm-content-tile sections (the cards)
  const cardSections = element.querySelectorAll('section.cm-content-tile');
  const rows = [];

  cardSections.forEach((section) => {
    // First cell: the image (mandatory)
    const image = section.querySelector('.image img');

    // Second cell: gather heading, description, and CTA (all from .content)
    const content = section.querySelector('.content');
    const cellContent = [];

    // Heading (bold h3)
    const heading = content.querySelector('.header');
    if (heading && heading.textContent.trim()) {
      cellContent.push(heading);
    }

    // Descriptions (all <p> elements except subheading and CTA)
    // Note: subheading is always present but empty; skip it
    // CTA is the <a> in <p> with .cta inside
    const ps = Array.from(content.querySelectorAll('p'));
    ps.forEach((p) => {
      // Ignore <p class="subheading">
      if (p.classList.contains('subheading')) return;

      // Check if this is the CTA (has .cta span inside an <a>)
      const cta = p.querySelector('.cta');
      if (cta) {
        // Keep CTA <p> exactly as is so the structure and link are maintained
        cellContent.push(p);
      } else if (p.textContent.trim()) {
        // Descriptive paragraph
        cellContent.push(p);
      }
    });

    // Compose the row, referencing the actual img and content as required
    rows.push([
      image,
      cellContent
    ]);
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}