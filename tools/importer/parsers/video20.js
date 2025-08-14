/* global WebImporter */
export default function parse(element, { document }) {
  // Table header - must exactly match example
  const headerRow = ['Video'];

  const cellContent = [];

  // Extract background image as poster
  const imgDiv = element.querySelector('.intrinsic-el.img');
  if (imgDiv && imgDiv.style && imgDiv.style.backgroundImage) {
    const match = imgDiv.style.backgroundImage.match(/url\(("|')?(.*?)("|')?\)/);
    if (match && match[2]) {
      const src = match[2].trim();
      if (src) {
        const posterImg = document.createElement('img');
        posterImg.src = src;
        posterImg.alt = '';
        cellContent.push(posterImg);
      }
    }
  }

  // Include ALL textContent from the original element
  // Only add if non-empty and not whitespace
  const text = (element.textContent || '').trim();
  if (text) {
    cellContent.push(document.createTextNode(text));
  }

  // If no content found, ensure there's at least an empty string
  if (cellContent.length === 0) {
    cellContent.push('');
  }

  const rows = [headerRow, [cellContent]];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
