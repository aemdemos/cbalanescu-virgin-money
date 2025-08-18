/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for Accordion block EXACTLY as specified
  const headerRow = ['Accordion (accordion28)'];

  // 2. Find all .filtered-content blocks inside the element (each represents an accordion item)
  const filteredContents = Array.from(element.querySelectorAll('.filtered-content'));
  
  // 3. For each accordion item, create a row with:
  //    - Title cell: Use the 'data-title' attribute
  //    - Content cell: Reference the column-container, or the section itself if missing
  const rows = filteredContents.map((section) => {
    // Title extraction (dynamic, not hardcoded)
    let titleText = section.getAttribute('data-title') || '';
    // Always use a <p> for the title text for consistency and to match HTML semantics
    const titleElem = document.createElement('p');
    titleElem.textContent = titleText;
    
    // Content reference (full referenced element, not clone)
    let contentElem = section.querySelector('.column-container');
    if (!contentElem) contentElem = section; // fallback

    return [titleElem, contentElem];
  });

  // 4. Compose final table data for block (first row is header)
  const cells = [headerRow, ...rows];

  // 5. Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the new table block
  element.replaceWith(table);
}
