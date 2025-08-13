/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row: must match the example exactly
  const headerRow = ['Hero (hero41)'];

  // 2. Image row: find background image, use as <img> with alt if possible
  let imageRow = [''];
  const imgDiv = element.querySelector('.intrinsic-el.img');
  if (imgDiv) {
    const style = imgDiv.style.backgroundImage;
    if (style) {
      const urlMatch = style.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        const img = document.createElement('img');
        img.src = urlMatch[1];
        // Use visually hidden span for alt text
        const altSpan = imgDiv.querySelector('span');
        img.alt = altSpan ? altSpan.textContent.trim() : '';
        imageRow = [img];
      }
    }
  }

  // 3. Content row: gather all content as per source HTML, maintain semantic meaning
  let contentRow = [''];
  const contentDiv = element.querySelector('.content');
  if (contentDiv) {
    const parts = [];
    // Find header (could contain HTML tags), preserve structure
    const header = contentDiv.querySelector('.header');
    if (header) parts.push(header);
    // Find subtitle if it contains meaningful content
    const subtitle = contentDiv.querySelector('.subtitle');
    if (subtitle && subtitle.textContent.trim()) {
      parts.push(subtitle);
    }
    // All <p> direct children of contentDiv not inside .header
    contentDiv.querySelectorAll('p').forEach(p => {
      if (!header || !header.contains(p)) parts.push(p);
    });
    // If for some reason no parts, include leftover text in contentDiv as fallback
    if (parts.length === 0 && contentDiv.textContent.trim()) {
      parts.push(document.createTextNode(contentDiv.textContent.trim()));
    }
    // Only if parts has members use it, otherwise leave empty
    if (parts.length > 0) {
      contentRow = [parts];
    }
  }

  // Compose and replace
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
