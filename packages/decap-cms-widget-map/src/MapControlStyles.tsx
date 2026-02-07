import { Global, css, withTheme } from '@emotion/react';

import type { Theme } from '@emotion/react';

function getLeafletStyles(theme: Theme) {
  return css`
    .leaflet-container {
      background: transparent !important;
    }

    .leaflet-tooltip,
    .leaflet-draw-tooltip {
      background-color: ${theme.color.surface} !important;
      color: ${theme.color.mediumEmphasis} !important;
    }

    .leaflet-draw-tooltip::before {
      border-right-color: ${theme.color.surface} !important;
    }

    .leaflet-draw-tooltip-subtext {
      color: ${theme.color.lowEmphasis} !important;
    }

    .leaflet-draw-guide-dash {
      border-radius: calc(99999 * 1px);
    }

    .leaflet-edit-marker-selected {
      border-color: transparent;
      background-color: transparent;
    }

    .custom-draw-handle > svg {
      transition: transform 0.2s ease;
      transform-origin: center center;
    }

    .custom-draw-handle:hover > svg {
      transform: scale(1.1);
    }

    /* .location-marker {
      animation: pulse 2s infinite;
    } */
  `;
}

function MapControlStyles({ theme }: { theme: Theme }) {
  return <Global styles={getLeafletStyles(theme)} />;
}

export default withTheme(MapControlStyles);
