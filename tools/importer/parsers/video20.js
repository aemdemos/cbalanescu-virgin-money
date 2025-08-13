/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example exactly
  const headerRow = ['Video'];

  // Find the main div with background-image and get the image URL
  const bgDiv = element.querySelector('.intrinsic-el.img');
  let imgEl = null;
  if (bgDiv) {
    const bgStyle = bgDiv.style.backgroundImage;
    const urlMatch = bgStyle.match(/url\((['"]?)(.*?)\1\)/);
    if (urlMatch && urlMatch[2]) {
      imgEl = document.createElement('img');
      imgEl.src = urlMatch[2].trim();
    }
  }

  // Collect all text content from all descendants (for accessibility and semantic preservation)
  const textContent = [];
  element.querySelectorAll('*').forEach((el) => {
    // Only include non-empty text and avoid duplicate blank content
    if (el.childNodes.length) {
      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textContent.push(node.textContent.trim());
        }
      });
    }
  });

  // Combine image and text content for the cell
  const cellContent = [];
  if (imgEl) cellContent.push(imgEl);
  // Combine all text into one string, if any
  if (textContent.length) cellContent.push(textContent.join(' '));
  if (cellContent.length === 0) cellContent.push('');

  // Structure matches the example: 1 header, 1 content row
  const cells = [
    headerRow,
    [cellContent.length === 1 ? cellContent[0] : cellContent]
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
