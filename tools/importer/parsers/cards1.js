/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row as in example
  const rows = [['Cards (cards1)']];

  // Find all card sections
  const slItems = element.querySelectorAll('.sl-item');
  slItems.forEach((slItem) => {
    const sections = slItem.querySelectorAll('section.cm.cm-icon-title');
    sections.forEach((section) => {
      // First column: the <img> from section .header
      const img = section.querySelector('.header img');
      // Second column: all text content (title, description, cta)
      const textContent = document.createElement('div');
      // Title (h2)
      const h2 = section.querySelector('.header h2');
      if (h2) {
        const strong = document.createElement('strong');
        strong.textContent = h2.textContent.trim();
        textContent.appendChild(strong);
        textContent.appendChild(document.createElement('br'));
      }
      // Description(s)
      const contentPs = section.querySelectorAll('.content p');
      if (contentPs.length) {
        // The first <p> or all <p> except last if last contains CTA link
        let descPs = Array.from(contentPs);
        const lastP = contentPs[contentPs.length - 1];
        const hasLink = lastP && lastP.querySelector('a');
        if (hasLink && contentPs.length > 1) {
          descPs = Array.from(contentPs).slice(0, -1);
        }
        descPs.forEach((p, idx) => {
          // Add description, skip empty
          if (p.textContent.trim()) {
            const span = document.createElement('span');
            span.innerHTML = p.innerHTML.trim(); // preserve possible inline markup
            textContent.appendChild(span);
            if (idx < descPs.length - 1) {
              textContent.appendChild(document.createElement('br'));
            }
          }
        });
        if (descPs.length) {
          textContent.appendChild(document.createElement('br'));
        }
      }
      // CTA (last <p> with <a>)
      const lastP = contentPs[contentPs.length - 1];
      if (lastP && lastP.querySelector('a')) {
        // Reference the actual <a> from the DOM
        const a = lastP.querySelector('a');
        if (a) textContent.appendChild(a);
      }
      rows.push([img, textContent]);
    });
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
