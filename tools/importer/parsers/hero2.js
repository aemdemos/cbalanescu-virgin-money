/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as in the example
  const headerRow = ['Hero (hero2)'];

  // 2. Extract background image, using the correct alt from .vh span if present
  let imageEl = null;
  const bgDiv = element.querySelector('.intrinsic-el');
  if (bgDiv && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
    let imgUrl = match && match[1] ? match[1] : '';
    if (imgUrl) {
      // Convert to absolute URL if needed
      if (imgUrl.startsWith('/')) {
        const a = document.createElement('a');
        a.href = imgUrl;
        imgUrl = a.href;
      }
      let alt = '';
      const altSpan = bgDiv.querySelector('span');
      if (altSpan) {
        alt = altSpan.textContent.trim();
      }
      imageEl = document.createElement('img');
      imageEl.src = imgUrl;
      if (alt) imageEl.alt = alt;
    }
  }

  // 3. Extract all visible text content from the block
  // For this specific HTML, relevant text is in the .vh span, which is also used for the image alt
  // But in case of future blocks, collect unique visible text nodes (excluding ones already used as alt)
  // We'll only include text that is not the same as the image alt
  let textContentArr = [];
  const allTextNodes = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');
  let altText = imageEl && imageEl.alt ? imageEl.alt : '';
  allTextNodes.forEach((node) => {
    const txt = node.textContent && node.textContent.trim();
    // Only add unique text, and skip if same as image alt
    if (txt && txt !== altText && !textContentArr.includes(txt)) {
      textContentArr.push(txt);
    }
  });
  // Fallback: If nothing found, but .vh existed, and we haven't pushed it, add it
  if (textContentArr.length === 0 && altText) {
    textContentArr.push(altText);
  }
  // For this block, join by line breaks
  let textCell = '';
  if (textContentArr.length > 0) {
    // Use <br> for line breaks as it will be rendered as expected
    textCell = document.createElement('div');
    textCell.innerHTML = textContentArr.join('<br>');
  }

  // 4. Compose the rows: 1 col, 3 rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [textCell ? textCell : '']
  ];

  // 5. Create table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
