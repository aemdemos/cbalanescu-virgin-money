/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const cells = [['Hero (hero9)']];

  // 2nd row: background image
  let bgImgCell = null;
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const m = bgDiv.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (m && m[1]) {
      const img = document.createElement('img');
      img.src = m[1];
      img.width = 750;
      img.height = 415;
      img.loading = 'lazy';
      bgImgCell = img;
    }
  }
  cells.push([bgImgCell]);

  // 3rd row: title, subtitle, paragraph, CTA
  const contentDiv = element.querySelector('.content');
  const contentArr = [];
  if (contentDiv) {
    // Heading (styled as heading)
    const header = contentDiv.querySelector('.header');
    if (header) {
      // header may contain <p><span>...</span></p>
      // Use innerHTML so styles/bold are preserved
      const h1 = document.createElement('h1');
      h1.innerHTML = header.innerHTML;
      contentArr.push(h1);
    }
    // Subtitle
    const subtitle = contentDiv.querySelector('.subtitle');
    if (subtitle && subtitle.textContent.trim()) {
      contentArr.push(subtitle);
    }
    // Paragraphs
    // The first <p> in header is part of heading, so skip it from further paragraphs
    const headerP = header && header.querySelector('p');
    const paragraphs = contentDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (!headerP || p !== headerP) {
        contentArr.push(p);
      }
    });
    // CTA links (if any)
    const links = contentDiv.querySelectorAll('a');
    links.forEach(a => {
      contentArr.push(a);
    });
  }
  cells.push([contentArr]);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
