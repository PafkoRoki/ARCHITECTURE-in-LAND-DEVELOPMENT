export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export const ENHANCED_SCROLL_QUERY = [
  '(min-width: 992px)',
  '(min-height: 600px)',
  '(hover: hover)',
  '(pointer: fine)',
  '(prefers-reduced-motion: no-preference)',
].join(' and ')
