# DedicatedVA chatbot landing page

Open `index.html` directly, or serve this folder with `python -m http.server 8080`.
The page uses plain HTML, CSS, and JavaScript; there is no build step or runtime dependency.

## Design reference

Implemented from the supplied `Frame 2147223809.pdf`, including its alternate chat, industry, capability, and model states. Figma access was unavailable. Local WebP assets are extracted from the PDF; `assets/manifest.json` records their source coordinates and dimensions. Placeholder headings, contact details, industry description, and consent text are preserved from the supplied design. Four FAQ answers absent from the PDF are draft copy in `script.js`.

## Form integration

Set `CONSULTATION_ENDPOINT` near the top of `script.js` to your form API URL. The endpoint receives JSON fields `name`, `company`, `email`, `phone`, `message`, and `consent`. It should validate input server-side and return a successful HTTP status only after accepting the request. Cross-origin endpoints must allow the site's origin.

Until an endpoint is configured, forms validate locally and clearly state that nothing has been sent. The strategy call link works independently. No contact data is stored in local storage.

## Interactions

- Four chat examples rotate every seven seconds, with staggered message animations, pause control, and direct selectors. Hover, keyboard focus, hidden tabs, and reduced-motion preferences pause autoplay.
- Partner and technology logos loop horizontally; hover/focus pauses scrolling.
- Industry selectors update the description and matching illustration.
- Capability tabs and nested AI model tabs support keyboard arrows, Home, and End.
- FAQ accordions use native `details` elements.
- Consultation CTAs open a centered native dialog with Escape, outside-click, close button, focus containment, and focus restoration. The hero form prefills the popup.

## Verification

Checked in Chromium/Edge at 320, 390, 768, 1024, 1280, 1440, and 1920 pixels. Checks cover horizontal overflow, local image loading, all tab/industry/chat states, FAQ behavior, modal controls, form prefilling, and the unconfigured submission state. Reduced-motion styling is included.
