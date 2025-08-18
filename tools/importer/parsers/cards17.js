/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row exactly as required
  const headerRow = ['Cards (cards17)'];
  const cells = [headerRow];

  // Get all card items
  const items = element.querySelectorAll('.sl-item');

  items.forEach((item) => {
    const section = item.querySelector('.cm-content-tile');
    if (!section) return;

    // Image: find first <img> inside .image
    let imgEl = null;
    const imageWrapper = section.querySelector('.image');
    if (imageWrapper) {
      imgEl = imageWrapper.querySelector('img');
    }

    // Content cell (text, headings, lists, CTA links)
    const contentEl = section.querySelector('.content');
    const textContent = [];
    if (contentEl) {
      // Heading (h3.header) - reference directly
      const heading = contentEl.querySelector('h3.header');
      if (heading) textContent.push(heading);

      // Include all <p> and <ul> except .subheading
      contentEl.childNodes.forEach((child) => {
        if (child.nodeType === 1) {
          // Exclude <p class="subheading">
          if (child.matches('p.subheading')) return;
          // Exclude empty <p> unless it contains links (e.g., for CTA)
          if (child.matches('p') && child.textContent.trim() === '' && !child.querySelector('a')) return;
          // Include <p> and <ul>
          if (child.matches('p, ul')) {
            textContent.push(child);
          }
        }
      });
    }

    // Final row: [image, all text/links]
    cells.push([imgEl, textContent]);
  });

  // Create table and replace element
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
