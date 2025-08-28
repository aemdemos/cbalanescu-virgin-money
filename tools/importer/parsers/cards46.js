/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards46)'];

  // Locate the container holding the cards
  const cardsContainer = element.querySelector('.product-key-rates');
  if (!cardsContainer) return;
  const cardItems = Array.from(cardsContainer.children);

  const rows = cardItems.map((card) => {
    // 1st cell: Icon/image (must reference the actual element)
    const img = card.querySelector('img');
    // 2nd cell: Text content (Title and Description)
    const textCell = [];
    const titleSpan = card.querySelector('.key-value-text span');
    if (titleSpan) {
      // Preserve semantic meaning: in the example the title is bold, so use <strong>
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.push(strong);
    }
    // Description (may be p, or just text, with <b>, <br>, etc)
    const descDiv = card.querySelector('.key-top-text');
    if (descDiv) {
      // If there is a <p>, use it; else, push all child nodes (preserve <b>, <br>)
      const p = descDiv.querySelector('p');
      if (p) {
        textCell.push(p);
      } else {
        // Use all childNodes (including <b>, text, <br>, etc)
        Array.from(descDiv.childNodes).forEach((node) => {
          // Ignore empty text nodes
          if (node.nodeType === 3 && !node.textContent.trim()) return;
          textCell.push(node);
        });
      }
    }
    // If textCell ends up empty, leave it as empty string
    return [img || '', textCell.length ? textCell : ''];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
