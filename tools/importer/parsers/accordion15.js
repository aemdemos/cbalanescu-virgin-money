/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match the example block name exactly.
  const headerRow = ['Accordion (accordion15)'];
  const cells = [headerRow];

  // Find the accordion list
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;

  // Each li is one accordion item
  const lis = ul.querySelectorAll(':scope > li');
  lis.forEach((li) => {
    // Title: Get the clickable text only, not icons
    let titleCell = '';
    const a = li.querySelector('a');
    if (a) {
      // There may be extra elements inside the <a> (e.g. <div>), so get only the text nodes
      let titleText = '';
      a.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          titleText += node.textContent;
        }
      });
      titleText = titleText.trim();
      // If titleText is empty, fallback to a.textContent, but strip child elements
      if (!titleText) {
        titleText = a.textContent.trim();
      }
      // Preserve formatting
      const titleSpan = document.createElement('span');
      titleSpan.textContent = titleText;
      titleCell = titleSpan;
    }
    // Content: Get the expanded content div or fallback
    let contentCell = '';
    const contentDiv = li.querySelector('div.expandcollapse-content');
    if (contentDiv) {
      // contentDiv may contain an <ol> or other elements. We want all of its content.
      // Remove styles that hide the content
      contentDiv.removeAttribute('style');
      // If contentDiv has only an <ol> with wrapper divs, we want the visible content
      // Use the contentDiv directly for robustness, referencing existing elements
      contentCell = contentDiv;
    } else {
      // If no contentDiv, there might still be content in <li>
      // Check for a <p> inside <li>
      const pEls = li.querySelectorAll('p');
      if (pEls.length) {
        contentCell = Array.from(pEls);
      } else {
        // Possibly empty item, leave blank
        contentCell = '';
      }
    }
    cells.push([titleCell, contentCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
