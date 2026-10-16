# Testing Report

## Test matrix

Automated interaction tests were run with Playwright in two browsers at three screen sizes.

| Browser | Desktop (1440×900) | Tablet (768×1024) | Mobile (375×812) |
|---|---|---|---|
| Microsoft Edge | 24/24 pass | 28/28 pass | 28/28 pass |
| Mozilla Firefox | 24/24 pass | 28/28 pass | 28/28 pass |

Tablet and mobile run four extra checks for the hamburger menu.

## What was tested

- **Integration:** stylesheet applied, all images load, no console errors, no failed requests, no horizontal scrolling.
- **Navigation:** desktop menu visible; hamburger shown at 768px and below; menu opens and closes and updates `aria-expanded`; Escape and outside clicks close it; each nav link scrolls to its section below the sticky header, updates the URL and closes the menu; skip link appears on the first Tab.
- **Project filter:** All (3), JavaScript (2), API (1), Design (1); `aria-pressed` and the screen-reader status message update.
- **Lightbox:** opens by click and by Enter with the right image and caption; closes with Escape, the × button and a backdrop click; focus returns to the image that opened it.
- **Contact form:** empty submit shows three errors and focuses Name; an invalid email shows an error; errors clear while typing; a valid submit shows a success message and clears the form.
- **Visual check:** full-page screenshots reviewed at every size in both browsers.

## Issues found and fixed

| # | Issue | Fix |
|---|---|---|
| 1 | Pressing Escape didn't close the mobile menu. | Escape now closes it and returns focus to the hamburger button. |
| 2 | Clicking outside the open mobile menu didn't close it. | A click anywhere outside the nav now closes it. |
| 3 | Placeholder project links (`href="#"`) jumped the page back to the top. | Those links no longer jump the page until real URLs are added. |
| 4 | The skip link could appear above the visible area if the page was scrolled. | The skip link now uses `position: fixed`, so it always appears at the top of the window. |
| 5 | Hovering the skip link made its text unreadable (1.4:1 contrast). Found in the CSS activity. | Text stays white on a darker blue when hovered. |

## Known limitations

- Name, bio, project links, social links and email are placeholders.
- Images are SVG placeholders, not real screenshots.
- The contact form has no backend; it validates and confirms in the browser only.
- Google Chrome and Safari were not available for local testing. Edge uses the same engine as Chrome, so results should match it closely.
