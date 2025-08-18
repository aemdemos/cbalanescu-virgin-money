/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row matches example exactly
  const headerRow = ['Columns (columns8)'];

  // Locate the UL containing columns
  const navUl = element.querySelector('ul.nav-footer');
  if (!navUl) return;

  // Get direct LI children for columns
  const columnLis = Array.from(navUl.children).filter(child => child.tagName === 'LI');

  // Each column cell: Title (strong), UL of links or social list
  const columnCells = columnLis.map(li => {
    const cellContent = [];
    // Title
    const span = li.querySelector('span');
    if (span && span.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = span.textContent.trim();
      cellContent.push(strong);
    }
    // List of links or social icons
    const ul = li.querySelector('ul');
    if (ul) {
      if (li.classList.contains('nav-footer-social')) {
        // Social icons: transform each <li> to an <a> containing SVG
        Array.from(ul.querySelectorAll('li')).forEach(socialLi => {
          const a = socialLi.querySelector('a');
          if (a) {
            // Reference the <span class="icon"> directly as visual icon
            const iconSpan = a.querySelector('span.icon');
            if (iconSpan) {
              // Create a link, append iconSpan
              const socialLink = document.createElement('a');
              socialLink.href = a.href;
              socialLink.target = a.target;
              // Reference (not clone) the iconSpan
              socialLink.appendChild(iconSpan);
              cellContent.push(socialLink);
            } else {
              // fallback to text
              cellContent.push(a);
            }
          }
        });
      } else {
        // Regular UL: reference directly
        cellContent.push(ul);
      }
    }
    return cellContent;
  });

  // The table should include only the header row and one row with columns
  const cells = [
    headerRow,
    columnCells
  ];

  // Create block and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.parentNode.replaceChild(block, element);
}
