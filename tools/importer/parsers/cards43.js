/* global WebImporter */
export default function parse(element, { document }) {
  // cards43 block header
  const headerRow = ['Cards (cards43)'];

  // Select all card elements (immediate .sl-item children)
  const cardNodes = Array.from(element.querySelectorAll('.sl-list > .sl-item'));
  const rows = cardNodes.map(cardNode => {
    // Find the card content root
    const rich = cardNode.querySelector('.cm-rich-text');
    // Image: find first img in the card
    const img = rich ? rich.querySelector('img') : null;
    // Title: the h5
    const title = rich ? rich.querySelector('h5') : null;
    // Find all p tags
    const ps = rich ? Array.from(rich.querySelectorAll('p')) : [];
    // Find the paragraph containing the img (skip for description/call-to-action)
    const imgP = ps.find(p => p.querySelector('img'));
    // Find the paragraph containing a link (potentially CTA)
    const ctaP = ps.find(p => p.querySelector('a'));
    // Description: p that's not the image or CTA p (if any)
    const descP = ps.find(p => p !== imgP && p !== ctaP);

    // Compose the text cell in order: title, description, CTA
    const textCell = [];
    if (title) textCell.push(title);
    if (descP) textCell.push(descP);
    if (ctaP) textCell.push(ctaP);

    // Place image in first cell, text in second
    return [img, textCell];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
