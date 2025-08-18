/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: must match example exactly
  const headerRow = ['Hero (hero49)'];

  // 2. Extract background image as <img> using inline CSS
  let imageElem = null;
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv && bgDiv.style.backgroundImage) {
    const bgUrlMatch = bgDiv.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (bgUrlMatch && bgUrlMatch[1]) {
      imageElem = document.createElement('img');
      imageElem.src = bgUrlMatch[1];
      const altSpan = bgDiv.querySelector('span.vh');
      imageElem.alt = altSpan ? altSpan.textContent.trim() : '';
    }
  }

  // 3. Compose content for the third row
  //    - Use all children of .content in order, transforming CTA span to link
  let contentBlock = document.createElement('div');
  const contentDiv = element.querySelector('.content');
  if (contentDiv) {
    Array.from(contentDiv.childNodes).forEach(node => {
      // Convert CTA span to <a> with href
      if (node.nodeType === 1 && node.classList.contains('cta')) {
        // Find closest anchor up the tree
        let parentLink = node.closest('a');
        if (!parentLink) parentLink = element.querySelector('a');
        if (parentLink && parentLink.getAttribute('href')) {
          const link = document.createElement('a');
          link.href = parentLink.getAttribute('href');
          link.textContent = node.textContent.trim();
          contentBlock.appendChild(link);
        } else {
          contentBlock.appendChild(document.createTextNode(node.textContent));
        }
      } else {
        // Reference existing nodes in order
        if (node.nodeType === 1 || node.nodeType === 3) {
          contentBlock.appendChild(node);
        }
      }
    });
  }

  // 4. Compose the table: 1 column, 3 rows
  const rows = [
    headerRow,
    [imageElem ? imageElem : ''],
    [contentBlock]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace original element
  element.replaceWith(table);
}
