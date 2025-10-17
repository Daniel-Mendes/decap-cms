import React from 'react';

// Component principal SVG
const SvgMock = React.forwardRef((props, ref) => {
  const { title, ...otherProps } = props;

  return React.createElement(
    'svg',
    {
      ...otherProps,
      ref,
      'data-testid': 'svg-mock',
      role: 'img',
      'aria-label': title || 'Mocked SVG',
      width: props.width || 16,
      height: props.height || 16,
      viewBox: props.viewBox || '0 0 16 16',
      fill: props.fill || 'currentColor',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    // Contenu SVG simple pour le rendu
    React.createElement('rect', {
      x: '0',
      y: '0',
      width: '16',
      height: '16',
      fill: 'currentColor',
    }),
  );
});

SvgMock.displayName = 'SvgMock';

// Export par défaut
export default SvgMock;

// Export nommé pour les imports destructurés
export { SvgMock };

// Export du composant comme propriété nommée pour les imports dynamiques
export const ReactComponent = SvgMock;
