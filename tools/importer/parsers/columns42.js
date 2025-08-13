/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns container
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  // Get all columns (sl-item)
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  // For each column, gather all its section contents
  const columns = Array.from(slItems).map((item) => {
    // Each section is a content block in the column
    const sections = item.querySelectorAll(':scope > section.cm-icon-title');
    // For each section, move header and content into a wrapper div
    const sectionWrappers = Array.from(sections).map((section) => {
      const wrapper = document.createElement('div');
      const header = section.querySelector('.header');
      const content = section.querySelector('.content');
      // If header exists, append it
      if (header) wrapper.appendChild(header);
      // If content exists, append it
      if (content) wrapper.appendChild(content);
      return wrapper;
    });
    // Put all section wrappers in one column cell
    // If only one section, use direct element
    return sectionWrappers.length === 1 ? sectionWrappers[0] : sectionWrappers;
  });
  // Table header as per instructions
  const headerRow = ['Columns (columns42)'];
  // Table content row: each column in one cell
  const tableRows = [headerRow, columns];
  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
