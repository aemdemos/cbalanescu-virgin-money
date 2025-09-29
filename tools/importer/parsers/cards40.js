/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a .cm-content-tile section
  function extractCard(section) {
    // Find the image element
    const img = section.querySelector('.image img');
    // Find the content container
    const content = section.querySelector('.content');
    if (!content) return null;

    // Title (h2.header > b)
    let title = content.querySelector('.header b');
    // Subtitle (p.subheading > span.subtitle > b)
    let subtitle = content.querySelector('.subheading .subtitle b');
    // Description: all <p> except .subheading and CTA <p>
    const descPs = Array.from(content.querySelectorAll('p'))
      .filter(p => !p.classList.contains('subheading') && !Array.from(p.querySelectorAll('a')).length);
    // CTA links: all <a> inside content
    const ctas = Array.from(content.querySelectorAll('a'));

    // Compose the text cell: title, subtitle, description(s), CTA(s)
    const frag = document.createDocumentFragment();
    if (title) {
      const h3 = document.createElement('h3');
      h3.appendChild(title.cloneNode(true));
      frag.appendChild(h3);
    }
    if (subtitle) {
      const sub = document.createElement('div');
      sub.appendChild(subtitle.cloneNode(true));
      frag.appendChild(sub);
    }
    descPs.forEach(p => {
      if (p.textContent.trim()) {
        frag.appendChild(p.cloneNode(true));
      }
    });
    // Add CTA links at the end, if any
    if (ctas.length) {
      const ctaDiv = document.createElement('div');
      ctas.forEach(a => {
        ctaDiv.appendChild(a.cloneNode(true));
        ctaDiv.appendChild(document.createTextNode(' '));
      });
      frag.appendChild(ctaDiv);
    }

    return [img, frag];
  }

  // Find all card sections
  const sections = element.querySelectorAll('section.cm-content-tile');
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards40)'];
  rows.push(headerRow);
  // Each card row: [image, text content]
  sections.forEach(section => {
    const card = extractCard(section);
    if (card) rows.push(card);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
