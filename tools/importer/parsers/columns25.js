/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate children of a given element
  function getImmediateChildrenByTag(parent, tag) {
    return Array.from(parent.children).filter(child => child.tagName.toLowerCase() === tag);
  }

  // Find the two main column items
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length < 2) return;

  // --- LEFT COLUMN ---
  // The left column contains multiple sections (icon-title blocks) and a CTA at the end
  const leftItem = slItems[0];
  // Get all .cq-dd-paragraph children
  const paragraphs = Array.from(leftItem.querySelectorAll(':scope > .cq-dd-paragraph'));
  // Collect all .cm-icon-title sections
  const iconTitleSections = paragraphs
    .map(p => p.querySelector('.cm-icon-title'))
    .filter(Boolean);
  // Find the final CTA (Download the Virgin Money app)
  let cta = null;
  const lastRichText = leftItem.querySelector('.cm-rich-text p a');
  if (lastRichText) {
    cta = lastRichText.closest('p');
  }
  // Compose left column content
  const leftColumnContent = [...iconTitleSections];
  if (cta) leftColumnContent.push(cta);

  // --- RIGHT COLUMN ---
  // The right column contains a centered video (which visually is a phone screenshot)
  const rightItem = slItems[1];
  let rightColumnContent = [];
  // Find the video
  const videoWrap = rightItem.querySelector('div[style*="justify-content: center"]');
  if (videoWrap) {
    const video = videoWrap.querySelector('video');
    if (video) {
      // Instead of embedding the video, per requirements, add a link to the video src
      const source = video.querySelector('source');
      if (source && source.src) {
        const videoLink = document.createElement('a');
        videoLink.href = source.src;
        videoLink.textContent = 'View video';
        rightColumnContent = [videoLink];
      }
    }
  }

  // Table structure
  const headerRow = ['Columns (columns25)'];
  const contentRow = [leftColumnContent, rightColumnContent];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace element with block table
  element.replaceWith(table);
}
