// Custom SWC transformer for Jest with per-file React runtime overrides
// - Default: React runtime automatic for JSX
// - Override for Slate hyperscript tests: classic runtime with pragma 'h'

const swc = require('@swc/core');
const path = require('path');

function isTS(filename) {
  return filename.endsWith('.ts') || filename.endsWith('.tsx');
}

function isTSX(filename) {
  return filename.endsWith('.tsx');
}

function isJS(filename) {
  return filename.endsWith('.js') || filename.endsWith('.jsx');
}

function isSlateHyperscriptSpec(filename) {
  // Targets packages/decap-cms-widget-markdown/src/serializers/__tests__/slate.spec.js
  const base = path.basename(filename);
  return base === 'slate.spec.js';
}

function shouldUseEmotion(filename) {
  // Enable Emotion transform for source/tests under packages/* where styled components are used
  return filename.includes(`${path.sep}packages${path.sep}`);
}

module.exports = {
  process(src, filename) {
    const ts = isTS(filename);
    const tsx = isTSX(filename);
    const js = isJS(filename);

    const reactTransform = isSlateHyperscriptSpec(filename)
      ? {
          // Slate hyperscript uses /** @jsx h */ and requires classic runtime
          runtime: 'classic',
          pragma: 'h',
          // Ensure SWC doesn't complain about the pragma comment
          throwIfNamespace: false,
          development: true,
        }
      : {
          runtime: 'automatic',
          // Use Emotion's jsx runtime to support the css prop in tests/components
          importSource: '@emotion/react',
          development: true,
        };

    const parser = ts
      ? { syntax: 'typescript', tsx, decorators: true, dynamicImport: true }
      : { syntax: 'ecmascript', jsx: js || true, dynamicImport: true }; // enable JSX for JS specs

    const baseOptions = {
      filename,
      sourceMaps: 'inline',
      jsc: {
        parser,
        transform: {
          react: reactTransform,
        },
        target: 'es2019',
      },
      module: {
        type: 'commonjs',
        strict: true,
        strictMode: true,
      },
    };

    const withEmotion = shouldUseEmotion(filename)
      ? {
          ...baseOptions,
          jsc: {
            ...baseOptions.jsc,
            experimental: {
              plugins: [
                [
                  '@swc/plugin-emotion',
                  {
                    sourceMap: true,
                    autoLabel: true,
                    labelFormat: '[filename]--[local]',
                  },
                ],
              ],
            },
          },
        }
      : baseOptions;

    let result;
    try {
      result = swc.transformSync(src, withEmotion);
    } catch (e) {
      // Fallback without Emotion plugin if plugin invocation fails for non-JSX files
      result = swc.transformSync(src, baseOptions);
    }

    return { code: result.code };
  },
};
