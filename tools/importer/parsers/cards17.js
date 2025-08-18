/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example exactly
  const headerRow = ['Cards (cards17)'];

  // Find all immediate card elements
  // .sl-item > section > div > .image and .content
  const cardItems = Array.from(element.querySelectorAll('.sl-item'));

  const rows = cardItems.map(cardItem => {
    // Defensive: find the section
    const section = cardItem.querySelector('section');
    if (!section) return null;
    // Find image and content containers
    // Structure: section > div > .image and .content
    const mainDiv = section.querySelector(':scope > div');
    if (!mainDiv) return null;
    // Get all direct children (should be .image and .content)
    const children = Array.from(mainDiv.children);
    let imageDiv = children.find(c => c.classList.contains('image'));
    let contentDiv = children.find(c => c.classList.contains('content'));
    if (!imageDiv || !contentDiv) return null;
    // Image cell: use <img> directly if exists
    const imgEl = imageDiv.querySelector('img') || null;
    // Text cell: use the .content block directly (includes heading, lists, text, ctas)
    const textEl = contentDiv;
    // Ensure at least one valid cell
    if (!imgEl && !textEl) return null;
    return [imgEl, textEl];
  }).filter(Boolean);

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
