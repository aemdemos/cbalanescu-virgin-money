/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name and variant
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Locate all card sections: section.cm-content-tile
  // Only those within the nested .sl-list > .sl-item > .cq-dd-paragraph > section
  const cardSections = element.querySelectorAll('section.cm-content-tile');

  cardSections.forEach((section) => {
    // First cell: image (mandatory)
    let imageEl = null;
    const img = section.querySelector('.image img');
    if (img) imageEl = img;
    // Second cell: all text content
    const contentDiv = section.querySelector('.content');
    const textContent = [];
    if (contentDiv) {
      // Heading (h3, possibly with <b> inside)
      const heading = contentDiv.querySelector('h3');
      if (heading) textContent.push(heading);
      // All <p> elements except those with only whitespace, and except if they ONLY wrap the CTA
      const ps = Array.from(contentDiv.querySelectorAll('p'));
      ps.forEach((p) => {
        // Ignore empty <p>
        if (!p.textContent.trim()) return;
        // If the <p> only contains a CTA anchor, skip it here, handled below
        const onlyChild = p.children.length === 1 && p.querySelector('a');
        if (onlyChild && p.textContent.trim() === p.querySelector('a').textContent.trim()) return;
        textContent.push(p);
      });
      // CTA: any anchor containing .cta span
      const cta = contentDiv.querySelector('a .cta')?.closest('a');
      if (cta) textContent.push(cta);
    }
    rows.push([imageEl, textContent]);
  });

  // Build and replace the original element with the cards table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
