/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns25)'];

  // Identify the two columns in the source HTML
  // First column: icon panel
  // Second column: accordion list
  let iconContent = [];
  let accordionContent = [];

  // Get all .sl-item (should be two)
  const slItems = element.querySelectorAll(':scope > .sl > .sl-list > .sl-item');

  // --- First column (icon) ---
  if (slItems[0]) {
    // Find the .cm-content-panel-container inside
    const panel = slItems[0].querySelector('.cm-content-panel-container');
    if (panel) {
      // Use the rich text content inside the panel for the icon
      const rich = panel.querySelector('.cm-rich-text');
      if (rich) {
        // Reference the actual rich element, not clone
        iconContent.push(rich);
      }
    }
  }

  // --- Second column (accordion list) ---
  if (slItems[1]) {
    // Accordion section
    const accordionSection = slItems[1].querySelector('.cm-accordion');
    if (accordionSection) {
      // The ul.accordion-list contains all FAQ items
      const ul = accordionSection.querySelector('ul.accordion-list');
      if (ul) {
        // For each FAQ <li>
        const lis = ul.querySelectorAll(':scope > li');
        lis.forEach(li => {
          // The question link
          const questionLink = li.querySelector('a.accordion-item');
          if (questionLink) {
            // Reference the link element itself
            accordionContent.push(questionLink);
          }
          // The answer block
          const answerDiv = li.querySelector('.expandcollapse-content');
          if (answerDiv) {
            // Reference its rich text content if available, else entire div
            const richText = answerDiv.querySelector('.cm-rich-text');
            if (richText) {
              accordionContent.push(richText);
            } else {
              accordionContent.push(answerDiv);
            }
          }
        });
        // After all FAQ items, check for a 'See more' link (outside li, inside ul)
        // In this structure, it's a div.cm-rich-text after the <ul>
        let seeMoreDiv = null;
        let next = ul.nextElementSibling;
        while (next) {
          if (next.classList && next.classList.contains('cm-rich-text')) {
            seeMoreDiv = next;
            break;
          }
          next = next.nextElementSibling;
        }
        if (seeMoreDiv) {
          accordionContent.push(seeMoreDiv);
        }
      }
    }
  }

  // If icon panel or accordion are empty, leave cell blank
  const row = [iconContent.length > 0 ? iconContent : '', accordionContent.length > 0 ? accordionContent : ''];

  // Build the block table
  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
