/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // 1. Table Header Row
  const headerRow = ['Hero (hero23)'];

  // 2. Background Image Row (always present, empty if no image)
  let imageCell = '';
  const img = element.querySelector('img');
  if (img) {
    imageCell = img;
  }
  const imageRow = [imageCell];

  // 3. Content Row
  // Compose content cell in correct order: headline, subheading, paragraph(s), CTA
  const contentCell = [];

  // Headline (find any h1, even if nested)
  let headlineText = '';
  const h1 = element.querySelector('h1');
  if (h1) {
    // If h1 contains a bold span, use its text
    const boldSpan = h1.querySelector('span b');
    headlineText = boldSpan ? boldSpan.textContent.trim() : h1.textContent.trim();
    const headline = document.createElement('h1');
    headline.textContent = headlineText;
    contentCell.push(headline);
  }

  // Subheading (find any .subtitle)
  const subtitle = element.querySelector('.subtitle');
  if (subtitle) {
    const subheading = document.createElement('h2');
    subheading.textContent = subtitle.textContent.trim();
    contentCell.push(subheading);
  }

  // Paragraphs (collect all non-empty <p> elements, including those with children)
  const paragraphs = Array.from(element.querySelectorAll('p')).filter(p => p.textContent.trim().length > 0);
  paragraphs.forEach(p => {
    contentCell.push(p.cloneNode(true));
  });

  // CTA (find any .cta)
  const ctaEl = element.querySelector('.cta');
  if (ctaEl) {
    // If there's a link inside, use it. Otherwise, just text.
    let ctaContent;
    const link = ctaEl.querySelector('a');
    if (link) {
      ctaContent = link.cloneNode(true);
    } else {
      ctaContent = document.createElement('span');
      ctaContent.textContent = ctaEl.textContent.trim();
      ctaContent.className = 'cta';
    }
    contentCell.push(ctaContent);
  }

  const contentRow = [contentCell];

  // Build table with 3 rows: header, image, content
  const cells = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
