/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Columns (columns45)'];

  // Find the .sl-list which contains the 2 columns (sl-items)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length !== 2) return;

  // --- Left column: All cm-icon-title sections + final rich-text CTA ---
  const leftItem = slItems[0];
  // Only direct children of leftItem with meaningful content
  // Get all icon-title sections (these are <section> elements)
  const iconTitleSections = Array.from(
    leftItem.querySelectorAll(':scope .cm-icon-title')
  );
  // Find all rich text blocks inside leftItem
  const richTexts = Array.from(leftItem.querySelectorAll(':scope .cm-rich-text'));
  // Find the last rich text block inside leftItem that contains a link (CTA)
  let cta = null;
  for (let i = richTexts.length - 1; i >= 0; i--) {
    if (richTexts[i].querySelector('a')) {
      cta = richTexts[i];
      break;
    }
  }
  // Compose left column cell: all iconTitleSections + CTA (if exists)
  const leftColumnContent = [...iconTitleSections];
  if (cta) leftColumnContent.push(cta);

  // --- Right column: video or image ---
  const rightItem = slItems[1];
  // Try to find video first
  let rightMedia = rightItem.querySelector('video');
  let rightColumnContent = null;
  if (rightMedia) {
    // Video: replace with a link to the video's src
    const videoSource = rightMedia.querySelector('source');
    if (videoSource && videoSource.src) {
      const link = document.createElement('a');
      link.href = videoSource.src;
      link.textContent = videoSource.src.split('/').pop(); // Use filename for text
      rightColumnContent = link;
    }
  } else {
    // Or fallback to image
    const img = rightItem.querySelector('img');
    if (img) {
      rightColumnContent = img;
    }
  }

  // Construct cells array, matching column count
  const cells = [
    headerRow,
    [leftColumnContent, rightColumnContent]
  ];

  // Create block table and replace
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
