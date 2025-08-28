/* global WebImporter */
export default function parse(element, { document }) {
  // The header must match exactly
  const headerRow = ['Cards (cards41)'];
  const rows = [];
  // Find the sl-list block; if not present, exit
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  // Gather each direct child card (sl-item)
  const items = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  items.forEach(item => {
    // Locate card content
    const contentPanel = item.querySelector('.cm-content-panel-container');
    if (!contentPanel) return;
    const richText = contentPanel.querySelector('.cm-rich-text') || contentPanel;
    // Find the first image in card
    const img = richText.querySelector('img');
    // Find the heading: h5 or h4, or bold/strong
    let heading = richText.querySelector('h5, h4');
    if (!heading) {
      const bold = richText.querySelector('p b, p strong');
      if (bold) heading = bold;
    }
    // Find all p tags except those with an img inside
    const allPs = Array.from(richText.querySelectorAll('p')).filter(p => !p.querySelector('img'));
    // Find the CTA (anchor inside a paragraph)
    let ctaP = allPs.find(p => p.querySelector('a'));
    let cta = ctaP ? ctaP.querySelector('a') : null;
    // Remove CTA paragraph from allPs
    let descriptionPs = allPs.filter(p => p !== ctaP);
    // If heading is inside a paragraph, don't duplicate that paragraph in description
    if (heading && heading.parentElement.tagName === 'P') {
      descriptionPs = descriptionPs.filter(p => p !== heading.parentElement);
    }
    // Build the text cell with references to original elements
    const cellContent = [];
    if (heading) cellContent.push(heading);
    descriptionPs.forEach(p => cellContent.push(p));
    if (cta) cellContent.push(cta);
    rows.push([
      img,
      cellContent.length === 1 ? cellContent[0] : cellContent
    ]);
  });
  // Compose full table and replace original element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
