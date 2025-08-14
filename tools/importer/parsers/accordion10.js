/* global WebImporter */
export default function parse(element, { document }) {
  // Header row from block name
  const rows = [['Accordion']];

  // Get the accordion items
  const accordionList = element.querySelector('.accordion-list');
  if (!accordionList) return;

  const liItems = accordionList.querySelectorAll(':scope > li');
  liItems.forEach((li) => {
    // Title: always first <a> inside this li
    const titleLink = li.querySelector(':scope > a');
    let titleCell;
    if (titleLink) {
      // Reference the whole <a> but remove the .ec div if present
      const ecDiv = titleLink.querySelector('.ec');
      if (ecDiv) ecDiv.remove();
      // Keep the reference to the same <a> (preserving links, html, etc.)
      titleCell = titleLink;
    } else {
      // fallback if no <a>: just use text content
      titleCell = document.createElement('span');
      titleCell.textContent = li.textContent.trim();
    }

    // Content: look for .expandcollapse-content
    let contentCell;
    const ecContent = li.querySelector('.expandcollapse-content');
    if (ecContent) {
      // Reference the whole content div, which contains the ol and all tcs-wrappers/li/p structures
      contentCell = ecContent;
    } else {
      // fallback: empty cell
      contentCell = document.createElement('span');
      contentCell.textContent = '';
    }

    rows.push([titleCell, contentCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
