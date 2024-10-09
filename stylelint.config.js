export default {
  extends: ['stylelint-config-standard'],
  customSyntax: 'postcss-styled-syntax',
  rules: {
    "selector-class-pattern": null // Disable because of external libraries styles
  }
};
