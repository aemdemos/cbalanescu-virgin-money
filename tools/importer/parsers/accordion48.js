/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion48)'];
  // Find the accordion list
  const accordionList = element.querySelector('.accordion-list');
  if (!accordionList) return;

  // The first <li> (the accordion item) contains the overall title and the content <div>
  const accordionItems = Array.from(accordionList.children);
  // Find the first <li> that contains both an <a> and a .expandcollapse-content
  let items = [];
  for (const item of accordionItems) {
    const a = item.querySelector('a');
    const contentDiv = item.querySelector('.expandcollapse-content');
    if (a && contentDiv) {
      // The summary/title for the accordion block comes from <a>
      // The actual accordion rows come from the <li>s inside <ol> in .expandcollapse-content
      // Each .tcs-wrapper contains a <li>
      const wrappers = Array.from(contentDiv.querySelectorAll('.tcs-wrapper'));
      for (const wrapper of wrappers) {
        // Each wrapper contains a <li>
        const li = wrapper.querySelector('li');
        if (!li) continue;
        // The content structure: typically one or more <p> elements per item
        // We want to preserve all formatting and reference elements directly
        // Title is always the first <p> or if only one <p>, that is the title
        const ps = li.querySelectorAll('p');
        let titleElem, contentElems = [];
        if (ps.length === 1) {
          // Only one <p> - treat it as both title and content if needed
          titleElem = ps[0];
          // If there are other nodes in li besides this p, include them in content
          const otherNodes = Array.from(li.childNodes).filter(node => node.nodeType === 1 && node.tagName !== 'P');
          if (otherNodes.length > 0) {
            contentElems = otherNodes;
          } else {
            contentElems = '';
          }
        } else if (ps.length > 1) {
          titleElem = ps[0];
          contentElems = Array.from(ps).slice(1);
        } else {
          // Fallback: treat whole li as title
          titleElem = li;
          contentElems = '';
        }
        items.push([titleElem, contentElems]);
      }
    }
  }
  // Assemble the table rows
  const rows = [headerRow, ...items];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
