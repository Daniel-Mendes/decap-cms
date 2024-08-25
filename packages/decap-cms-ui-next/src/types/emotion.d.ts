import '@emotion/react';

import type { ShadowProps } from '../src/utils/shadow';

type ColorShade =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '1000'
  | '1100'
  | '1200'
  | '1300'
  | '1400'
  | '1500'
  | '1600';
type Color = {
  [key in ColorShade]: string;
};

declare module '@emotion/react' {
  export interface Theme {
    fontFamily: string;
    fonts: {
      sansSerif: string;
      serif: string;
      mono: string;
    };
    responsive: {
      isWindowUp: (key) => boolean;
      isWindowDown: (key) => boolean;
      isWindowBetween: (start, end) => boolean;
      isWindowOnly: (key) => boolean;
    };
    shadow: ({ size, direction, inset, theme }: ShadowProps) => string;
    color: {
      neutral: Color;
      green: Color;
      teal: Color;
      blue: Color;
      purple: Color;
      pink: Color;
      red: Color;
      orange: Color;
      yellow: Color;

      primary: Color;
      danger: Color;
      success: Color;

      text: string;
      label: string;

      alternateBackground: string;
      background: string;

      surface: string;
      surfaceHighlight: string;

      elevatedSurface: string;
      elevatedSurfaceHighlight: string;

      border: string;
      borderHover: string;

      button: string;
      buttonPressed: string;
      buttonHover: string;

      disabled: string;

      lowEmphasis: string;
      mediumEmphasis: string;
      highEmphasis: string;
    };
  }
}
