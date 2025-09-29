/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all immediate children of a parent
  function getDirectChildren(parent, selector = 'div') {
    return Array.from(parent.querySelectorAll(`:scope > ${selector}`));
  }

  // Find the main columns container
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get the two column items (left and right)
  const slItems = getDirectChildren(slList, '.sl-item');
  if (slItems.length < 2) return;

  // LEFT COLUMN: All feature sections and download link
  const leftItem = slItems[0];
  // Get all .cq-dd-paragraph children (each is a block of content)
  const leftParagraphs = getDirectChildren(leftItem, '.cq-dd-paragraph');

  // We'll collect all the feature sections
  const features = [];
  leftParagraphs.forEach((para) => {
    // Look for a section.cm.cm-icon-title inside
    const featureSection = para.querySelector('.cm.cm-icon-title');
    if (featureSection) {
      features.push(featureSection);
    }
  });

  // Find the final download link (outside the icon-title sections)
  let downloadLink = null;
  // Look for .cm.cm-rich-text.module__content.l-full-width with a link
  const richTextBlocks = leftItem.querySelectorAll('.cm.cm-rich-text.module__content.l-full-width');
  richTextBlocks.forEach((block) => {
    const link = block.querySelector('a');
    if (link) {
      downloadLink = block;
    }
  });

  // Compose left column: all features + download link (if present)
  const leftColumnContent = [];
  features.forEach((feature) => leftColumnContent.push(feature));
  if (downloadLink) leftColumnContent.push(downloadLink);

  // RIGHT COLUMN: The video preview
  const rightItem = slItems[1];
  // Find the video element
  let rightColumnContent = [];
  const videoWrapper = rightItem.querySelector('div');
  if (videoWrapper) {
    const video = videoWrapper.querySelector('video');
    if (video) {
      // Instead of embedding video, create a link to its source
      const source = video.querySelector('source');
      if (source && source.src) {
        const videoLink = document.createElement('a');
        videoLink.href = source.src;
        videoLink.textContent = 'View video';
        rightColumnContent = [videoLink];
      }
    }
  }

  // Table header row
  const headerRow = ['Columns (columns45)'];
  // Table content row: left and right columns
  const contentRow = [leftColumnContent, rightColumnContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
