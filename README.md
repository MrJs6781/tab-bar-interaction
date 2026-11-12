# Tab Bar Interaction

A single-file, dependency-free recreation of the Dribbble motion concept
[Tab Bar Interaction XVIII](https://dribbble.com/shots/6117913-Tab-Bar-Interaction-XVIII) by Volorf,
built from the shot's video frames, with a few additions.

## Files
- `index.html` markup
- `style.css` styles and theme tokens
- `script.js` spring engine and interactions

## What's inside
- Spring-physics animation (fully interruptible, no keyframes)
- Vertical motion blur driven by velocity
- Liquid drop that stretches and squashes while switching between options
- The center button remembers your last choice
- Four nav icons (home, favorites, profile, notifications) with a gooey active indicator that stretches as it travels
- Keyboard and screen-reader friendly, respects `prefers-reduced-motion`

## Use
Open `index.html`. No build step.

Themes via URL hash: `#violet` (default), `#pink`, `#mint`, plus `-light` or `-dark`, e.g. `#mint-dark`.

## Credit
Nav icons are from [Feather](https://feathericons.com) (MIT).

Original design: Volorf on Dribbble. This is an independent implementation, not affiliated with the designer.
