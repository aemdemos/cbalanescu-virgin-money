/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we have the correct accordion list
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;

  const rows = [
    ['Accordion (accordion4)'] // header row matches example EXACTLY
  ];

  // Each top-level <li> is an accordion item
  const accordionItems = accordionList.querySelectorAll(':scope > li');

  accordionItems.forEach(item => {
    // Title: find the direct <a> child (the clickable title)
    let titleEl = item.querySelector(':scope > a');
    let titleCell;
    if (titleEl) {
      // Only include the text and inline content before the expand arrow icon (the .ec div)
      // (If the .ec is present as a child, remove it for just the label)
      const ecDiv = titleEl.querySelector('.ec');
      let labelNode;
      if (ecDiv) {
        // Remove the .ec icon for title cell
        labelNode = titleEl.cloneNode(true);
        const ecRemove = labelNode.querySelector('.ec');
        if (ecRemove) ecRemove.remove();
        titleCell = labelNode.childNodes.length ? Array.from(labelNode.childNodes).filter(n => n.nodeType !== 8 && (n.nodeType !== 3 || n.textContent.trim())) : labelNode.textContent;
      } else {
        // No .ec, just use the <a> content
        titleCell = titleEl.childNodes.length ? Array.from(titleEl.childNodes).filter(n => n.nodeType !== 8 && (n.nodeType !== 3 || n.textContent.trim())) : titleEl.textContent;
      }
    } else {
      // Fallback: use text content
      titleCell = item.textContent.trim();
    }

    // Content: find the direct <div class="expandcollapse-content">
    let contentEl = item.querySelector(':scope > div.expandcollapse-content');
    let contentCell;
    if (contentEl) {
      // Find ol (list of content blocks)
      const ol = contentEl.querySelector('ol');
      if (ol) {
        // Each .tcs-wrapper contains a <li>
        const wrappers = ol.querySelectorAll(':scope > .tcs-wrapper');
        let blockContent = [];
        wrappers.forEach(wrapper => {
          // Each wrapper contains a <li>, whose children can be paragraphs, etc.
          const li = wrapper.querySelector(':scope > li');
          if (li) {
            // Use all direct children (to preserve <p>, <br>, etc)
            blockContent.push(...Array.from(li.childNodes).filter(n => {
              // Exclude empty text nodes and comments
              return n.nodeType !== 8 && (n.nodeType !== 3 || n.textContent.trim());
            }));
          }
        });
        // If nothing found, use the entire <ol>
        if (blockContent.length === 0) blockContent.push(ol);
        contentCell = blockContent;
      } else {
        // No <ol>, just use all children of the contentEl
        contentCell = Array.from(contentEl.childNodes).filter(n => n.nodeType !== 8 && (n.nodeType !== 3 || n.textContent.trim()));
      }
    } else {
      // If no content, leave cell empty
      contentCell = '';
    }

    rows.push([titleCell, contentCell]);
  });

  // Now create the block and replace the original element
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
