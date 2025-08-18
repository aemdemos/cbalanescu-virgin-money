/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the HTML structure
  function getCards(el) {
    const slList = el.querySelector('.sl-list');
    if (!slList) return [];
    // Each .sl-item contains up to 2 cards (<section>)
    const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
    const cards = [];
    items.forEach(item => {
      const sections = Array.from(item.querySelectorAll(':scope > section.cm-icon-title'));
      sections.forEach(section => {
        // Icon (image)
        const img = section.querySelector('.header img');
        // Title (h2 inside .header)
        const heading = section.querySelector('.header h2');
        // Description and CTA (in .content)
        const contentDiv = section.querySelector('.content');
        const textContent = [];

        // Title: strong element (preserving heading semantics)
        if (heading) {
          const strong = document.createElement('strong');
          strong.textContent = heading.textContent.trim();
          textContent.push(strong);
        }

        if (contentDiv) {
          // All paragraphs (could be description or CTA)
          const paragraphs = Array.from(contentDiv.querySelectorAll('p'));
          paragraphs.forEach(p => {
            // Paragraph with link: treat as CTA, include link directly
            const a = p.querySelector('a');
            if (a) {
              textContent.push(a);
            } else {
              textContent.push(p);
            }
          });
        }
        // Remove empty textContent (rare edge case)
        if (textContent.length === 0) textContent.push(document.createTextNode(''));
        cards.push([
          img,
          textContent
        ]);
      });
    });
    return cards;
  }

  const headerRow = ['Cards (cards1)'];
  const cardsRows = getCards(element);
  const cells = [headerRow, ...cardsRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
