/* global WebImporter */
export default function parse(element, { document }) {
  // Block header is exactly: Accordion (accordion13)
  const headerRow = ['Accordion (accordion13)'];

  // The source HTML has one accordion block, not multiple tables, so only one block will be created

  // Find all accordion items (each <li>)
  const list = element.querySelector('ul.accordion-list');
  if (!list) {
    // If there's no list, nothing to parse: do not alter element
    return;
  }
  const items = Array.from(list.children).filter(li => li.tagName === 'LI');

  // For each item, create a row: title cell, content cell
  const rows = items.map(li => {
    // Find clickable title: the <a> with class accordion-item
    const titleLink = li.querySelector('a.accordion-item');
    if (titleLink) {
      // Remove any decorative <div class="ec"></div> from titleLink
      const ecDiv = titleLink.querySelector('div.ec');
      if (ecDiv) ecDiv.remove();
    }

    // Find the content div: .expandcollapse-content
    const contentDiv = li.querySelector('.expandcollapse-content');
    let contentCell;
    if (contentDiv) {
      // Prefer the .cm-rich-text inside .expandcollapse-content
      const richTextDiv = contentDiv.querySelector('.cm-rich-text');
      if (richTextDiv) {
        // Put all children from richTextDiv into the cell
        const children = Array.from(richTextDiv.children);
        contentCell = children.length === 1 ? children[0] : children;
      } else {
        // If no .cm-rich-text, use all contentDiv children
        const children = Array.from(contentDiv.children);
        contentCell = children.length === 1 ? children[0] : children;
      }
    } else {
      // If no contentDiv, cell is empty string
      contentCell = '';
    }

    // Return row: [titleLink, contentCell]
    return [titleLink, contentCell];
  });

  // Compose table cells for the block: header + rows
  const cells = [headerRow, ...rows];

  // Create the block table with the required structure
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
