/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find the accordion-list > li
  const accordionList = element.querySelector('.accordion-list');
  if (!accordionList) return;

  // Only one accordion item in this HTML
  const accordionItems = accordionList.querySelectorAll(':scope > li');
  accordionItems.forEach((li) => {
    // Title cell: the <a> inside the <li>
    const titleLink = li.querySelector('a');
    let titleCell = '';
    if (titleLink) {
      // Remove icon divs
      const titleClone = titleLink.cloneNode(true);
      titleClone.querySelectorAll('.ec').forEach(ec => ec.remove());
      titleCell = document.createElement('span');
      titleCell.textContent = titleClone.textContent.trim();
    }

    // Content cell: Each .tcs-wrapper inside .expandcollapse-content > ol
    const contentDiv = li.querySelector('.expandcollapse-content');
    if (contentDiv) {
      const ol = contentDiv.querySelector('ol');
      if (ol) {
        // For each .tcs-wrapper with a <li> inside, create a row
        ol.querySelectorAll('.tcs-wrapper').forEach(wrapper => {
          const itemLi = wrapper.querySelector('li');
          if (itemLi && itemLi.textContent.trim()) {
            // Title: first sentence or bold text from <li>
            let itemTitle = '';
            // Try to get bold text if present
            const bold = itemLi.querySelector('b');
            if (bold && bold.textContent.trim()) {
              itemTitle = bold.textContent.trim();
            } else {
              // Otherwise, use first sentence before a period/question mark
              const text = itemLi.textContent.trim();
              const match = text.match(/^(.*?[\.?])/);
              itemTitle = match ? match[1].trim() : text;
            }
            // Content: all of <li>
            rows.push([
              itemTitle,
              itemLi.cloneNode(true)
            ]);
          }
        });
      }
    }
  });

  // Only replace if we have at least one accordion row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
