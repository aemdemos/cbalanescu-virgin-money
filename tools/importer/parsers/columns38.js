/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children
  const getDirectChildren = (el, selector) => Array.from(el.querySelectorAll(selector));

  // Find the two column items
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = getDirectChildren(slList, ':scope > .sl-item');
  if (slItems.length < 2) return;

  // --- COLUMN 1: IMAGE ---
  let col1Content = null;
  const imgSection = slItems[0].querySelector('.cm-image, .cm.cm-image');
  if (imgSection) {
    const figure = imgSection.querySelector('figure');
    if (figure) {
      col1Content = figure;
    }
  }
  if (!col1Content) col1Content = slItems[0];

  // --- COLUMN 2: TEXT + BUTTONS (NO TABLE) ---
  let col2Content = [];
  const richText = slItems[1].querySelector('.cm-rich-text, .cm.cm-rich-text');
  if (richText) {
    const heading = richText.querySelector('h2');
    if (heading) col2Content.push(heading);
    const para = richText.querySelector('p');
    if (para) col2Content.push(para);
    // Flatten app store buttons: extract links/images from table
    const appTable = richText.querySelector('.responsive-table table');
    if (appTable) {
      const appLinks = Array.from(appTable.querySelectorAll('a'));
      appLinks.forEach(a => {
        col2Content.push(a);
      });
    }
  }
  if (col2Content.length === 0) col2Content = [slItems[1]];

  // Table structure
  const headerRow = ['Columns (columns38)'];
  const contentRow = [col1Content, col2Content];

  // Create and replace
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
