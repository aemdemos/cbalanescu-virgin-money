/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Accordion (accordion16)'];
  const rows = [headerRow];

  // Get each accordion item (li)
  const items = Array.from(element.querySelectorAll(':scope > li'));

  items.forEach((item) => {
    // The clickable title is the <a> tag inside <li>
    const a = item.querySelector('a');
    let titleCell = '';
    if (a) {
      // Remove any child <div class="ec"> (these are just icons, not content)
      const aText = document.createElement('span');
      // Only include the text content of the <a>, not its children
      aText.textContent = a.childNodes[0]?.textContent?.trim() || a.textContent.trim();
      titleCell = aText;
    }
    // The content is in the sibling <div.expandcollapse-content>
    const contentDiv = item.querySelector('div.expandcollapse-content');
    let contentCell = '';
    if (contentDiv) {
      // Reference the actual content block inside, not clone
      // Often within a .cm-rich-text or similar div, but if absent, just take all children
      const richContent = contentDiv.querySelector('.cm-rich-text, .module__content, .l-full-width');
      if (richContent) {
        contentCell = richContent;
      } else {
        // If no wrapper, just put all direct children in an array
        contentCell = Array.from(contentDiv.children);
      }
    }
    rows.push([titleCell, contentCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
