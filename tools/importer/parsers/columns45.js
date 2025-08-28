/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns45)'];

  // 2. Find the two main columns - the .sl-item elements
  // There should be 2 .sl-item divs inside .sl-list
  const slList = element.querySelector('.sl-list');
  const slItems = slList ? Array.from(slList.querySelectorAll(':scope > .sl-item')) : [];

  // Defensive: ensure there are 2 columns
  if (slItems.length < 2) return;

  // 3. LEFT COLUMN: All content blocks (features + CTA)
  const leftColumnContainer = slItems[0];
  // We'll collect all feature sections and rich-text elements in order, as they appear
  const leftColumnElements = [];
  Array.from(leftColumnContainer.children).forEach(child => {
    // .cq-dd-paragraph may contain a section.cm.cm-icon-title or div.cm.cm-rich-text
    const iconTitleSection = child.querySelector('.cm.cm-icon-title');
    if (iconTitleSection) {
      leftColumnElements.push(iconTitleSection);
    }
    const richText = child.querySelector('.cm.cm-rich-text');
    if (richText && richText.textContent.trim() !== '') {
      leftColumnElements.push(richText);
    }
  });
  // Final CTA is outside the .cq-dd-paragraph's at the bottom
  const lastRichText = leftColumnContainer.querySelector(':scope > .cm.cm-rich-text');
  if (lastRichText && !leftColumnElements.includes(lastRichText)) {
    leftColumnElements.push(lastRichText);
  }

  // 4. RIGHT COLUMN: The video
  const rightColumnContainer = slItems[1];
  // Find the first <video> element
  let rightColumnContent = [];
  const video = rightColumnContainer.querySelector('video');
  if (video) {
    // Per requirements, include as a link to video src (not the <video> element)
    const source = video.querySelector('source');
    if (source && source.src) {
      const link = document.createElement('a');
      link.href = source.src;
      // Display file name as link text
      link.textContent = source.src.split('/').pop();
      rightColumnContent.push(link);
    }
  }
  // Defensive: if there is no video, leave cell empty

  // 5. Table: header row, then one row with two columns
  const cells = [
    headerRow,
    [leftColumnElements, rightColumnContent]
  ];

  // 6. Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
