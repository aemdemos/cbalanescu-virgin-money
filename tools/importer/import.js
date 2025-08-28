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
import cardsNoImages1Parser from './parsers/cardsNoImages1.js';
import hero3Parser from './parsers/hero3.js';
import accordion9Parser from './parsers/accordion9.js';
import columns7Parser from './parsers/columns7.js';
import columns5Parser from './parsers/columns5.js';
import cards2Parser from './parsers/cards2.js';
import columns11Parser from './parsers/columns11.js';
import columns6Parser from './parsers/columns6.js';
import cards13Parser from './parsers/cards13.js';
import accordion16Parser from './parsers/accordion16.js';
import hero19Parser from './parsers/hero19.js';
import cards20Parser from './parsers/cards20.js';
import hero23Parser from './parsers/hero23.js';
import columns14Parser from './parsers/columns14.js';
import accordion21Parser from './parsers/accordion21.js';
import hero25Parser from './parsers/hero25.js';
import columns24Parser from './parsers/columns24.js';
import hero22Parser from './parsers/hero22.js';
import cards26Parser from './parsers/cards26.js';
import accordion27Parser from './parsers/accordion27.js';
import tabs28Parser from './parsers/tabs28.js';
import accordion30Parser from './parsers/accordion30.js';
import columns29Parser from './parsers/columns29.js';
import columns31Parser from './parsers/columns31.js';
import hero8Parser from './parsers/hero8.js';
import columns33Parser from './parsers/columns33.js';
import columns32Parser from './parsers/columns32.js';
import columns36Parser from './parsers/columns36.js';
import columns37Parser from './parsers/columns37.js';
import columns38Parser from './parsers/columns38.js';
import hero34Parser from './parsers/hero34.js';
import columns15Parser from './parsers/columns15.js';
import columns18Parser from './parsers/columns18.js';
import cards41Parser from './parsers/cards41.js';
import cards40Parser from './parsers/cards40.js';
import hero39Parser from './parsers/hero39.js';
import columns42Parser from './parsers/columns42.js';
import columns44Parser from './parsers/columns44.js';
import cards46Parser from './parsers/cards46.js';
import accordion48Parser from './parsers/accordion48.js';
import cardsNoImages50Parser from './parsers/cardsNoImages50.js';
import columns45Parser from './parsers/columns45.js';
import columns35Parser from './parsers/columns35.js';
import hero54Parser from './parsers/hero54.js';
import columns53Parser from './parsers/columns53.js';
import cards12Parser from './parsers/cards12.js';
import tableStripedBordered10Parser from './parsers/tableStripedBordered10.js';
import columns51Parser from './parsers/columns51.js';
import accordion49Parser from './parsers/accordion49.js';
import columns52Parser from './parsers/columns52.js';
import columns47Parser from './parsers/columns47.js';
import columns55Parser from './parsers/columns55.js';
import columns4Parser from './parsers/columns4.js';
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
  cardsNoImages1: cardsNoImages1Parser,
  hero3: hero3Parser,
  accordion9: accordion9Parser,
  columns7: columns7Parser,
  columns5: columns5Parser,
  cards2: cards2Parser,
  columns11: columns11Parser,
  columns6: columns6Parser,
  cards13: cards13Parser,
  accordion16: accordion16Parser,
  hero19: hero19Parser,
  cards20: cards20Parser,
  hero23: hero23Parser,
  columns14: columns14Parser,
  accordion21: accordion21Parser,
  hero25: hero25Parser,
  columns24: columns24Parser,
  hero22: hero22Parser,
  cards26: cards26Parser,
  accordion27: accordion27Parser,
  tabs28: tabs28Parser,
  accordion30: accordion30Parser,
  columns29: columns29Parser,
  columns31: columns31Parser,
  hero8: hero8Parser,
  columns33: columns33Parser,
  columns32: columns32Parser,
  columns36: columns36Parser,
  columns37: columns37Parser,
  columns38: columns38Parser,
  hero34: hero34Parser,
  columns15: columns15Parser,
  columns18: columns18Parser,
  cards41: cards41Parser,
  cards40: cards40Parser,
  hero39: hero39Parser,
  columns42: columns42Parser,
  columns44: columns44Parser,
  cards46: cards46Parser,
  accordion48: accordion48Parser,
  cardsNoImages50: cardsNoImages50Parser,
  columns45: columns45Parser,
  columns35: columns35Parser,
  hero54: hero54Parser,
  columns53: columns53Parser,
  cards12: cards12Parser,
  tableStripedBordered10: tableStripedBordered10Parser,
  columns51: columns51Parser,
  accordion49: accordion49Parser,
  columns52: columns52Parser,
  columns47: columns47Parser,
  columns55: columns55Parser,
  columns4: columns4Parser,
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
