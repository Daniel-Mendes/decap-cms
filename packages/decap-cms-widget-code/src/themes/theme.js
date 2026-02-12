import { useTheme } from '@emotion/react';
import { tags as t } from '@lezer/highlight';
import Color from 'color';
import { lightTheme, darkTheme } from 'decap-cms-ui-next';

import createTheme from './create-theme';

export function useEditorTheme() {
  const theme = useTheme();

  const lightEditorTheme = createTheme({
    variant: 'light',
    settings: {
      fontFamily: theme.fonts.mono,
      background: 'transparent',
    },
    styles: [],
  });

  const darkEditorTheme = createTheme({
    variant: 'dark',
    settings: {
      fontFamily: darkTheme.fonts.mono,
      background: 'transparent',
      foreground: darkTheme.color.neutral[100],
      caret: darkTheme.color.neutral[200],
      selection: Color(darkTheme.color.pink[700]).alpha(0.1).string(),
      gutterBackground: 'transparent',
      gutterForeground: darkTheme.color.neutral[800],
      lineHighlight: Color(darkTheme.color.neutral[700]).alpha(0.1).string(),
    },
    styles: [
      {
        tag: [t.meta, t.comment],
        color: darkTheme.color.neutral[900],
      },
      {
        tag: [t.string, t.special(t.brace)],
        color: darkTheme.color.yellow[500],
      },
      {
        tag: [t.number, t.self, t.bool, t.null, t.definition(t.variableName)],
        color: darkTheme.color.purple[500],
      },
      {
        tag: [t.keyword, t.operator, t.definitionKeyword],
        color: darkTheme.color.pink[500],
      },
      {
        tag: [t.typeName],
        color: darkTheme.color.blue[500],
      },
      {
        tag: [t.propertyName],
        color: darkTheme.color.orange[500],
      },
      {
        tag: t.definition(t.typeName),
        color: '#f8f8f2',
      },
      {
        tag: [
          t.className,
          t.definition(t.propertyName),
          t.function(t.variableName),
          t.attributeName,
        ],
        color: darkTheme.color.green[500],
      },
    ],
  });

  return theme.darkMode ? darkEditorTheme : lightEditorTheme;
}
