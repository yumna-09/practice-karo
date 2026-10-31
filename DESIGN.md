# Digital Dost — Design System

## Product experience
Design a calm, capable, respectful learning environment for adults who may be new to everyday digital tools. The interface must feel like a thoughtfully designed learning product, not a generic AI chat template.

## Visual direction
- Warm ivory and parchment foundations with grounded forest-green actions.
- Sage is a supporting colour, not the only source of contrast.
- Use restrained terracotta for focus indicators and meaningful highlights.
- Avoid washed-out pastel text, low-contrast grey, purple gradients, excessive glass effects, nested cards, and decorative icon tiles above every heading.
- Prefer clear surfaces, strong hierarchy, generous whitespace, and subtle borders over stacks of cards.

## Core colour tokens
| Token | Hex | Use |
|---|---|---|
| Background | #EEE9DF | Main canvas |
| Surface | #FFFDF8 | Primary panels |
| Surface soft | #E3E8DC | Supporting surfaces |
| Text | #24362D | Body and headings |
| Muted text | #526356 | Secondary copy; verify contrast by size |
| Primary | #315C45 | Main actions and active states |
| Primary hover | #244B37 | Hover and pressed states |
| Border | #CBD3C5 | Dividers and boundaries |
| Accent | #B66B43 | Focus and selective emphasis |
| Dark background | #17231C | Dark theme canvas |
| Dark surface | #24352A | Dark theme panels |

## Typography
- Use DM Sans for interface text and Manrope for selected display headings.
- Body text should be comfortable at 16px or larger where practical.
- Avoid tiny labels. Essential instructions must remain readable on laptop and mobile.
- Use sentence case for navigation and controls; reserve uppercase for short, secondary eyebrow labels.

## Layout and interaction
- Keep the main learning task visually dominant.
- Use a clear navigation rail on wide screens and a scrollable navigation row on small screens.
- Primary actions must use descriptive labels such as “Add to practice chat”, not ambiguous icon-only controls.
- Keep touch targets comfortably large (aim for 44px minimum).
- Show a visible focus ring for keyboard users.
- Preserve browser zoom and responsive reflow.
- Respect reduced-motion preferences; animation must never carry essential meaning.

## Accessibility
- Maintain WCAG AA contrast as a minimum target for text and controls.
- Never communicate safety status through colour alone.
- Provide meaningful labels for inputs, buttons, and attachment previews.
- Use plain language and short step-by-step instructions.
- Make text resizing available without clipping or hiding controls.
- Read-aloud must be optional and controllable, with pause and stop actions.

## Product-specific safety
- All messaging, payment, identity, and account flows are simulations.
- Never imply a real message was sent or a real account was accessed.
- Never ask learners to enter real OTPs, passwords, PINs, or banking details.
- Explain when content is predefined, locally stored, or dependent on device capabilities.
- Do not label keyword-based guidance as live AI.

## Motion
Use small transitions only when they clarify state. Avoid autoplaying backgrounds, parallax, cursor-following effects, or unnecessary 3D. React Bits or Three.js components require a clear learning purpose, reduced-motion fallback, and mobile performance check.

## Quality gate
Before a UI change is considered ready:
1. Review desktop and narrow mobile layouts.
2. Check text contrast and keyboard focus.
3. Test the main action and its error/empty states.
4. Verify reduced-motion behaviour.
5. Update README feature status and limitations.
