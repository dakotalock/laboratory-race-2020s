// Run the browser's pinned CDN imports against the identical npm release.
export function resolve(specifier, context, next) {
  const root = 'https://cdn.jsdelivr.net/npm/three@0.180.0/';
  if (specifier === root + 'build/three.module.js') specifier = 'three';
  else if (specifier.startsWith(root + 'examples/jsm/'))
    specifier = specifier.replace(root + 'examples/jsm/', 'three/addons/');
  return next(specifier, context);
}
