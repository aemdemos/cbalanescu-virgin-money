/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main heading (if present)
  const mainHeading = element.querySelector('.cm-rich-text h3, .cm-rich-text b, .cm-rich-text strong');

  // Find the cards container (the nested .sl-list.has-2-items)
  let cardsList = null;
  const nestedSlItem = element.querySelector('.sl-list.has-2-items:not(.has-feature-right)');
  if (nestedSlItem) {
    cardsList = nestedSlItem;
  }

  // Defensive: fallback if above fails
  if (!cardsList) {
    cardsList = element.querySelector('.sl-list.has-2-items');
  }

  // Gather all card items
  const cardRows = [];
  if (cardsList) {
    // Each card is a .sl-item containing one or more .cq-dd-paragraph > section.cm-content-tile
    const cardItems = Array.from(cardsList.querySelectorAll(':scope > .sl-item'));
    cardItems.forEach((cardItem) => {
      const paragraphs = Array.from(cardItem.querySelectorAll(':scope > .cq-dd-paragraph'));
      paragraphs.forEach((para) => {
        const section = para.querySelector('section.cm-content-tile');
        if (section) {
          // Image (first img in .image)
          const image = section.querySelector('.image img');
          // Text content
          const contentDiv = section.querySelector('.content');
          const textNodes = [];
          if (contentDiv) {
            // Heading
            const heading = contentDiv.querySelector('h3');
            if (heading) textNodes.push(heading);
            // Description paragraphs (exclude .subheading)
            const descParas = Array.from(contentDiv.querySelectorAll('p:not(.subheading)'));
            descParas.forEach((p) => {
              textNodes.push(p);
            });
          }
          cardRows.push([
            image ? image : '',
            textNodes.length ? textNodes : ''
          ]);
        }
      });
    });
  }

  // Compose table cells
  const cells = [];
  // Header row (block name)
  cells.push(['Cards (cards12)']);
  // If there's a main heading, add it as a row (optional, visually matches screenshot)
  if (mainHeading) {
    cells.push(['', mainHeading]);
  }
  // Add each card row
  cardRows.forEach((row) => {
    cells.push(row);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
