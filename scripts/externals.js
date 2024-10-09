import fs from 'node:fs';
import path from 'node:path';

/**
 * Takes a dash [-] separated name and makes it camel-cased
 * decap-cms-something to DecapCmsSomething
 * @param {} string
 */
export function toGlobalName(name) {
  return `${name}`
    .replaceAll(new RegExp(/[-_/]+/, 'g'), ' ')
    .replaceAll(new RegExp(/[^\w\s]/, 'g'), '')
    .replaceAll(
      new RegExp(/\s+(.)(\w+)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`,
    )
    .replaceAll(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), s => s.toUpperCase());
}

const packages = fs.readdirSync(path.resolve(import.meta.dirname, '../packages'));

export const externals = [
  ...packages,
  'lodash',
  '@emotion/react',
  '@emotion/styled',
  'codemirror',
  'immutable',
  'prop-types',
  'react-immutable-proptypes',
  'react',
  'react-dom',
  'uuid',
];

export const globals = {
  ...packages.reduce((accumulator, name) => {
    accumulator[name] = toGlobalName(name);
    return accumulator;
  }, {}),
  lodash: 'Lodash',
  '@emotion/react': 'EmotionCore',
  '@emotion/styled': 'EmotionStyled',
  codemirror: 'CodeMirror',
  immutable: 'Immutable',
  'prop-types': 'PropTypes',
  'react-immutable-proptypes': 'ImmutablePropTypes',
  react: 'React',
  'react-dom': 'ReactDOM',
  uuid: 'UUId',
  buffer: 'Buffer',
};
