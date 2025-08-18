/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .sl-list (columns container)
  const slList = element.querySelector('.sl-list');
  let col1Content = document.createElement('div');
  let col2Content = document.createElement('div');

  if (slList) {
    // Get all immediate .sl-item children (the columns)
    const slItems = slList.querySelectorAll(':scope > .sl-item');
    // Column 1
    if (slItems[0]) {
      const content = slItems[0].querySelector('.cm-rich-text, .cm.cm-rich-text');
      if (content) {
        col1Content = content;
      } else {
        col1Content = slItems[0];
      }
    }
    // Column 2
    if (slItems[1]) {
      const paragraph = slItems[1].querySelector('.cq-dd-paragraph');
      if (paragraph) {
        const section = paragraph.querySelector('section.cm-links-related, section.cm.cm-links-related');
        if (section) {
          col2Content = section;
        } else {
          col2Content = paragraph;
        }
      } else {
        col2Content = slItems[1];
      }
    }
  }

  // Create the table manually to ensure the header row spans both columns
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.setAttribute('colspan', '2');
  headerTh.textContent = 'Columns (columns37)';
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  const bodyTr = document.createElement('tr');
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  td1.appendChild(col1Content);
  td2.appendChild(col2Content);
  bodyTr.appendChild(td1);
  bodyTr.appendChild(td2);
  table.appendChild(bodyTr);

  element.replaceWith(table);
}
