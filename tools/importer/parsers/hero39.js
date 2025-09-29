/* global WebImporter */
export default function parse(element, { document }) {
  // Find image and content blocks
  const imageBlock = element.querySelector('.image');
  const contentBlock = element.querySelector('.content');

  // Extract image element (reference, not clone)
  let imageEl = '';
  if (imageBlock) {
    const img = imageBlock.querySelector('img');
    if (img) imageEl = img;
  }

  // Extract all text content from contentBlock
  let textContentEls = [];
  if (contentBlock) {
    // Collect all direct children except empty subtitle
    Array.from(contentBlock.children).forEach((el) => {
      if (el.classList.contains('subtitle') && !el.textContent.trim()) {
        return;
      }
      textContentEls.push(el);
    });
  }

  // Compose the table
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageEl];
  const contentRow = [textContentEls.length ? textContentEls : ''];
  const rows = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
