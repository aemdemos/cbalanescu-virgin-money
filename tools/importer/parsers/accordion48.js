/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Accordion (accordion48)'];
  const cells = [headerRow];

  // Find the main expandcollapse-content div containing the <ol> of accordion items
  const expandDiv = element.querySelector('div.expandcollapse-content');
  if (!expandDiv) return;
  const ol = expandDiv.querySelector('ol');
  if (!ol) return;

  // Each accordion item is a .tcs-wrapper > li
  ol.querySelectorAll(':scope > .tcs-wrapper').forEach(wrapper => {
    const li = wrapper.querySelector('li');
    if (!li) return;
    // Gather all child <p> elements
    const paragraphs = Array.from(li.querySelectorAll('p'));
    // Title: first <p>
    let titleCell = '';
    if (paragraphs.length > 0) {
      titleCell = paragraphs[0];
    } else {
      // fallback: the whole li text
      titleCell = document.createTextNode(li.textContent.trim());
    }
    // Content: All <p> elements after the first, and any other child nodes (not <p>)
    let contentCell = '';
    const contentPs = paragraphs.slice(1);
    // Also add any non-<p> element children (e.g., lists, etc.)
    const extraNodes = Array.from(li.childNodes).filter(n => {
      return n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() !== 'p';
    });
    const contentParts = [...contentPs, ...extraNodes];
    if (contentParts.length > 0) {
      contentCell = contentParts;
    }
    cells.push([titleCell, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
