# Training visual direction

The Today screen combines clear activity summaries and goals, informed by
[Fitbit's design overview](https://blog.google/products-and-platforms/devices/fitbit/introducing-the-all-new-fitbit-app/),
with the bold training photography and typography seen on [Shred](https://www.shred.app/).
The app uses its own layout, artwork, and copy. No brand assets were copied.

## Original photograph

- Asset: `public/images/training-barbell.jpg`
- Created with the built-in image generation tool; re-encoded as JPEG for delivery.
- Used on the Today training card and desktop sign-in panel.
- Decorative image: the HTML copy carries all content and actions.
- The original generated PNG remains in the Codex generated-images directory.

Generation prompt:

> Use case: photorealistic-natural. Asset type: background photograph for a premium personal workout tracker training card, also cropped for sign-in. Create a wide 3:2 editorial black-and-white sports photograph of a loaded barbell resting on dark rubber flooring in a quiet contemporary weight room. Camera low to the floor, close-up textured black bumper plates and metal collar on the RIGHT third in sharp focus, bar extending into a softly blurred squat rack in the background. LEFT half is very dark negative space for UI text. Real subtle film grain, directional window light from upper right, crisp highlights on steel, deep charcoal shadows, believable physical equipment. Restrained premium athletic magazine photography, no people, no lettering, no logos, no watermarks, no illustrations, no collage, no graphic overlays.

## Equipment illustrations

`src/components/TrainingArtwork.tsx` provides original SVG equipment illustrations
using the app's existing stroke style. The focus is derived from each routine's
actual exercise categories, so custom names still work. General strength is the
fallback for empty or unclassified routines.

## Data and states

The weekly ring uses completed workouts and the user's weekly target. It remains
empty at zero and visually caps at 100% while the numeric total remains accurate.
The featured routine is the first routine in the user's list; it is not a generated
training recommendation. An active workout replaces it with a resume action.
Exercise completion in the workout screen requires every set (or the cardio
entry) to be marked complete.
