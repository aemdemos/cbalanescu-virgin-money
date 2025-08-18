/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Accordion (accordion48)'];
  const rows = [headerRow];

  // Get all accordion items (tcs-wrapper)
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;
  const topLi = accordionList.querySelector('li');
  if (!topLi) return;
  const expandCollapse = topLi.querySelector('.expandcollapse-content');
  if (!expandCollapse) return;
  const ol = expandCollapse.querySelector('ol');
  if (!ol) return;
  const wrappers = Array.from(ol.querySelectorAll(':scope > .tcs-wrapper'));

  wrappers.forEach(wrapper => {
    const itemLi = wrapper.querySelector('li');
    if (!itemLi) return;
    // Find all direct <p> elements
    const ps = Array.from(itemLi.querySelectorAll(':scope > p'));
    let titleCell, contentCell;
    if (ps.length > 0) {
      // Title: Only text and inline elements from the first <p>
      const titleP = ps[0];
      // We want the title to be just the text content of the first <p>, but retaining any inline HTML (e.g., <b>, <a>, <i>)
      // But sometimes the first <p> is very long. To match the intent, we use the whole first <p> (with inline markup) as the title cell.
      titleCell = titleP;

      // Content: everything except the first <p>
      const contentNodes = [];
      // Add the rest of the <p>s
      for (let i = 1; i < ps.length; i++) {
        contentNodes.push(ps[i]);
      }
      // Add any other direct child elements (such as <ul>, <ol>, <a>, etc.) and text, except the first <p>
      Array.from(itemLi.childNodes).forEach(node => {
        if (
          node.nodeType === 1 && // Element
          node.tagName !== 'P'
        ) {
          contentNodes.push(node);
        } else if (
          node.nodeType === 3 && // Text
          node.textContent.trim() !== '' // skip whitespace-only
        ) {
          // Text directly in li (not in a <p>)
          contentNodes.push(document.createTextNode(node.textContent));
        }
      });
      contentCell = contentNodes.length > 0 ? contentNodes : '';
    } else {
      // If no <p>, treat all text in <li> as title
      titleCell = document.createElement('span');
      titleCell.textContent = itemLi.textContent.trim();
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
