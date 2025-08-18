/* global WebImporter */
export default function parse(element, { document }) {
  // TABLE HEADER
  const headerRow = ['Cards (cards5)'];

  // Find the card container
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Find all card sections, which are .cm-icon-title under sl-item (skipping any intro/heading)
  const slItems = Array.from(slList.children);
  let cardSections = [];
  // Skip the first sl-item if it's just a heading or intro (as in this HTML)
  for (let i = 1; i < slItems.length; i++) {
    const cardCandidates = slItems[i].querySelectorAll('.cm-icon-title');
    cardSections.push(...cardCandidates);
  }

  // Each card: first cell is image/icon, second cell is text block (heading + text)
  const rows = cardSections.map(section => {
    // Defensive: skip if section is null
    if (!section) return [null, null];
    // Get image
    let img = null;
    const headerDiv = section.querySelector('.header');
    if (headerDiv) {
      img = headerDiv.querySelector('img');
    }
    // Get heading and content
    let textBlock = document.createElement('div');
    let heading = headerDiv ? headerDiv.querySelector('h2') : null;
    if (heading) textBlock.appendChild(heading);
    const contentDiv = section.querySelector('.content');
    if (contentDiv) {
      Array.from(contentDiv.childNodes).forEach(n => textBlock.appendChild(n));
    }
    return [img, textBlock];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
