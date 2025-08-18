/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block, matches example
  const headerRow = ['Cards (cards38)'];
  const cells = [headerRow];

  // Card items: immediate sl-item > section nodes
  const cardSections = Array.from(element.querySelectorAll('.sl-list > .sl-item > section'));

  cardSections.forEach(cardSection => {
    // First cell: image (existing <img> element only)
    let imgCell = null;
    const img = cardSection.querySelector('.image img');
    if (img) imgCell = img;

    // Second cell: text content (array of elements)
    const content = cardSection.querySelector('.content');
    const textCell = [];

    // Heading (<h2.header>), keep semantic element
    const title = content.querySelector('.header');
    if (title) textCell.push(title);

    // Subtitle (<span.subtitle> inside <p.subheading>), optional, keep formatting
    const subtitle = content.querySelector('.subheading .subtitle');
    if (subtitle) textCell.push(subtitle);

    // Description: all <p> that are not subheading and not the CTA paragraph
    const paragraphs = Array.from(content.querySelectorAll('p'));
    // Remove subheading
    const descParas = paragraphs.filter(p => !p.classList.contains('subheading'));
    // Last <p> is CTA (contains .cta), rest are description
    let descOnly = [];
    if (descParas.length > 1) {
      descOnly = descParas.slice(0, descParas.length - 1);
    } else if (descParas.length === 1) {
      descOnly = [];
    }
    descOnly.forEach(p => {
      textCell.push(p);
    });

    // CTA (last <p> in descParas, contains <a.cta>)
    const ctaPara = descParas[descParas.length - 1];
    if (ctaPara) {
      textCell.push(ctaPara);
    }

    // Make row: image in first cell, text content array in second
    cells.push([imgCell, textCell]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
