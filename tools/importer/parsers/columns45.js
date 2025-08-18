/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match: 'Columns (columns45)'
  const headerRow = ['Columns (columns45)'];

  // Find the two side-by-side main column items
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // Left column: all cq-dd-paragraph blocks, which include icon-title sections and rich text sections
  const leftItem = slItems[0];
  let leftNodes = [];
  if (leftItem) {
    // Collect all .cq-dd-paragraph children in order
    const paragraphs = Array.from(leftItem.querySelectorAll(':scope > .cq-dd-paragraph'));
    // Also find any .cm-rich-text.module__content.l-full-width that may be direct child of leftItem (covers button at end)
    const extraRichText = Array.from(leftItem.querySelectorAll(':scope > .cm-rich-text.module__content.l-full-width'));
    // Combine, removing duplicates
    const allBlocks = [...paragraphs];
    extraRichText.forEach(rt => {
      if (!allBlocks.includes(rt)) allBlocks.push(rt);
    });
    // Only include blocks that are not empty (ignore rich text blocks that have only <br>)
    leftNodes = allBlocks.filter(block => {
      // Keep if it has any text (not just <br>), or has an image, or a section
      if (block.textContent.trim()) return true;
      if (block.querySelector('img') || block.querySelector('section')) return true;
      return false;
    });
  }

  // Right column: contains the video block
  const rightItem = slItems[1];
  let rightNodes = [];
  if (rightItem) {
    // Find the <video> element
    const video = rightItem.querySelector('video');
    if (video) {
      // Per instructions: non-image src must be included as a link
      const source = video.querySelector('source');
      if (source && source.src) {
        const a = document.createElement('a');
        a.href = source.src;
        a.textContent = 'Video';
        rightNodes = [a];
      } else {
        rightNodes = [video];
      }
    } else {
      // If no video, include all children
      rightNodes = Array.from(rightItem.children).filter(node => node.textContent.trim() || node.querySelector('img'));
    }
  }

  // The block table: header, then one row, two columns (left, right)
  const cells = [
    headerRow,
    [leftNodes, rightNodes]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
