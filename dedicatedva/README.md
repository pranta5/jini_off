# DedicatedVA landing page

A responsive, buildless HTML website based on the supplied Figma “va 2” frame.

## Files
- `dist/index.html` — page markup and shared form template.
- `dist/styles.css` — Figma styling, responsive layouts, and motion settings.
- `dist/script.js` — activity animation, process scrolling, FAQs, and form behavior.
- `dist/assets/` — original Figma assets, Bootstrap 5.3.8, and bundled fonts.

## Preview
Run `python -m http.server 8787 --directory dist` from this folder, then open http://localhost:8787.

## Behavior
The trusted review logos scroll continuously and pause on hover or focus. The partner activity stack cycles through three cards every four seconds. The process arrows reveal the partially visible fourth card on desktop and advance individual cards on smaller screens. FAQs expand one answer at a time.

The support-team button opens the same fields used in the hero form, with independent values, a blurred backdrop, close icon, Escape dismissal, and focus restoration.

Both forms are demonstrations: they validate required fields, prevent network submission, and clearly state that no enquiry has been sent. FAQ answers are placeholder text, and footer policy labels have no destinations.

## Accessibility and verification
The site supports keyboard navigation, labeled fields, reduced motion, and mobile layouts. Browser verification covered 320, 390, 768, 1440, and 1600 pixel viewports, asset loading, forms, modal interactions, FAQ collapse, arrow boundaries, and autoplay pause.

The design uses a system-font fallback for SF Pro. Hosting configuration is in `.openai/hosting.json`. No build or installation step is needed.
