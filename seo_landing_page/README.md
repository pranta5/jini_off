# DedicatedVA AI SEO landing page

Plain HTML, CSS, and JavaScript. Open `dist/index.html` directly, or serve `dist` with any static web server. No build step or runtime package dependency is required.

## Interactions

- The five hero tabs rotate every 6.5 seconds and support clicking and arrow-key navigation. Rotation pauses on hover, keyboard focus, hidden tabs, and when the preview is offscreen. A pause/play control is provided. Reduced-motion preferences disable automatic rotation by default.
- The Search Shift paragraph reveals from gray to white as it scrolls into view.
- Audit tabs change their active color, description, and illustration.
- Industry rows expand their description and update the image on the right (below the list on mobile).
- FAQ rows use accessible native disclosure controls.
- The three requested CTAs and strategy-call button open a centered native dialog. Escape, the close button, and the backdrop close it; focus returns to the opening button.
- The quick audit form pre-fills the quote dialog's email and message. Contact and dialog forms share one HTML template, required-field validation, and consent validation.

## Before launch

1. Set `data-endpoint` on the form inside `#quote-template` to your submission endpoint. The handler sends JSON fields `name`, `company`, `email`, `phone`, `message`, and `consent`; the endpoint should validate these server-side and return a successful HTTP status only after acceptance. Without an endpoint, the page explicitly reports that details were **not sent**. Nothing is stored locally or transmitted elsewhere.
2. Replace the Figma placeholder heading, `info@company.com`, consent organization, and sample audit bullets with approved production content. Footer legal labels are plain text until actual policy URLs are available.
3. Review the illustrative chat recommendations before publication. These are static design examples, not live AI output or independently verified endorsements.

## Design provenance and remaining fidelity work

Source: Figma file `IJtUUD3xu9XqxZaj4ZfUpD`, desktop frame `24:53`.

The section order, dark palette, typography, initial content, and card layout follow the supplied design. Industry imagery is on the right per the request (the Figma desktop has it on the left). The quote form is included in Get in Touch using the separate form frame `50:439`.

Original assets exported locally include the header/footer logos, hero texture and ChatGPT graphics, default visibility dashboard, healthcare illustration, and disclosure icons. Figma's Starter-plan tool limit prevented retrieving all section contexts and remaining assets. The service icons, section dividers, pixel button arrows, and final CTA background are CSS/text approximations. Alternate audit and industry SVGs and previously unavailable tab descriptions are authored examples. Google AI and Gemini previews also use authored text; these should be reconciled with the remaining Figma variants when access is available. Therefore this is not yet a fully exact asset-for-asset reproduction.

## Verification

Browser checks cover 1600, 1366, 1024, 768, 390, and 320 px viewport widths; no horizontal page overflow; every tab and industry image; hero automatic rotation; keyboard tabs; FAQ disclosure; popup triggers/closing/focus restoration; form validation and prefill; reduced motion; and missing images/JavaScript errors. QA screenshots and local validation scripts are kept in ignored `.qa/`; Figma inspection files are in ignored `.design/`.
