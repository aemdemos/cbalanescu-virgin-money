/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion list
  const accordionList = element.querySelector('.accordion-list');
  if (!accordionList) return;
  const accordionItems = accordionList.querySelectorAll(':scope > li');
  if (!accordionItems.length) return;

  // Header row
  const rows = [['Accordion (accordion27)']];

  // For each accordion item, extract title and content
  accordionItems.forEach(item => {
    // Title: <a> inside <li>, remove inner .ec div
    const titleLink = item.querySelector(':scope > a');
    if (!titleLink) return;
    const titleLinkClone = titleLink.cloneNode(true);
    const ecDiv = titleLinkClone.querySelector('.ec');
    if (ecDiv) ecDiv.remove();

    // Content: <div class="expandcollapse-content"> inside <li>
    const contentDiv = item.querySelector(':scope > .expandcollapse-content');
    let contentCell = '';
    if (contentDiv) {
      // Get all <li> elements inside .tcs-wrapper
      const ol = contentDiv.querySelector('ol');
      if (ol) {
        // If only one .tcs-wrapper, use its <li> as content
        const wrappers = ol.querySelectorAll(':scope > .tcs-wrapper');
        if (wrappers.length === 1) {
          const li = wrappers[0].querySelector('li');
          if (li) {
            // Wrap in a <div> to avoid raw <li> in <td>
            const div = document.createElement('div');
            Array.from(li.childNodes).forEach(node => div.appendChild(node.cloneNode(true)));
            contentCell = div;
          }
        } else if (wrappers.length > 1) {
          // If multiple, put all <li> in a <ol>
          const newOl = document.createElement('ol');
          wrappers.forEach(wrapper => {
            const li = wrapper.querySelector('li');
            if (li) newOl.appendChild(li.cloneNode(true));
          });
          contentCell = newOl;
        }
      }
    }
    rows.push([
      titleLinkClone,
      contentCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
