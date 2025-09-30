/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract text content from a node, removing extra whitespace
  function getTextContent(node) {
    return node ? node.textContent.trim() : '';
  }

  // Table header as per block requirements
  const headerRow = ['Cards (cards28)'];
  const rows = [headerRow];

  // Find all card items
  const slItems = element.querySelectorAll('.sl-item');

  slItems.forEach((item) => {
    // Find image (mandatory)
    const img = item.querySelector('.image img');
    // Defensive: if image is wrapped in a link, use the <img> itself
    const imageEl = img;

    // Find content container
    const content = item.querySelector('.content');

    // Extract title (h2.header > b)
    let titleEl = null;
    const h2 = content && content.querySelector('h2.header');
    if (h2) {
      // Use the <b> inside h2 if present, else the h2 itself
      const b = h2.querySelector('b');
      titleEl = b ? b : h2;
    }

    // Extract subtitle (p.subheading > span.subtitle > b)
    let subtitleEl = null;
    const subheading = content && content.querySelector('p.subheading');
    if (subheading) {
      const subtitle = subheading.querySelector('span.subtitle > b');
      subtitleEl = subtitle ? subtitle : subheading;
    }

    // Extract description (first <p> after subheading)
    let descriptionEl = null;
    if (content) {
      // Get all <p> in content
      const ps = Array.from(content.querySelectorAll('p'));
      // Find the index of the subheading <p>
      const subIdx = ps.findIndex(p => p.classList.contains('subheading'));
      // The next <p> after subheading is the description
      if (subIdx > -1 && ps[subIdx + 1]) {
        descriptionEl = ps[subIdx + 1];
      }
    }

    // Extract CTAs (last <p> in content, which contains <a> links)
    let ctaEls = [];
    if (content) {
      // The last <p> is usually the CTA container
      const ps = Array.from(content.querySelectorAll('p'));
      if (ps.length > 0) {
        const lastP = ps[ps.length - 1];
        // Only include <a> links
        const links = Array.from(lastP.querySelectorAll('a'));
        // Defensive: only add if there are links
        if (links.length > 0) {
          ctaEls = links;
        }
      }
    }

    // Build the text cell contents
    const textCellContent = [];
    if (titleEl) {
      // Use <strong> for heading style
      const strong = document.createElement('strong');
      strong.textContent = getTextContent(titleEl);
      textCellContent.push(strong);
    }
    if (subtitleEl) {
      // Subtitle in uppercase, styled as small
      const small = document.createElement('div');
      small.style.textTransform = 'uppercase';
      small.style.fontSize = '0.85em';
      small.textContent = getTextContent(subtitleEl);
      textCellContent.push(small);
    }
    if (descriptionEl) {
      // Description as a paragraph
      const descP = document.createElement('p');
      // Copy child nodes to keep <sup> etc.
      Array.from(descriptionEl.childNodes).forEach(node => descP.appendChild(node.cloneNode(true)));
      textCellContent.push(descP);
    }
    if (ctaEls.length > 0) {
      // CTAs as a div of links
      const ctaDiv = document.createElement('div');
      ctaEls.forEach(link => {
        // Clone to avoid moving from original DOM
        ctaDiv.appendChild(link.cloneNode(true));
        ctaDiv.appendChild(document.createTextNode(' ')); // spacing
      });
      textCellContent.push(ctaDiv);
    }

    // Add the row: [image, text cell]
    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
