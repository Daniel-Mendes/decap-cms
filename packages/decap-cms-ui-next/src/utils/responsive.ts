export const keys = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type BreakpointKey = (typeof keys)[number];

const values: Record<BreakpointKey, number> = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};
const unit = 'px';
const step = 5;

function up(key: BreakpointKey) {
  const value = typeof values[key] === 'number' ? values[key] : key;
  return `@media (min-width:${value}${unit})`;
}

function isUp(key: BreakpointKey) {
  return window.matchMedia(up(key).replace('@media ', '')).matches;
}

function down(key: BreakpointKey) {
  const endIndex = keys.indexOf(key) + 1;
  const upperbound = values[keys[endIndex]];

  if (endIndex === keys.length) {
    // xl down applies to all sizes
    return up('xs');
  }

  const value = typeof upperbound === 'number' && endIndex > 0 ? upperbound : key;
  return `@media (max-width:${value - step / 100}${unit})`;
}

function isDown(key: BreakpointKey) {
  return window.matchMedia(down(key).replace('@media ', '')).matches;
}

function between(start: BreakpointKey, end: BreakpointKey) {
  const endIndex = keys.indexOf(end);

  if (endIndex === keys.length - 1) {
    return up(start);
  }

  return (
    `@media (min-width:${typeof values[start] === 'number' ? values[start] : start}${unit}) and ` +
    `(max-width:${
      (endIndex !== -1 && typeof values[keys[endIndex + 1]] === 'number'
        ? values[keys[endIndex + 1]]
        : end) -
      step / 100
    }${unit})`
  );
}

function isBetween(start: BreakpointKey, end: BreakpointKey) {
  return window.matchMedia(between(start, end).replace('@media ', '')).matches;
}

function only(key: BreakpointKey) {
  return between(key, key);
}

function isOnly(key: BreakpointKey) {
  return window.matchMedia(only(key).replace('@media ', '')).matches;
}

export {
  values as breakpoints,
  keys as breakpointKeys,
  isUp as isWindowUp,
  isDown as isWindowDown,
  isBetween as isWindowBetween,
  isOnly as isWindowOnly,
  up as mediaQueryUp,
  down as mediaQueryDown,
  between as mediaQueryBetween,
  only as mediaQueryOnly,
};
