/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card data from a .product-key-rate-item
  function extractCard(cardEl) {
    // Image/Icon (mandatory)
    const img = cardEl.querySelector('img');

    // Title (optional, from .key-value-text > span)
    const titleSpan = cardEl.querySelector('.key-value-text span');
    let titleEl = null;
    if (titleSpan && titleSpan.textContent.trim()) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent.trim();
    }

    // Description (optional, from .key-top-text)
    const descDiv = cardEl.querySelector('.key-top-text');
    let descNodes = [];
    let ctaNode = null;
    if (descDiv) {
      // Find CTA (if any)
      const cta = descDiv.querySelector('a');
      if (cta) {
        ctaNode = cta;
        cta.parentNode.removeChild(cta);
      }
      // Collect description nodes, filter out empty <p> and empty text nodes
      descNodes = Array.from(descDiv.childNodes).filter(n => {
        if (n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'P' && !n.textContent.trim()) {
          return false;
        }
        if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) {
          return false;
        }
        return true;
      });
    }

    // Compose text cell: title (if present), description, CTA (if present)
    const textCell = [];
    if (titleEl) textCell.push(titleEl, document.createElement('br'));
    if (descNodes.length) {
      descNodes.forEach((node, idx) => {
        textCell.push(node);
        // Add <br> between paragraphs if multiple <p>
        if (node.nodeName === 'P' && idx < descNodes.length - 1) {
          textCell.push(document.createElement('br'));
        }
      });
    }
    if (ctaNode) {
      // Add a <br> before CTA if there is description
      if (descNodes.length) textCell.push(document.createElement('br'));
      textCell.push(ctaNode);
    }

    return [img, textCell];
  }

  // Build table rows
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find all card items
  const cardItems = element.querySelectorAll('.product-key-rate-item');
  cardItems.forEach(cardEl => {
    rows.push(extractCard(cardEl));
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
