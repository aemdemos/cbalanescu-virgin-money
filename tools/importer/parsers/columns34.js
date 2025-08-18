/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find the immediate .sl-list > .sl-item children
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length < 2) return;

  // First column: image block (reference the actual image element if present)
  let leftColContent = null;
  const leftImageSection = slItems[0].querySelector('.cm-image');
  if (leftImageSection) {
    // Use the image itself if present
    const img = leftImageSection.querySelector('img');
    if (img) {
      leftColContent = img;
    } else {
      leftColContent = leftImageSection;
    }
  } else {
    leftColContent = slItems[0]; // fallback
  }

  // Second column: rich text, h2, paragraph, and app store table
  let rightColContent = document.createElement('div');
  const richText = slItems[1].querySelector('.cm-rich-text');
  if (richText) {
    // Include all meaningful children (h2, p, responsive-table)
    Array.from(richText.childNodes).forEach(child => {
      if (child.nodeType === 1) { // ELEMENT_NODE
        // Only include visible and relevant elements
        if (
          child.tagName === 'H2' ||
          child.tagName === 'P' ||
          child.classList.contains('responsive-table')
        ) {
          rightColContent.appendChild(child);
        }
      }
    });
  } else {
    rightColContent = slItems[1]; // fallback
  }

  // Compose table rows
  const headerRow = ['Columns (columns34)'];
  // The second row has two columns: leftColContent and rightColContent
  const tableRows = [headerRow, [leftColContent, rightColContent]];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
