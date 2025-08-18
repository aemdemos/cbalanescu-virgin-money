/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Build the header row exactly as required.
  const headerRow = ['Columns (columns8)'];

  // 2. Gather all the top-level <li> under nav > ul
  const topLevelLis = element.querySelectorAll(':scope > ul > li');
  const columns = [];

  topLevelLis.forEach((li) => {
    // Create an array to hold all direct children to preserve references
    const colContent = [];

    // Add the <span> as a <strong> (for heading), preserve reference to text
    const headerSpan = li.querySelector(':scope > span');
    if (headerSpan) {
      // Create <strong> referencing the span's text
      const strong = document.createElement('strong');
      strong.textContent = headerSpan.textContent;
      colContent.push(strong);
    }

    // Add all direct <ul> under this <li> (preserve structure and reference)
    li.querySelectorAll(':scope > ul').forEach((ul) => {
      colContent.push(ul);
    });

    // For social column: flatten so icons and links are visible, but do not clone
    if (li.classList.contains('nav-footer-social')) {
      const socialsUl = li.querySelector(':scope > ul');
      if (socialsUl) {
        Array.from(socialsUl.children).forEach((liItem) => {
          // Only add social <a> links (preserve references)
          const a = liItem.querySelector('a');
          if (a) {
            colContent.push(a);
          }
        });
      }
    }

    // If there is direct text node content (edge case), add it.
    Array.from(li.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        colContent.push(document.createTextNode(node.textContent.trim()));
      }
    });

    columns.push(colContent);
  });

  // 3. Build the block table with a single header row and a single content row
  const blockArr = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(blockArr, document);

  // 4. Replace the original element
  element.replaceWith(block);
}
