/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, per spec
  const headerRow = ['Tabs (tabs28)'];

  // Get tab labels from the tab nav
  const nav = element.querySelector('.tabs-nav ul');
  const tabLabels = nav ? Array.from(nav.querySelectorAll('li button .tab-label')).map(label => label.textContent.trim()) : [];

  // Get .tab panels (in .tabs)
  const tabsContainer = element.querySelector('.tabs');
  let tabPanels = [];
  if (tabsContainer) {
    tabPanels = Array.from(tabsContainer.children).map(panel => {
      // Only include the expandcollapse-content, which is where the visible tab content lives
      const ecContent = panel.querySelector('.tab-ec-content');
      if (ecContent) {
        // Directly include the ecContent element (reference it, do not clone)
        return ecContent;
      } else {
        // fallback: include the whole panel if no .tab-ec-content
        return panel;
      }
    });
  }

  // Compose rows for the table: [label, content]
  const rows = tabLabels.map((label, idx) => [label, tabPanels[idx]]);

  // Compose the final structure
  const cells = [headerRow, ...rows];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
