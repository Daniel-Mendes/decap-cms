import path from 'path';

export default {
  process(src, filename) {
    const componentName =
      'Svg' + path.basename(filename, path.extname(filename)).replace(/[^a-zA-Z0-9]/g, '');

    // Extract only the inner markup of the original <svg> to avoid nested <svg><svg ...></svg></svg>
    const innerMatch = src.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
    const inner = innerMatch ? innerMatch[1] : src;
    const escapedInner = inner.replace(/`/g, '\\`').replace(/\$/g, '\\$');

    // Extract a few common attributes from the original <svg ...>
    const openTagMatch = src.match(/<svg([^>]*)>/i);
    const openTagAttrs = openTagMatch ? openTagMatch[1] : '';
    const attrRegex = /([a-zA-Z_:][a-zA-Z0-9:_.-]*)\s*=\s*"([^"]*)"/g;
    const picked = {};
    const allowed = new Set(['width', 'height', 'viewBox', 'fill', 'xmlns']);
    let m;
    while ((m = attrRegex.exec(openTagAttrs))) {
      const key = m[1];
      const val = m[2];
      if (allowed.has(key)) {
        picked[key] = val;
      }
    }
    const attrsJson = JSON.stringify(picked);

    const code = `
      const React = require('react');
      // Render a single <svg> and inline only the inner content of the source file to avoid nested <svg>
      const ${componentName} = React.forwardRef(function ${componentName}(props, ref) {
        return React.createElement('svg', {
          ref,
          ...${attrsJson},
          ...props,
          dangerouslySetInnerHTML: { __html: \`${escapedInner}\` }
        });
      });

      exports.ReactComponent = ${componentName};
      module.exports = ${componentName};
      module.exports.ReactComponent = ${componentName};
    `;

    return { code };
  },
};
