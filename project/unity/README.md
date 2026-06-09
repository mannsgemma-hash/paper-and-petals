# Paper & Petals — Unity UI Kit

Drop-in recreation of the Paper & Petals design system for **Unity 6** (uGUI +
TextMeshPro). Open **`PaperPetals_Unity_Guide.html`** in a browser for the full,
illustrated build guide — this file is the quick version.

## Contents

```
unity/
├── PaperPetals_Unity_Guide.html   ← read this (fonts, tokens, sprites, anatomy)
├── Scripts/UI/                    ← C#: copy into Assets/Scripts/UI
│   ├── PaperPetalsTheme.cs        ScriptableObject — all colors/fonts/sprites/motion
│   ├── PPColor.cs  PPEasing.cs    palette constants + CSS-accurate CubicBezier
│   ├── PPMotion.cs  PPHoverPress.cs   lift + press-scale tween
│   ├── PPButton.cs  PPBadge.cs  PPChip.cs
│   ├── PPCard.cs  PPInputField.cs  PPNavItem.cs  PPNavGroup.cs
│   └── Editor/PaperPetalsMenu.cs  menu: create theme + apply sprite import
└── Sprites/pp_*.png               ← placeholder 9-slice fills/rings/shadow
```

## Quick start

1. **Import TextMeshPro** (Window ▸ TextMeshPro ▸ Import TMP Essentials).
2. Copy **`Scripts/UI`** into `Assets/Scripts/UI` and **`Sprites`** anywhere under `Assets/`.
3. **Tools ▸ Paper & Petals ▸ Create Theme Asset** → writes
   `Assets/Resources/PaperPetalsTheme.asset` with brand colors pre-filled.
   Components auto-load it from Resources (no manual wiring).
4. **Tools ▸ Paper & Petals ▸ Apply Sprite Import Settings** → sets the
   `pp_*.png` sprites to Sliced, 400 PPU, correct 9-slice borders. Then drag them
   onto the theme's sprite slots.
5. Bake **TMP Font Assets** from the four recommended families and assign them to
   the theme: Spectral (display), Nunito Sans (UI), EB Garamond Italic (script),
   Pinyon Script (flourish). All are SIL OFL and embeddable in a build — the
   original Adobe fonts are not.

Build any component's hierarchy as shown in the guide, wire its graphics, and it
styles itself from the theme in edit mode.

## Notes

- **Reference canvas:** 1024 × 768, Canvas Scaler = Scale With Screen Size, match 0.5.
- **Sprites are placeholders** — white & tintable. Swap for hand-painted paper art
  any time; keep the same 9-slice border so layouts don't shift.
- **Icons:** Tabler outline (1.75px stroke), imported as Sprites and tinted — not filled.
- **Accessibility floors carried over:** 18pt body min, 48×48 tap targets, 4.5:1 contrast.
- Namespace is `PaperPetals.UI`. C# targets Unity 6 (C# 9).
```

— Paper & Petals · v1.0
