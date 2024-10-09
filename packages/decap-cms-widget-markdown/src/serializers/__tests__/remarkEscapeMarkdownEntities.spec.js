import unified from 'unified';
import u from 'unist-builder';

import remarkEscapeMarkdownEntities from '../remarkEscapeMarkdownEntities';

function process(text) {
  const tree = u('root', [u('text', text)]);
  const escapedMdast = unified().use(remarkEscapeMarkdownEntities).runSync(tree);

  return escapedMdast.children[0].value;
}

describe('remarkEscapeMarkdownEntities', () => {
  it('should escape common markdown entities', () => {
    expect(process('*a*')).toEqual(String.raw`\*a\*`);
    expect(process('**a**')).toEqual(String.raw`\*\*a\*\*`);
    expect(process('***a***')).toEqual(String.raw`\*\*\*a\*\*\*`);
    expect(process('_a_')).toEqual(String.raw`\_a\_`);
    expect(process('__a__')).toEqual(String.raw`\_\_a\_\_`);
    expect(process('~~a~~')).toEqual(String.raw`\~\~a\~\~`);
    expect(process('[]')).toEqual(String.raw`\[]`);
    expect(process('[]()')).toEqual(String.raw`\[]()`);
    expect(process('[a](b)')).toEqual(String.raw`\[a](b)`);
    expect(process('[Test sentence.](https://www.example.com)')).toEqual(
      String.raw`\[Test sentence.](https://www.example.com)`,
    );
    expect(process('![a](b)')).toEqual(String.raw`!\[a](b)`);
  });

  it('should not escape inactive, single markdown entities', () => {
    expect(process('a*b')).toEqual('a*b');
    expect(process('_')).toEqual('_');
    expect(process('~')).toEqual('~');
    expect(process('[')).toEqual('[');
  });

  it('should escape leading markdown entities', () => {
    expect(process('#')).toEqual(String.raw`\#`);
    expect(process('-')).toEqual(String.raw`\-`);
    expect(process('*')).toEqual(String.raw`\*`);
    expect(process('>')).toEqual(String.raw`\>`);
    expect(process('=')).toEqual(String.raw`\=`);
    expect(process('|')).toEqual(String.raw`\|`);
    expect(process('```')).toEqual('\\`\\``');
    expect(process('    ')).toEqual(String.raw`\    `);
  });

  it('should escape leading markdown entities preceded by whitespace', () => {
    expect(process('\n #')).toEqual(String.raw`\#`);
    expect(process(' \n-')).toEqual(String.raw`\-`);
  });

  it('should not escape leading markdown entities preceded by non-whitespace characters', () => {
    expect(process('a# # b #')).toEqual('a# # b #');
    expect(process('a- - b -')).toEqual('a- - b -');
  });

  it('should not escape html tags', () => {
    expect(process('<a attr="**a**">')).toEqual('<a attr="**a**">');
    expect(process('a b <c attr="**d**"> e')).toEqual('a b <c attr="**d**"> e');
  });

  it('should escape the contents of html blocks', () => {
    expect(process('<div>*a*</div>')).toEqual(String.raw`<div>\*a\*</div>`);
  });

  it('should not escape the contents of preformatted html blocks', () => {
    expect(process('<pre>*a*</pre>')).toEqual('<pre>*a*</pre>');
    expect(process('<script>*a*</script>')).toEqual('<script>*a*</script>');
    expect(process('<style>*a*</style>')).toEqual('<style>*a*</style>');
    expect(process('<pre>\n*a*\n</pre>')).toEqual('<pre>\n*a*\n</pre>');
    expect(process('a b <pre>*c*</pre> d e')).toEqual('a b <pre>*c*</pre> d e');
  });

  it('should not escape footnote references', () => {
    expect(process('[^a]')).toEqual('[^a]');
    expect(process('[^1]')).toEqual('[^1]');
  });

  it('should not escape footnotes', () => {
    expect(process('[^a]:')).toEqual('[^a]:');
    expect(process('[^1]:')).toEqual('[^1]:');
  });
});
