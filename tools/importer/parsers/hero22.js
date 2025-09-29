/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background image from .intrinsic-el style or data-hlx-background-image
  let bgImageUrl = '';
  const intrinsicEl = element.querySelector('.intrinsic-el');
  if (intrinsicEl) {
    const styleBg = intrinsicEl.style.backgroundImage;
    if (styleBg && styleBg !== 'url( )' && styleBg !== 'url("")') {
      const match = styleBg.match(/url\(("|')?(.*?)\1?\)/);
      if (match && match[2]) {
        bgImageUrl = match[2];
      }
    }
    if (!bgImageUrl && intrinsicEl.dataset.hlxBackgroundImage) {
      const dataBg = intrinsicEl.dataset.hlxBackgroundImage;
      const match = dataBg.match(/url\(("|')?(.*?)\1?\)/);
      if (match && match[2]) {
        bgImageUrl = match[2];
      }
    }
  }

  // Always create a table with 3 rows (header, image, content)
  const headerRow = ['Hero (hero22)'];
  let imageRow = [''];
  if (bgImageUrl) {
    const imageEl = document.createElement('img');
    imageEl.src = bgImageUrl;
    imageEl.alt = '';
    imageRow = [imageEl];
  }

  // For content row, extract any text content from the full block (not just intrinsic-el)
  let contentText = '';
  contentText = element.textContent.trim();
  const contentRow = [contentText ? contentText : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
