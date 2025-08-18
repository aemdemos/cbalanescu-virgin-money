/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the instructions and example
  const headerRow = ['Accordion (accordion30)'];
  const cells = [headerRow];

  // Each <li> is an accordion item
  const items = element.querySelectorAll(':scope > li');
  items.forEach((item) => {
    // Title: use the <a> as is, but remove the dropdown icon div for clean text
    const a = item.querySelector('a');
    let titleElem = '';
    if (a) {
      // Remove dropdown icon within the <a>, if any
      const ecIcon = a.querySelector('.ec');
      if (ecIcon) ecIcon.remove();
      // Reference the existing element (not cloning)
      titleElem = a;
    }
    // Content: Use the expandcollapse-content > the main content container
    let contentElem = '';
    const contentDiv = item.querySelector('.expandcollapse-content');
    if (contentDiv) {
      // Use the first child with class cm-rich-text/module__content/l-full-width or fallback to all children
      const richContent = contentDiv.querySelector('.cm-rich-text, .module__content, .l-full-width');
      if (richContent) {
        contentElem = richContent;
      } else {
        // If for some reason the class isn't there, fallback to the contentDiv's children
        if (contentDiv.children.length > 0) {
          contentElem = Array.from(contentDiv.children);
        } else {
          contentElem = contentDiv;
        }
      }
    }
    cells.push([titleElem, contentElem]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
