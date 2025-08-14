/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Cards (cards23)'];
  const cells = [headerRow];

  // Find all product cards in both tabs
  const sections = element.querySelectorAll('.cm-product-tile');
  sections.forEach(section => {
    // -------- Image cell --------
    const img = section.querySelector('.image img');

    // -------- Text cell --------
    const textContent = [];

    // Title
    const title = section.querySelector('.product-name');
    if (title) {
      const strong = document.createElement('strong');
      strong.innerHTML = title.innerHTML;
      textContent.push(strong);
      textContent.push(document.createElement('br'));
    }

    // Key Rate(s)
    const rateBox = section.querySelector('.product-key-rates');
    if (rateBox) {
      const keyRates = rateBox.querySelectorAll('.product-key-rate-item');
      keyRates.forEach(rate => {
        // Rate value
        const value = rate.querySelector('.key-value-text');
        if (value) {
          const span = document.createElement('span');
          span.innerHTML = value.innerHTML;
          textContent.push(span);
        }
        // Label (can be inside <p> or just text)
        const bottom = rate.querySelector('.key-bottom-text');
        if (bottom) {
          textContent.push(document.createTextNode(' '));
          // Use small to mimic example (less visual weight)
          const small = document.createElement('small');
          small.innerHTML = bottom.innerHTML;
          textContent.push(small);
        }
        textContent.push(document.createElement('br'));
      });
    }

    // Description paragraph
    const desc = section.querySelector('.product-description');
    if (desc && desc.textContent.trim()) {
      textContent.push(document.createElement('br'));
      textContent.push(desc);
    }

    // Feature list (the first UL, not product-features)
    const features = Array.from(section.querySelectorAll('ul')).find(ul => !ul.classList.contains('product-features') && ul.children.length);
    if (features) {
      textContent.push(document.createElement('br'));
      textContent.push(features);
    }

    // CTAs: Find <a> inside .content-secondary with .cta
    const ctaLinks = Array.from(section.querySelectorAll('.content-secondary a'));
    if (ctaLinks.length > 0) {
      textContent.push(document.createElement('br'));
      ctaLinks.forEach((a, i) => {
        textContent.push(a);
        // Add space between if more than one
        if (i < ctaLinks.length - 1) textContent.push(document.createTextNode(' '));
      });
    }

    // Clean trailing <br>
    while (textContent.length && textContent[textContent.length-1].tagName === 'BR') {
      textContent.pop();
    }

    cells.push([
      img,
      textContent
    ]);
  });

  // Replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
