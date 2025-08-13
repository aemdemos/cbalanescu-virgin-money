/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [['Accordion (accordion48)']];

  // Find the accordion-list (block container)
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;
  const li = ul.querySelector('li');
  if (!li) return;

  // Find summary row (clickable title for the accordion block)
  const titleAnchor = li.querySelector('a.js-ec-link');
  if (titleAnchor) {
    const ec = titleAnchor.querySelector('.ec');
    if (ec) ec.remove();
    cells.push([titleAnchor.textContent.trim(), '']);
  }

  // Accordion items: <div.expandcollapse-content> > <ol> > <div.tcs-wrapper><li>...</li></div>
  const accordionContentDiv = li.querySelector('div.expandcollapse-content');
  if (!accordionContentDiv) return;
  const ol = accordionContentDiv.querySelector('ol');
  if (!ol) return;

  Array.from(ol.querySelectorAll('.tcs-wrapper')).forEach(wrapper => {
    const liItem = wrapper.querySelector('li');
    if (!liItem) return;
    const ps = Array.from(liItem.querySelectorAll('p'));

    let questionCell, answerCell;
    if (ps.length > 0) {
      // Try to split first <p> into summary (first sentence/clause) and rest (answer)
      const firstP = ps[0];
      const firstText = firstP.textContent.trim();
      let splitIdx = firstText.indexOf('?');
      if (splitIdx === -1) splitIdx = firstText.indexOf('.');
      if (splitIdx === -1) splitIdx = firstText.length - 1;
      let summaryText = firstText.substring(0, splitIdx + 1).trim();
      let detailText = firstText.substring(splitIdx + 1).trim();

      // Build question cell: If the summaryText includes a link, keep it
      const questionFrag = document.createDocumentFragment();
      let foundSummary = false;
      let builtQuestion = false;
      for (const node of firstP.childNodes) {
        if (node.nodeType === 3) {
          // Text node
          let txt = node.textContent;
          if (!foundSummary && txt.includes(summaryText)) {
            questionFrag.appendChild(document.createTextNode(summaryText));
            foundSummary = true;
            builtQuestion = true;
          }
        } else if (node.nodeType === 1 && node.tagName === 'A') {
          // If link is in summary portion, add it
          if (!builtQuestion) {
            questionFrag.appendChild(node.cloneNode(true));
            builtQuestion = true;
          }
        }
      }
      if (!builtQuestion) questionFrag.appendChild(document.createTextNode(summaryText));
      questionCell = questionFrag;

      // Build answer cell: remainder of first <p>, plus subsequent <p>, plus other non-p children
      const answerNodes = [];
      if (detailText) {
        const detailP = document.createElement('p');
        detailP.textContent = detailText;
        answerNodes.push(detailP);
      }
      // Add any other <p> after the first
      for (let i = 1; i < ps.length; i++) {
        answerNodes.push(ps[i]);
      }
      // Add any other non-<p> children
      Array.from(liItem.childNodes).forEach(child => {
        if (child.nodeType === 1 && child.tagName !== 'P') {
          answerNodes.push(child);
        }
      });
      answerCell = answerNodes.length ? answerNodes : '';
    } else {
      // Fallback: no <p> elements
      questionCell = liItem.textContent.trim();
      answerCell = '';
    }
    cells.push([questionCell, answerCell]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
