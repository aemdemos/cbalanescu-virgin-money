/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Cards (cards17)'];

  // Find all card blocks (sl-item)
  const slItems = element.querySelectorAll('.sl-item');
  const rows = [];

  slItems.forEach(item => {
    // Each card is: .sl-item > section > div
    // The first child div.image contains the image
    // The second child div.content contains the text info
    let imageEl = null;
    let contentEls = [];

    const section = item.querySelector('section');
    if (!section) return;
    const mainDiv = section.querySelector('div');
    if (!mainDiv) return;
    // Image cell
    const imgDiv = mainDiv.querySelector('.image');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) imageEl = img;
    }
    // Content cell: gather all content in .content
    const contentDiv = mainDiv.querySelector('.content');
    if (contentDiv) {
      // Add title (h3)
      const h3 = contentDiv.querySelector('h3');
      if (h3) contentEls.push(h3);
      // Add all <p> that have content (and are not just whitespace or &nbsp;)
      contentDiv.querySelectorAll('p').forEach(p => {
        if (p.textContent.trim() && p.innerHTML.trim() !== '&nbsp;') contentEls.push(p);
      });
      // Add all <ul>
      contentDiv.querySelectorAll('ul').forEach(ul => {
        contentEls.push(ul);
      });
    }
    // Add this card row
    rows.push([imageEl, contentEls]);
  });

  // Compose the cells for createTable
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
