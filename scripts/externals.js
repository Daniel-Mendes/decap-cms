import * as fs from 'fs';
import path from 'path';

/**
 * Takes a dash [-] separated name and makes it camel-cased
 * decap-cms-something to DecapCmsSomething
 * @param {} string
 */
export function toGlobalName(name) {
  return `${name}`
    .replace(new RegExp(/[-_/]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w+)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`,
    )
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), s => s.toUpperCase());
}

const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));

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
  ...packages.reduce((acc, name) => {
    acc[name] = toGlobalName(name);
    return acc;
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
