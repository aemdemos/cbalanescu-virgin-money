/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by tag name
  function getDirectChildrenByTag(parent, tag) {
    return Array.from(parent.children).filter(el => el.tagName.toLowerCase() === tag);
  }

  // Find the main content container (sl-list)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get all immediate .sl-item children (should be 3)
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));

  // Defensive: If not enough items, fallback to replacing with block name only
  if (slItems.length < 3) {
    const fallback = WebImporter.DOMUtils.createTable([
      ['Columns (columns14)'],
      [element.innerHTML],
    ], document);
    element.replaceWith(fallback);
    return;
  }

  // First column: the heading (first sl-item)
  let firstColContent = slItems[0];

  // Second and third columns: each has two icon-title sections
  // We'll group the two sections in each column into a div for each cell
  function groupSections(slItem) {
    // Find all .cm-icon-title sections inside this sl-item
    const sections = Array.from(slItem.querySelectorAll(':scope > section.cm-icon-title'));
    if (sections.length === 1) return sections[0];
    if (sections.length > 1) {
      const wrapper = document.createElement('div');
      sections.forEach(sec => wrapper.appendChild(sec));
      return wrapper;
    }
    // Defensive: if no section, return the slItem itself
    return slItem;
  }

  const secondColContent = groupSections(slItems[1]);
  const thirdColContent = groupSections(slItems[2]);

  // Build the table rows
  const headerRow = ['Columns (columns14)'];
  const contentRow = [firstColContent, secondColContent, thirdColContent];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
