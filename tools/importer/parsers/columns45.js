/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header – exact per instruction
  const headerRow = ['Columns (columns45)'];

  // 2. Find .sl-list
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // 3. Left column (first .sl-item)
  const leftItem = slItems[0];
  // All child cq-dd-paragraphs
  const paragraphs = Array.from(leftItem.querySelectorAll(':scope > .cq-dd-paragraph'));
  // Only sections with .cm-icon-title for actual content
  const iconTitleSections = paragraphs.map(p => p.querySelector('.cm.cm-icon-title')).filter(Boolean);

  // Also, find any rich-text download button at the end
  let downloadBlock = null;
  const allRichText = Array.from(leftItem.querySelectorAll('.cm-rich-text'));
  for (const rich of allRichText) {
    const a = rich.querySelector('a');
    if (a && a.href) {
      downloadBlock = rich;
      break;
    }
  }
  // Compose left cell: all sections plus download block, if present
  const leftCellContent = [...iconTitleSections];
  if (downloadBlock) leftCellContent.push(downloadBlock);

  // 4. Right column (second .sl-item)
  const rightItem = slItems[1];
  // Find video or iframe
  let videoLink = null;
  const video = rightItem.querySelector('video');
  if (video) {
    const source = video.querySelector('source');
    if (source && source.src) {
      // must convert to a link with href matching src
      const link = document.createElement('a');
      link.href = source.src;
      link.textContent = 'Video';
      videoLink = link;
    }
  } else {
    const iframe = rightItem.querySelector('iframe');
    if (iframe && iframe.src) {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = 'Video';
      videoLink = link;
    }
  }
  // Compose right cell
  const rightCellContent = videoLink ? [videoLink] : [];

  // 5. Table structure: header row, then row with two columns
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // 6. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
