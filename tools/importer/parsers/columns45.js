/* global WebImporter */
export default function parse(element, { document }) {
  // Get the .sl-list with .has-feature-left
  const slList = element.querySelector('.sl-list.has-feature-left');
  if (!slList) return;

  // Get both columns (.sl-item)
  const columns = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (columns.length !== 2) return;

  // LEFT COLUMN: All non-empty features and the button
  const leftColumn = columns[0];
  const leftBlocks = [];

  // Get all .cq-dd-paragraph elements
  const paragraphs = Array.from(leftColumn.querySelectorAll(':scope > .cq-dd-paragraph'));
  for (const par of paragraphs) {
    // Skip any .cm.cm-rich-text with just <br>
    const rich = par.querySelector('.cm.cm-rich-text');
    if (rich && rich.textContent.trim() === '') continue;
    leftBlocks.push(par);
  }

  // Button: direct .cm.cm-rich-text which isn't just <br>
  const directRichTexts = Array.from(leftColumn.querySelectorAll(':scope > .cm.cm-rich-text'));
  for (const rich of directRichTexts) {
    if (rich.textContent.trim() !== '') {
      leftBlocks.push(rich);
    }
  }

  // RIGHT COLUMN: If there's a video, convert to link (using src)
  const rightColumn = columns[1];
  let rightBlock = [];
  const video = rightColumn.querySelector('video');
  if (video) {
    const source = video.querySelector('source');
    if (source && source.src) {
      const a = document.createElement('a');
      a.href = source.src;
      a.textContent = source.src.split('/').pop();
      rightBlock.push(a);
    }
  }

  // Construct table: header row is a single cell; content row matches column count
  const headerRow = ['Columns (columns45)']; // One cell, exactly as in the example
  const contentRow = [leftBlocks, rightBlock]; // 2 columns, content as arrays of existing elements
  const tableArr = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(table);
}
