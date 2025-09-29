/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from the filtered-content blocks
  function getAccordionRows(filteredContentDiv) {
    const rows = [];
    // Find the .sl-list inside this filtered-content
    const slList = filteredContentDiv.querySelector('.sl-list');
    if (!slList) return rows;
    const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
    // Defensive: Only process if we have at least 2 items (title + content)
    if (slItems.length < 2) return rows;
    // The first item is always the title (h3)
    const titleItem = slItems[0];
    const titleEl = titleItem.querySelector('h3');
    let titleCell;
    if (titleEl) {
      titleCell = titleEl;
    } else {
      // fallback: use the first sl-item's text
      titleCell = document.createElement('div');
      titleCell.textContent = titleItem.textContent.trim();
    }
    // The rest of the items are the content sections
    // Each gets its own accordion row
    for (let i = 1; i < slItems.length; i++) {
      const section = slItems[i].querySelector('section');
      if (!section) continue;
      // Title for this accordion row
      // Use the h2 text from the section's header
      const header = section.querySelector('.header h2');
      let rowTitle;
      if (header) {
        // If header contains a link, use its text
        const headerLink = header.querySelector('a');
        if (headerLink) {
          rowTitle = headerLink.textContent.trim();
        } else {
          rowTitle = header.textContent.trim();
        }
      } else {
        // fallback: use the section's first child text
        rowTitle = section.textContent.trim().split('\n')[0];
      }
      // Content for this accordion row
      // Use the whole section as content
      rows.push([rowTitle, section]);
    }
    return rows;
  }

  // Find all .filtered-content blocks inside the element
  const filteredContentDivs = Array.from(element.querySelectorAll(':scope > .filtered-content'));
  const headerRow = ['Accordion (accordion30)'];
  const tableRows = [headerRow];

  filteredContentDivs.forEach(filteredContentDiv => {
    const accordionRows = getAccordionRows(filteredContentDiv);
    // Defensive: If no rows found, skip
    if (accordionRows.length === 0) return;
    // Optionally, add the main title as a first row for this filtered-content block
    // But per the screenshots, each section is a separate accordion row, not grouped
    accordionRows.forEach(row => {
      tableRows.push(row);
    });
  });

  // Replace the element with the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
