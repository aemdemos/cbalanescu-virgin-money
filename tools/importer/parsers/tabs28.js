/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child divs
  function getDirectChildDivs(parent) {
    return Array.from(parent.children).filter((el) => el.tagName === 'DIV');
  }

  // 1. Header row
  const headerRow = ['Tabs (tabs28)'];

  // 2. Get tab labels from the nav
  const tabsNav = element.querySelector('.tabs-nav ul');
  let tabLabels = [];
  if (tabsNav) {
    tabLabels = Array.from(tabsNav.querySelectorAll('li')).map((li) => {
      // Get the label text (may be inside <b> or <span>)
      const labelSpan = li.querySelector('.tab-label');
      return labelSpan ? labelSpan.textContent.trim() : li.textContent.trim();
    });
  }

  // 3. Get tab content panels
  const tabsContainer = element.querySelector('.tabs');
  let tabPanels = [];
  if (tabsContainer) {
    // Only immediate children with class 'tab'
    tabPanels = Array.from(tabsContainer.children).filter((div) => div.classList.contains('tab'));
  }

  // Defensive: Ensure labels and panels match
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // 4. Build rows: each row is [label, content]
  const rows = [];
  for (let i = 0; i < numTabs; i += 1) {
    // Tab label as plain text (not HTML)
    const label = tabLabels[i];
    // For content, use the content block inside the tab panel
    // We'll grab everything inside the tab panel except the tab label link (the <a> at the top)
    const panel = tabPanels[i];
    // Clone the panel to avoid modifying the source
    const panelClone = panel.cloneNode(true);
    // Remove the first <a> (tab label link) if present
    const firstA = panelClone.querySelector('a.tab-ec-title');
    if (firstA) firstA.remove();
    // Remove aria attributes and classes that are only for tab logic
    panelClone.removeAttribute('aria-hidden');
    panelClone.removeAttribute('tabindex');
    panelClone.classList.remove('tab', 'is-active', 'is-hidden');
    // Remove empty wrappers if present (e.g., empty divs)
    // But keep the main content structure
    rows.push([label, panelClone]);
  }

  // 5. Assemble table data
  const tableData = [headerRow, ...rows];

  // 6. Create and replace
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
