// @ts-check
import { defineConfig } from 'astro/config';
import { visit } from 'unist-util-visit';

import mdx from '@astrojs/mdx';

function rehypeLazyMedia() {
  /** @param {import('hast').Root} tree */
  return (tree) => {
    // Raw HTML nodes (inline HTML in markdown, before rehype-raw parses them)
    visit(tree, 'raw', (/** @type {any} */ node) => {
      node.value = node.value.replace(
        /(<iframe\b[^>]*?)\ssrc="([^"]+)"/gi,
        '$1 data-src="$2"'
      );
    });
    // Element nodes (in case any iframes come through as parsed elements)
    visit(tree, 'element', (/** @type {any} */ node) => {
      if (node.tagName === 'iframe' && node.properties?.src) {
        node.properties['data-src'] = node.properties.src;
        delete node.properties.src;
      }
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeLazyMedia],
  },

  integrations: [mdx()]
});