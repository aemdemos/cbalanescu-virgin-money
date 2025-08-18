/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import columns3Parser from './parsers/columns3.js';
import cards5Parser from './parsers/cards5.js';
import cards6Parser from './parsers/cards6.js';
import cards1Parser from './parsers/cards1.js';
import columns10Parser from './parsers/columns10.js';
import hero11Parser from './parsers/hero11.js';
import columns7Parser from './parsers/columns7.js';
import accordion13Parser from './parsers/accordion13.js';
import hero16Parser from './parsers/hero16.js';
import cards17Parser from './parsers/cards17.js';
import columns18Parser from './parsers/columns18.js';
import cards19Parser from './parsers/cards19.js';
import columns2Parser from './parsers/columns2.js';
import tableStripedBordered9Parser from './parsers/tableStripedBordered9.js';
import accordion20Parser from './parsers/accordion20.js';
import hero24Parser from './parsers/hero24.js';
import cards25Parser from './parsers/cards25.js';
import columns23Parser from './parsers/columns23.js';
import accordion28Parser from './parsers/accordion28.js';
import cards26Parser from './parsers/cards26.js';
import columns14Parser from './parsers/columns14.js';
import columns29Parser from './parsers/columns29.js';
import accordion30Parser from './parsers/accordion30.js';
import columns32Parser from './parsers/columns32.js';
import columns33Parser from './parsers/columns33.js';
import hero22Parser from './parsers/hero22.js';
import hero15Parser from './parsers/hero15.js';
import hero21Parser from './parsers/hero21.js';
import columns35Parser from './parsers/columns35.js';
import hero27Parser from './parsers/hero27.js';
import columns39Parser from './parsers/columns39.js';
import columns40Parser from './parsers/columns40.js';
import columns42Parser from './parsers/columns42.js';
import cards43Parser from './parsers/cards43.js';
import cards38Parser from './parsers/cards38.js';
import columns44Parser from './parsers/columns44.js';
import columns45Parser from './parsers/columns45.js';
import hero41Parser from './parsers/hero41.js';
import cards46Parser from './parsers/cards46.js';
import accordion47Parser from './parsers/accordion47.js';
import columns8Parser from './parsers/columns8.js';
import columns50Parser from './parsers/columns50.js';
import columns34Parser from './parsers/columns34.js';
import columns52Parser from './parsers/columns52.js';
import columns37Parser from './parsers/columns37.js';
import hero53Parser from './parsers/hero53.js';
import columns54Parser from './parsers/columns54.js';
import columns51Parser from './parsers/columns51.js';
import columns12Parser from './parsers/columns12.js';
import hero49Parser from './parsers/hero49.js';
import accordion48Parser from './parsers/accordion48.js';
import accordion4Parser from './parsers/accordion4.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  columns3: columns3Parser,
  cards5: cards5Parser,
  cards6: cards6Parser,
  cards1: cards1Parser,
  columns10: columns10Parser,
  hero11: hero11Parser,
  columns7: columns7Parser,
  accordion13: accordion13Parser,
  hero16: hero16Parser,
  cards17: cards17Parser,
  columns18: columns18Parser,
  cards19: cards19Parser,
  columns2: columns2Parser,
  tableStripedBordered9: tableStripedBordered9Parser,
  accordion20: accordion20Parser,
  hero24: hero24Parser,
  cards25: cards25Parser,
  columns23: columns23Parser,
  accordion28: accordion28Parser,
  cards26: cards26Parser,
  columns14: columns14Parser,
  columns29: columns29Parser,
  accordion30: accordion30Parser,
  columns32: columns32Parser,
  columns33: columns33Parser,
  hero22: hero22Parser,
  hero15: hero15Parser,
  hero21: hero21Parser,
  columns35: columns35Parser,
  hero27: hero27Parser,
  columns39: columns39Parser,
  columns40: columns40Parser,
  columns42: columns42Parser,
  cards43: cards43Parser,
  cards38: cards38Parser,
  columns44: columns44Parser,
  columns45: columns45Parser,
  hero41: hero41Parser,
  cards46: cards46Parser,
  accordion47: accordion47Parser,
  columns8: columns8Parser,
  columns50: columns50Parser,
  columns34: columns34Parser,
  columns52: columns52Parser,
  columns37: columns37Parser,
  hero53: hero53Parser,
  columns54: columns54Parser,
  columns51: columns51Parser,
  columns12: columns12Parser,
  hero49: hero49Parser,
  accordion48: accordion48Parser,
  accordion4: accordion4Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
