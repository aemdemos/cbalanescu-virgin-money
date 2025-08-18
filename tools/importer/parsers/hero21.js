/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background image URL from inline style
  let bgImgElem = '';
  let textElems = [];

  // Try to find the image element and any text inside it
  const intrinsicEl = element.querySelector('.intrinsic-el.img');
  if (intrinsicEl) {
    // Get background image
    if (intrinsicEl.style && intrinsicEl.style.backgroundImage) {
      const bg = intrinsicEl.style.backgroundImage;
      const matched = bg.match(/url\(["']?(.*?)["']?\)/);
      if (matched && matched[1] && matched[1].trim()) {
        const img = document.createElement('img');
        img.src = matched[1].trim();
        bgImgElem = img;
      }
    }
    // Get all text content inside img container, referencing original nodes
    intrinsicEl.childNodes.forEach((child) => {
      if (child.nodeType === 1 && child.textContent.trim()) {
        textElems.push(child);
      }
    });
  }

  // Compose the block table according to the required format
  const headerRow = ['Hero (hero21)'];
  const imageRow = [bgImgElem ? bgImgElem : ''];
  const contentRow = [textElems.length ? textElems : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
