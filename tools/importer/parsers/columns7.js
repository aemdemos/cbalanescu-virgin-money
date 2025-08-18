/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header EXACTLY as specified
  const headerRow = ['Columns (columns7)'];

  // 2. Find the two main columns:
  // Left: large image (first .sl-item)
  // Right: column layout of icon/text pairs (second .sl-item)
  let slList = element.querySelector('.sl-list.has-2-items.has-feature-right');
  if (!slList) slList = element.querySelector('.sl-list.has-2-items') || element.querySelector('.sl-list');
  const slItems = slList ? Array.from(slList.children).filter(e => e.classList.contains('sl-item')) : [];

  // --- Left Column Content --- //
  let leftCellContent = null;
  if (slItems.length > 0) {
    // Look for a .cm-image section with an img
    const imgSection = slItems[0].querySelector('.cm-image img');
    if (imgSection) {
      leftCellContent = imgSection;
    } else {
      // Fallback: any img in first sl-item
      const fallbackImg = slItems[0].querySelector('img');
      if (fallbackImg) leftCellContent = fallbackImg;
      else leftCellContent = document.createTextNode('');
    }
  } else {
    leftCellContent = document.createTextNode('');
  }

  // --- Right Column Content --- //
  let rightCellContent = [];
  if (slItems.length > 1) {
    // The second .sl-item contains another .column-container, which has a nested .sl-list
    const nestedContainer = slItems[1].querySelector('.column-container');
    let iconTitleSections = [];
    if (nestedContainer) {
      iconTitleSections = Array.from(nestedContainer.querySelectorAll('.cm-icon-title'));
    } else {
      // Fallback: just all .cm-icon-title in second sl-item
      iconTitleSections = Array.from(slItems[1].querySelectorAll('.cm-icon-title'));
    }
    // For each section, add its content as a block
    iconTitleSections.forEach(section => {
      const sectionDiv = document.createElement('div');
      // HEADER: usually .header containing img and h3
      const header = section.querySelector('.header');
      if (header) sectionDiv.appendChild(header);
      // CONTENT: paragraph(s)
      const content = section.querySelector('.content');
      if (content) sectionDiv.appendChild(content);
      rightCellContent.push(sectionDiv);
    });
  } else {
    rightCellContent = [document.createTextNode('')];
  }

  // 3. Create the table array
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // 4. Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
