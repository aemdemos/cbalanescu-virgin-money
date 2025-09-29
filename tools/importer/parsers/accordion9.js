/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by tag name
  function getDirectChildrenByTag(parent, tag) {
    return Array.from(parent.children).filter(child => child.tagName.toLowerCase() === tag);
  }

  const headerRow = ['Accordion (accordion9)'];
  const rows = [headerRow];

  // Find the main accordion list
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;

  // Only one <li> in this structure (the accordion block)
  const li = ul.querySelector('li');
  if (!li) return;

  // The clickable accordion title
  const titleLink = li.querySelector('a.accordion-item');
  let titleCell = '';
  if (titleLink) {
    // Remove any child divs (like the .ec color div)
    const titleClone = titleLink.cloneNode(true);
    Array.from(titleClone.querySelectorAll('div')).forEach(div => div.remove());
    titleCell = titleClone.textContent.trim();
  }

  // The content div (expanded content)
  const contentDiv = li.querySelector('div.expandcollapse-content');
  if (contentDiv) {
    const ol = contentDiv.querySelector('ol');
    if (ol) {
      // Each accordion item is a <li> (sometimes wrapped in .tcs-wrapper)
      // We'll collect all <li> items, whether direct or wrapped
      const items = [];
      // Wrapped <li> items
      getDirectChildrenByTag(ol, 'div').forEach(wrapper => {
        const realLi = wrapper.querySelector('li');
        if (realLi && realLi.textContent.trim()) {
          realLi.removeAttribute('value');
          items.push(realLi);
        }
      });
      // Direct <li> children
      getDirectChildrenByTag(ol, 'li').forEach(liItem => {
        if (liItem.textContent.trim()) {
          liItem.removeAttribute('value');
          items.push(liItem);
        }
      });
      // For each <li>, create a row: [title, content]
      items.forEach(liItem => {
        // Title: first sentence or bolded text, fallback to first text node
        let itemTitle = '';
        // Try to get bold or link text as title, else first sentence
        const bold = liItem.querySelector('b, strong');
        const link = liItem.querySelector('a');
        if (bold && bold.textContent.trim()) {
          itemTitle = bold.textContent.trim();
        } else if (link && link.textContent.trim()) {
          itemTitle = link.textContent.trim();
        } else {
          // Try to get first sentence
          const text = liItem.textContent.trim();
          const match = text.match(/^(.+?[\.\?\!])\s/);
          itemTitle = match ? match[1] : text;
        }
        // Content: clone the li and remove the title part
        const contentClone = liItem.cloneNode(true);
        // Remove the bold/link from content if used as title
        if (bold) bold.remove();
        if (link) link.remove();
        // Remove the first sentence if used as title
        if (itemTitle && contentClone.childNodes.length > 0) {
          const firstNode = contentClone.childNodes[0];
          if (firstNode.nodeType === Node.TEXT_NODE && firstNode.textContent.trim().startsWith(itemTitle)) {
            firstNode.textContent = firstNode.textContent.replace(itemTitle, '').trim();
          }
        }
        rows.push([itemTitle, contentClone]);
      });
    }
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
