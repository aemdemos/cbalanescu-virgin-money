/* global WebImporter */
export default function parse(element, { document }) {
  // Table header follows instructions exactly
  const headerRow = ['Columns (columns45)'];

  // 1. Find the .sl-list containing two .sl-item children (the columns)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // 2. LEFT COLUMN: Aggregate all relevant content sections
  const leftItem = slItems[0];
  // Get all .cq-dd-paragraph blocks except empty ones
  const paragraphs = Array.from(leftItem.querySelectorAll(':scope > .cq-dd-paragraph'));
  const leftContent = [];
  paragraphs.forEach(paragraph => {
    // Only push meaningful content (not just <br>)
    const hasRealContent = paragraph.textContent.trim().length > 0 || paragraph.querySelector('img') || paragraph.querySelector('h2,h3,h4');
    if (hasRealContent) {
      leftContent.push(paragraph);
    }
  });
  // Also check for any .cm.cm-rich-text outside a .cq-dd-paragraph (the final CTA/button)
  // This can be either a direct child of leftItem, or the last child
  Array.from(leftItem.children).forEach(child => {
    if (child.classList.contains('cm-rich-text') && !child.closest('.cq-dd-paragraph')) {
      leftContent.push(child);
    } else if (child.classList.contains('cm') && child.classList.contains('cm-rich-text') && !child.closest('.cq-dd-paragraph')) {
      leftContent.push(child);
    }
  });

  // If leftContent is empty, avoid blank column
  const leftCell = leftContent.length ? leftContent : document.createTextNode('');

  // 3. RIGHT COLUMN: Video element is expected, but if not found, fallback to all children
  const rightItem = slItems[1];
  let rightCell;
  const videoWrapper = rightItem.querySelector('div[style*="display: flex"]');
  if (videoWrapper) {
    const video = videoWrapper.querySelector('video');
    if (video) {
      // Per requirements, attach a link to the src of the <source> in <video>
      const source = video.querySelector('source');
      if (source && source.getAttribute('src')) {
        const link = document.createElement('a');
        link.href = source.getAttribute('src');
        link.textContent = source.getAttribute('src');
        rightCell = link;
      } else {
        rightCell = video;
      }
    } else {
      rightCell = videoWrapper;
    }
  } else {
    // fallback to all content in rightItem (safeguard for edge cases)
    rightCell = document.createDocumentFragment();
    Array.from(rightItem.childNodes).forEach(node => rightCell.appendChild(node));
  }

  // Compose final table structure
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create the table block and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
