/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row, matches example exactly
  const headerRow = ['Columns (columns36)'];

  // 2. Get columns: .sl-list > .sl-item (two columns in this example)
  const slList = element.querySelector('.sl-list');
  let columns = [];
  if (slList) {
    columns = Array.from(slList.children).map((slItem) => {
      // Column 1: rich text
      const richText = slItem.querySelector('.cm-rich-text');
      if (richText) {
        // Reference the original element
        return richText;
      }
      // Column 2: image in figure
      const imgSection = slItem.querySelector('.cm-image');
      if (imgSection) {
        const figure = imgSection.querySelector('figure');
        if (figure) {
          return figure;
        }
        // If no figure, use the image section itself (rare, but fallback)
        return imgSection;
      }
      // Fallback: reference entire slItem if content type is unknown
      return slItem;
    });
  }

  // 3. Build table: header, then single row with each column's content
  const cells = [
    headerRow,
    columns
  ];

  // 4. Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
