import { lightTheme, darkTheme } from 'decap-cms-ui-next';
import Color from 'color';
import type { Theme } from '@emotion/react';

export const themes = {
  light: (theme: Theme) => ({
    editor: {
      background: '#FFFBEB',
      foreground: '#1F1F1F',
      selection: '#CFCFDE',
      lineHighlight: '#EFEAD5',
      cursor: '#1F1F1F',
      gutter: '#FFFBEB',
      lineNumber: '#6C664B',
    },

    syntax: {
      comment: '#6C664B',
      string: '#14710A',
      number: '#A34D14',
      function: '#846E15',
      keyword: '#A3144D',
      type: '#644AC9',
      variable: '#1F1F1F',
      support: '#036A96',
      error: '#CB3A2A',
    },
  }),
  dark: (theme: Theme) => ({
    editor: {
      background: 'transparent',
      foreground: darkTheme.color.neutral[100],
      selection: Color(darkTheme.color.neutral[700])
        .alpha(theme.darkMode ? 0.35 : 0.2)
        .string(),
      lineHighlight: Color(darkTheme.color.neutral[700])
        .alpha(theme.darkMode ? 0.35 : 0.2)
        .string(),
      cursor: darkTheme.color.neutral[200],
      gutters: darkTheme.color.neutral[900],
      lineNumber: darkTheme.color.neutral[800],
    },

    syntax: {
      atom: darkTheme.color.purple[500],
      attribute: darkTheme.color.green[800],
      bracket: darkTheme.color.neutral[100],
      builtin: darkTheme.color.green[900],
      comment: darkTheme.color.neutral[900],
      def: darkTheme.color.purple[500],
      error: darkTheme.color.red[800],
      hr: 'red',
      keyword: darkTheme.color.pink[500],
      link: 'red',
      meta: darkTheme.color.pink[500],
      number: darkTheme.color.purple[500],
      operator: darkTheme.color.pink[500],
      property: darkTheme.color.blue[400],
      punctuation: 'red',
      qualifier: darkTheme.color.green[900],
      string: darkTheme.color.yellow[500],
      string2: darkTheme.color.yellow[500],
      tag: darkTheme.color.pink[500],
      type: darkTheme.color.blue[400],
      variable: darkTheme.color.blue[400],
      variable2: darkTheme.color.orange[800],
      variable3: darkTheme.color.green[900],
    },
  }),
};

export function createCodeMirrorTheme(name: string, theme: ReturnType<typeof themes.dark>) {
  return `
.cm-s-${name}.CodeMirror,
.cm-s-${name} .CodeMirror-gutters {
  background: ${theme.editor.background};
  color: ${theme.editor.foreground};
  border: none;
}

.cm-s-${name} .CodeMirror-gutters {
  color: ${theme.editor.gutters};
}

.cm-s-${name} .CodeMirror-cursor {
  border-left: 2px solid ${theme.editor.cursor};
}

.cm-s-${name} .CodeMirror-linenumber {
  color: ${theme.editor.lineNumber};
}

.cm-s-${name} .CodeMirror-selected {
  background: ${theme.editor.selection};
}

.cm-s-${name} .CodeMirror-line::selection,
.cm-s-${name} .CodeMirror-line > span::selection,
.cm-s-${name} .CodeMirror-line > span > span::selection {
  background: ${theme.editor.selection};
}

.cm-s-${name} .CodeMirror-line::-moz-selection,
.cm-s-${name} .CodeMirror-line > span::-moz-selection,
.cm-s-${name} .CodeMirror-line > span > span::-moz-selection {
  background: ${theme.editor.selection};
}

.cm-s-${name} .CodeMirror-activeline-background {
  background: ${theme.editor.lineHighlight};
}

.cm-s-${name} .CodeMirror-matchingbracket {
  text-decoration: underline;
  color: ${theme.editor.foreground} !important;
}

/* Syntax */
.cm-s-${name} .cm-atom { color: ${theme.syntax.atom}; }
.cm-s-${name} .cm-attribute { color: ${theme.syntax.attribute}; }
.cm-s-${name} .cm-bracket { color: ${theme.syntax.bracket}; }
.cm-s-${name} .cm-builtin { color: ${theme.syntax.builtin}; }
.cm-s-${name} .cm-comment { color: ${theme.syntax.comment}; }
.cm-s-${name} .cm-def { color: ${theme.syntax.def}; }
.cm-s-${name} .cm-error { color: ${theme.syntax.error}; }
.cm-s-${name} .cm-hr { color: ${theme.syntax.hr}; }
.cm-s-${name} .cm-keyword { color: ${theme.syntax.keyword}; }
.cm-s-${name} .cm-link { color: ${theme.syntax.link}; }
.cm-s-${name} .cm-meta { color: ${theme.syntax.meta}; }
.cm-s-${name} .cm-number { color: ${theme.syntax.number}; }
.cm-s-${name} .cm-operator { color: ${theme.syntax.operator}; }
.cm-s-${name} .cm-property { color: ${theme.syntax.property}; }
.cm-s-${name} .cm-punctuation { color: ${theme.syntax.punctuation}; }
.cm-s-${name} .cm-qualifier { color: ${theme.syntax.qualifier}; }
.cm-s-${name} .cm-string { color: ${theme.syntax.string}; }
.cm-s-${name} .cm-string-2 { color: ${theme.syntax.string2}; }
.cm-s-${name} .cm-tag { color: ${theme.syntax.tag}; }
.cm-s-${name} .cm-type { color: ${theme.syntax.type}; }
.cm-s-${name} .cm-variable { color: ${theme.syntax.variable}; }
.cm-s-${name} .cm-variable-2 { color: ${theme.syntax.variable2}; }
.cm-s-${name} .cm-variable-3 { color: ${theme.syntax.variable3}; }
`;
}
