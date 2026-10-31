# Digital Dost — Design System

## Product experience
Design a calm, capable, respectful learning environment for adults who may be new to everyday digital tools. The interface must feel like a thoughtfully designed learning product, not a generic AI chat template.

## Visual direction
- Cream (#F6EEDC) liquid-glass workspace with dark-root (#3A2A21) text and mushroom (#A39382) neutrals, inspired by the supplied Dribbble reference (floating glass rail, chat list and conversation panes).
- Frosted glass panels (blur + saturate, soft inner highlight, quiet borders) over soft blurred colour orbs.
- Warm amber is the contrasting action colour; cream is the text colour; mint marks safe/online/success; coral marks danger.
- Chat remains the primary focal point; supporting actions stay compact.
- Motion is purposeful: entrance rise, message pop, typing dots, button shine, risk gauge fill, scan line. All motion stops under reduced-motion settings.

## Core colour tokens
| Token | Hex | Use |
|---|---|---|
| Canvas teal | #315C63 | Main background |
| Deep teal | #1B3A40 | Depth and shadows |
| Warm cream | #F8F3E8 | Text and icons |
| Amber | #FFC766 | Primary buttons, active navigation, accents |
| Ink | #15353A | Text on amber |
| Mint | #8EF0C5 | Safe, online, success |
| Coral | #FF9E8A | Warnings and danger |

## Typography
- Use Inter for interface text, Plus Jakarta Sans for headings, Lora for accents (self-hosted via @fontsource, no external requests).
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
- Make text resizing available through the draggable 90%–125% text-size control without clipping or hiding controls.
- Read-aloud must be optional and controllable, with pause and stop actions.

## Product-specific safety
- All messaging, payment, identity, and account flows are simulations.
- Never imply a real message was sent or a real account was accessed.
- Never ask learners to enter real OTPs, passwords, PINs, or banking details.
- Explain when content is predefined, locally stored, or dependent on device capabilities.
- Do not label keyword-based guidance as live AI.

## Motion
Use small transitions only when they clarify state. Avoid parallax, cursor-following effects, or unnecessary 3D. The slow background orbs are CSS-only and disabled by reduced motion. React Bits or Three.js components require a clear learning purpose, reduced-motion fallback, and mobile performance check.

## Quality gate
Before a UI change is considered ready:
1. Review desktop and narrow mobile layouts.
2. Check text contrast and keyboard focus.
3. Test the main action and its error/empty states.
4. Verify reduced-motion behaviour.
5. Update README feature status and limitations.
