/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as per block spec
  const headerRow = ['Cards (cardsNoImages11)'];
  const rows = [headerRow];

  // Defensive: find all .sl-item (each column in the source)
  const slItems = element.querySelectorAll(':scope .sl-item');

  // Each .sl-item contains one or more cards (sections)
  slItems.forEach((slItem) => {
    // Each card is a <section class="cm cm-icon-title is-medium">
    const cards = slItem.querySelectorAll(':scope > section.cm-icon-title, :scope > section.cm.cm-icon-title');
    cards.forEach((card) => {
      // Defensive: get the header (title) and content (description, CTA)
      const headerDiv = card.querySelector(':scope > .header');
      const contentDiv = card.querySelector(':scope > .content');

      // Build card cell content
      const cellContent = [];

      // Heading (optional)
      if (headerDiv) {
        // Try to find h3 or h2 inside header
        const heading = headerDiv.querySelector('h3, h2, h4, h5, h6');
        if (heading) {
          // Use a strong or b if present, else use heading text
          const strong = heading.querySelector('b, strong');
          if (strong) {
            // Create a <p><strong>...</strong></p>
            const h = document.createElement('p');
            const s = document.createElement('strong');
            s.textContent = strong.textContent;
            h.appendChild(s);
            cellContent.push(h);
          } else {
            const h = document.createElement('p');
            const s = document.createElement('strong');
            s.textContent = heading.textContent;
            h.appendChild(s);
            cellContent.push(h);
          }
        }
      }

      // Description (optional)
      if (contentDiv) {
        // All <p> except those that only contain a link (CTA)
        const ps = Array.from(contentDiv.querySelectorAll('p'));
        ps.forEach((p) => {
          // If this <p> only contains a link, treat as CTA
          const onlyLink = p.childNodes.length === 1 && p.querySelector('a') && p.textContent.trim() === p.querySelector('a').textContent.trim();
          if (!onlyLink) {
            // Clone to avoid moving from DOM
            cellContent.push(p.cloneNode(true));
          }
        });
        // CTA (optional): look for <a> inside <p> (at the bottom)
        ps.forEach((p) => {
          const a = p.querySelector('a');
          const onlyLink = a && p.childNodes.length === 1 && p.textContent.trim() === a.textContent.trim();
          if (onlyLink) {
            // Place CTA at the end
            const ctaP = document.createElement('p');
            ctaP.appendChild(a.cloneNode(true));
            cellContent.push(ctaP);
          }
        });
      }

      // Add the card row if there is content
      if (cellContent.length > 0) {
        rows.push([cellContent]);
      }
    });
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
