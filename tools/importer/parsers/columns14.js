/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Convert a nav-footer <li> section to a column cell
  function parseFooterSection(li) {
    const cellContent = [];
    // Section title
    const titleSpan = li.querySelector('span');
    if (titleSpan) {
      cellContent.push(titleSpan);
    }
    // Section links (if any)
    const ul = li.querySelector('ul');
    if (ul) {
      // Social icons: special handling
      if (li.classList.contains('nav-footer-social')) {
        // Get all <a> links (each with icon)
        const links = ul.querySelectorAll('a');
        const iconsDiv = document.createElement('div');
        iconsDiv.style.display = 'flex';
        iconsDiv.style.gap = '8px';
        links.forEach(a => {
          // Use the <img> inside the <span> for the icon
          const iconImg = a.querySelector('img');
          if (iconImg) {
            iconsDiv.appendChild(iconImg);
          }
        });
        cellContent.push(iconsDiv);
        // Add the blog link (if present)
        links.forEach(a => {
          if (a.href && a.href.includes('blog')) {
            cellContent.push(a);
          }
        });
      } else {
        // Regular section: list of links
        const links = ul.querySelectorAll('a');
        const linksList = document.createElement('ul');
        links.forEach(a => {
          const li = document.createElement('li');
          li.appendChild(a);
          linksList.appendChild(li);
        });
        cellContent.push(linksList);
      }
    }
    return cellContent;
  }

  // Get the three main columns (footer sections)
  const footerSections = element.querySelectorAll(':scope > ul > li');
  const columns = [];
  footerSections.forEach(li => {
    columns.push(parseFooterSection(li));
  });

  // Table structure: header row must be exactly one column
  const headerRow = ['Columns (columns14)'];
  const tableRows = [headerRow, columns];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
