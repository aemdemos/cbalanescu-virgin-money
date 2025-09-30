/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a section
  function extractCard(section) {
    // Find image (mandatory)
    const img = section.querySelector('.image img');
    // Find content container
    const content = section.querySelector('.content');
    // Title (optional, h3 or b)
    let title = content.querySelector('h3, .header');
    // Description (first non-empty <p> after title)
    let desc = null;
    const ps = Array.from(content.querySelectorAll('p'));
    // Find first non-empty p that isn't the subheading or CTA
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (
        p.classList.contains('subheading') ||
        (p.querySelector('a') && p.textContent.trim().length <= 0)
      ) {
        continue;
      }
      if (!desc && p.textContent.trim().length > 0 && !p.querySelector('a')) {
        desc = p;
        break;
      }
    }
    // CTA (optional, <a> inside a <p> after desc)
    let cta = null;
    for (let i = 0; i < ps.length; i++) {
      const a = ps[i].querySelector('a');
      if (a) {
        cta = ps[i];
        break;
      }
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title.cloneNode(true));
    if (desc) textCell.appendChild(desc.cloneNode(true));
    if (cta) textCell.appendChild(cta.cloneNode(true));
    // Compose row
    return [img, textCell];
  }

  // Find all cards (sections)
  const cards = Array.from(element.querySelectorAll('section.cm-content-tile'));
  // Defensive: If not found, try fallback
  if (cards.length === 0) {
    // Try to find .image and .content pairs
    const slItems = Array.from(element.querySelectorAll('.sl-item'));
    slItems.forEach(item => {
      const sections = Array.from(item.querySelectorAll('section'));
      cards.push(...sections);
    });
  }

  // Build table rows
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];
  cards.forEach(section => {
    rows.push(extractCard(section));
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
