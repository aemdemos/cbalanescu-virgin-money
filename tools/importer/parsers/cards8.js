/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const rows = [['Cards (cards8)']];

  // Find all card items within this block (optimized for robustness)
  const cardItems = element.querySelectorAll('.sl-list > .sl-item');
  cardItems.forEach((item) => {
    // Find the image inside the current card
    const img = item.querySelector('img');
    // Find the link around the card (to also extract the title text and use as CTA if needed)
    const link = item.querySelector('a');
    // Find the heading (h2) inside the card
    const h2 = item.querySelector('h2');

    // Image cell -- always required per spec
    const imageCell = img ? img : '';

    // Text cell
    // For this example, the card's title is always in an <h2>, and appears to be the only textual content
    // (no additional description, no CTA text at bottom, but the link wraps the image/title)
    // We will include both h2 (for heading) and (optionally) the link as CTA, if needed

    // If the heading is inside the link, we want just the heading (for semantic meaning)
    // But block spec allows for CTA at the bottom if present, so we consider that
    let textCellContent = [];
    if (h2) {
      // Reference the heading directly
      textCellContent.push(h2);
    }
    // Optionally add a CTA link at the bottom if the link is present and not already used for title
    // But in the provided HTML, the link wraps both image and heading, so we skip redundant CTA
    // (if there was a distinct CTA, we'd add it)
    // If no h2, but there is a link, fallback to link's text
    if (!h2 && link) {
      textCellContent.push(link);
    }
    // If nothing, fallback to empty string
    if (textCellContent.length === 0) textCellContent = [''];

    rows.push([
      imageCell,
      textCellContent.length === 1 ? textCellContent[0] : textCellContent,
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
