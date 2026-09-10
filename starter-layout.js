// Portrait coordinates refer to the transparent 2:3 artwork, not its CSS box.
// All fingertips sit below y=.39; the bot's entire bob stays above that line.
export function starterLayout(rect, viewport, alignTop = true) {
  const h = Math.min(rect.height, rect.width * 1.5), w = h / 1.5;
  const left = rect.left + (rect.width - w) / 2;
  const top = rect.top + (alignTop ? 0 : rect.height - h);
  const width = Math.min(84, w * .22);
  const bob = width * .065;
  const gap = Math.max(10, w * .04);
  // Conservative envelope includes ears, antenna, yaw and contour pixels.
  const height = width * .88;
  const x = Math.max(width / 2 + 8, Math.min(viewport.width - width / 2 - 8, left + w * .87));
  const bottom = top + h * .39 - gap;
  return {x, y: bottom - height / 2 - bob, width, height, bob,
    top: bottom - height - 2 * bob, bottom, handTop: top + h * .39};
}

export function readStarterLayout(host) {
  const portrait = document.querySelector('.professor-portrait img');
  if (!portrait) return null;
  const bounds = host.getBoundingClientRect(), rect = portrait.getBoundingClientRect();
  const layout = starterLayout({left: rect.left - bounds.left, top: rect.top - bounds.top,
    width: rect.width, height: rect.height}, {width: bounds.width, height: bounds.height},
    window.matchMedia('(max-width:760px)').matches);
  for (const label of document.querySelectorAll('.starter-label,.rival-label')) {
    label.style.left = `${Math.max(8, Math.min(bounds.width - label.offsetWidth - 8, layout.x - label.offsetWidth / 2))}px`;
    label.style.top = `${Math.max(8, layout.top - label.offsetHeight - 10)}px`;
  }
  return {...layout, viewportWidth: bounds.width, viewportHeight: bounds.height};
}
