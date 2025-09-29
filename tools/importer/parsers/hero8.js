/* global WebImporter */
export default function parse(element, { document }) {
  // Find image and content containers
  const imageDiv = element.querySelector('.image');
  let imageEl = null;
  if (imageDiv) {
    // Find the actual <img> tag
    imageEl = imageDiv.querySelector('img');
  }

  const contentDiv = element.querySelector('.content');
  const contentParts = [];
  if (contentDiv) {
    // Title (optional)
    const h1 = contentDiv.querySelector('h1');
    if (h1) {
      // Preserve heading level and formatting
      contentParts.push(h1);
    }
    // Subtitle (optional)
    const subtitle = contentDiv.querySelector('.subtitle');
    if (subtitle && subtitle.textContent.trim()) {
      contentParts.push(subtitle);
    }
    // Paragraph (optional)
    // Only add paragraphs that are not inside h1
    Array.from(contentDiv.children).forEach((child) => {
      if (child.tagName === 'P' && child !== h1) {
        contentParts.push(child);
      }
    });
  }

  // Compose table rows
  const headerRow = ['Hero (hero8)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentParts.length ? contentParts : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
