/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion list
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;

  // Header row: must be exactly as specified
  const rows = [ ['Accordion (accordion9)'] ];

  // Each <li> is an accordion item
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Title cell: the clickable title (text only, not the arrow icon)
    const a = li.querySelector('a.accordion-item');
    let titleText = '';
    if (a) {
      // Remove any child .ec element
      const ec = a.querySelector('.ec');
      if (ec) ec.remove();
      titleText = a.textContent.trim();
    }
    // Content cell: the expanded content (the inner rich text)
    const contentDiv = li.querySelector('.expandcollapse-content');
    let content = '';
    if (contentDiv) {
      const rich = contentDiv.querySelector('.cm-rich-text, .cm-rich-text.module__content, .module__content');
      if (rich) {
        content = rich;
      } else {
        content = Array.from(contentDiv.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      }
    }
    rows.push([titleText, content]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
