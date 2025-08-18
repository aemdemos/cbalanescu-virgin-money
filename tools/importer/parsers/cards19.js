/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in requirements
  const headerRow = ['Cards (cards19)'];
  const cells = [headerRow];

  // Find the container of card items
  const cardList = element.querySelector('.sl-list');
  if (!cardList) return;
  // Each card is a direct child .sl-item
  const cardItems = Array.from(cardList.querySelectorAll(':scope > .sl-item'));

  cardItems.forEach(cardItem => {
    // Each card has a section
    const section = cardItem.querySelector('section.cm-content-tile');
    if (!section) return;
    // Image: .image > img
    const img = section.querySelector('img');
    // Link containing text: a.cm-image-block-link
    const link = section.querySelector('a.cm-image-block-link');
    if (!img || !link) return;
    // The heading text: h2.header (optional)
    const h2 = link.querySelector('h2.header');

    // Compose content for the second cell
    // Retain heading as <h2>, then optionally wrap in link if needed
    let textElements = [];
    if (h2) {
      // Use the heading element directly
      textElements.push(h2);
    }
    // No other text content is present, so nothing else to add
    // Add link as CTA if the link's href is not just for the image
    // In this block, clicking anywhere on the card goes to the link, so it's appropriate to show the link
    // But don't duplicate the heading
    // We'll make the heading clickable by wrapping it in a link
    if (h2 && link.getAttribute('href')) {
      // Remove h2 from textElements, wrap it in link
      textElements = [];
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.appendChild(h2);
      textElements.push(a);
    } else if (link.getAttribute('href')) {
      // If no heading, use link text
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = link.textContent.trim();
      textElements.push(a);
    }

    // Build row: [image, text cell]
    cells.push([img, textElements]);
  });

  // Create the table block and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
