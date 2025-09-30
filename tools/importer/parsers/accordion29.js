/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: exactly one column
  const headerRow = ['Accordion (accordion29)'];
  const rows = [headerRow];

  // Find the <ul class="accordion-list">
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;

  // Each <li> is an accordion item
  ul.querySelectorAll(':scope > li').forEach(li => {
    // Title cell: <a class="accordion-item">
    const a = li.querySelector('a.accordion-item');
    let titleContent = '';
    if (a) {
      const aClone = a.cloneNode(true);
      const ecDiv = aClone.querySelector('div.ec');
      if (ecDiv) ecDiv.remove();
      // Use all child nodes except ecDiv
      // If only text, extract textContent, else use nodes
      const nodes = Array.from(aClone.childNodes).filter(n => {
        return !(n.nodeType === 1 && n.classList && n.classList.contains('ec'));
      });
      titleContent = nodes.length === 1 ? nodes[0] : nodes;
    }

    // Content cell: <div class="expandcollapse-content">
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentContent = '';
    if (contentDiv) {
      const richText = contentDiv.querySelector('.cm-rich-text');
      const nodes = richText
        ? Array.from(richText.childNodes)
        : Array.from(contentDiv.childNodes);
      // Filter out empty text nodes
      const filtered = nodes.filter(n => {
        if (n.nodeType === 3) return n.textContent.trim() !== '';
        return true;
      });
      contentContent = filtered.length === 1 ? filtered[0] : filtered;
    }
    rows.push([titleContent, contentContent]);
  });

  // Create the table block (header row: 1 column, data rows: 2 columns)
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
