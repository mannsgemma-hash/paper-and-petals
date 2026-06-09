using UnityEngine;
using TMPro;

namespace PaperPetals.UI
{
    /// <summary>
    /// The single source of truth for Paper &amp; Petals styling in Unity — colors,
    /// fonts, sliced sprites, metrics and motion. Create one via
    /// <c>Assets ▸ Create ▸ Paper &amp; Petals ▸ Theme</c>, drop it in a Resources
    /// folder named exactly <c>PaperPetalsTheme</c> (so it auto-loads), then assign
    /// fonts/sprites in the Inspector. Components read everything from here.
    /// </summary>
    [CreateAssetMenu(fileName = "PaperPetalsTheme", menuName = "Paper & Petals/Theme", order = 0)]
    public class PaperPetalsTheme : ScriptableObject
    {
        // ──────────────────────────────────────────────────────────
        //  Auto-loading singleton
        // ──────────────────────────────────────────────────────────
        private static PaperPetalsTheme _active;

        /// <summary>
        /// The theme components fall back to when none is assigned. Loads
        /// <c>Resources/PaperPetalsTheme.asset</c> automatically; you may also set it
        /// manually at startup.
        /// </summary>
        public static PaperPetalsTheme Active
        {
            get
            {
                if (_active == null) _active = Resources.Load<PaperPetalsTheme>("PaperPetalsTheme");
                return _active;
            }
            set => _active = value;
        }

        // ──────────────────────────────────────────────────────────
        //  Colors  (mirror colors_and_type.css)
        // ──────────────────────────────────────────────────────────
        [Header("Surfaces")]
        public Color bg1          = PPColor.WarmWhite;
        public Color bg2          = PPColor.SoftLinen;
        public Color bg3          = PPColor.VintagePaper;
        public Color surfaceCard  = PPColor.Cream;

        [Header("Text")]
        public Color fg1 = PPColor.Charcoal;   // primary
        public Color fg2 = PPColor.Espresso;   // secondary
        public Color fg3 = PPColor.StoneWarm;  // labels / tertiary
        public Color fg4 = PPColor.Stone;      // muted / disabled

        [Header("Action & accents")]
        public Color accent      = PPColor.Forest;
        public Color accentHover = PPColor.ForestDeep;
        public Color accentSoft  = PPColor.Sage;
        public Color highlight   = PPColor.AntiqueGold;
        public Color terracotta  = PPColor.Terracotta;
        public Color mauve       = PPColor.Mauve;
        public Color dustyBlue   = PPColor.DustyBlue;
        public Color softRose    = PPColor.SoftRose;

        [Header("Lines & semantic")]
        public Color hairline     = PPColor.Hairline;
        public Color hairlineSoft = PPColor.HairlineSoft;
        public Color stitch       = PPColor.Stitch;
        public Color danger       = PPColor.Danger;
        public Color success      = PPColor.Success;
        public Color shadowInk    = PPColor.ShadowInk;

        // ──────────────────────────────────────────────────────────
        //  Fonts  (assign TMP Font Assets — see the build guide)
        // ──────────────────────────────────────────────────────────
        [Header("Fonts (TMP Font Assets)")]
        [Tooltip("Screen titles, journal names, hero headings. Recommended: Spectral.")]
        public TMP_FontAsset displayFont;
        [Tooltip("Buttons, nav, body, labels — the full UI stack. Recommended: Nunito Sans.")]
        public TMP_FontAsset uiFont;
        [Tooltip("Seasonal collection names, volume titles, in-line emphasis. Recommended: EB Garamond Italic.")]
        public TMP_FontAsset scriptFont;
        [Tooltip("Ornamental flourish moments only — hero quotes. Recommended: Pinyon Script.")]
        public TMP_FontAsset flourishFont;

        // ──────────────────────────────────────────────────────────
        //  Sliced sprites  (assign the pp_*.png placeholders)
        // ──────────────────────────────────────────────────────────
        [Header("Fill sprites (9-sliced, opaque white, tinted at runtime)")]
        public Sprite fillR6;     // buttons, inputs
        public Sprite fillR10;    // tool palette, tray cards
        public Sprite fillR14;    // nav rail / topbar
        public Sprite fillR16;    // cards, panels
        public Sprite fillPill;   // pills, badges, chips
        public Sprite fillCircle; // back button

        [Header("Stroke sprites (9-sliced, ring only, tinted at runtime)")]
        public Sprite strokeR6;
        public Sprite strokeR14;
        public Sprite strokeR16;
        public Sprite strokePill;
        public Sprite strokeCircle;

        [Header("Soft paper drop-shadow")]
        public Sprite shadowR16;

        // ──────────────────────────────────────────────────────────
        //  Type scale (px @ 1024×768 reference) & spacing
        // ──────────────────────────────────────────────────────────
        [Header("Type scale (px)")]
        public float fsH1 = 42, fsH2 = 32, fsH3 = 24, fsBodyLg = 18, fsBody = 16, fsCaption = 13, fsMicro = 11;

        [Header("Letter spacing (TMP units ≈ em×100)")]
        public float lsUI = 0.5f, lsLabel = 16f, lsMicro = 20f, lsDisplay = -0.5f;

        // ──────────────────────────────────────────────────────────
        //  Radii / borders (px @ reference). Used for sprite selection + docs.
        // ──────────────────────────────────────────────────────────
        [Header("Metrics (px)")]
        public float rSm = 6, rMd = 10, rLg = 16, rXl = 24;
        public float bwHair = 1f, bwCard = 1.5f, bwCover = 3f;
        public float tapMin = 48f;   // accessibility floor

        // ──────────────────────────────────────────────────────────
        //  Motion (mirror --dur-* and --ease-*)
        // ──────────────────────────────────────────────────────────
        [Header("Motion")]
        public float durFast = 0.15f;   // tap response
        public float durBase = 0.24f;   // card / modal entrance
        public float durSlow = 0.48f;   // drift-in
        public CubicBezier easePaper = CubicBezier.Paper;
        public CubicBezier easePetal = CubicBezier.Petal;
        public CubicBezier easePress = CubicBezier.Press;

        [Header("Hover / press feel")]
        [Tooltip("Pixels the element lifts on hover (translateY). Cards/buttons: 2.")]
        public float hoverLift = 2f;
        [Tooltip("Scale on press. CSS uses 0.96.")]
        public float pressScale = 0.96f;

        /// <summary>Reset every color back to the canonical brand values.</summary>
        [ContextMenu("Reset colors to Paper & Petals defaults")]
        public void ResetToBrandDefaults()
        {
            bg1 = PPColor.WarmWhite; bg2 = PPColor.SoftLinen; bg3 = PPColor.VintagePaper; surfaceCard = PPColor.Cream;
            fg1 = PPColor.Charcoal; fg2 = PPColor.Espresso; fg3 = PPColor.StoneWarm; fg4 = PPColor.Stone;
            accent = PPColor.Forest; accentHover = PPColor.ForestDeep; accentSoft = PPColor.Sage; highlight = PPColor.AntiqueGold;
            terracotta = PPColor.Terracotta; mauve = PPColor.Mauve; dustyBlue = PPColor.DustyBlue; softRose = PPColor.SoftRose;
            hairline = PPColor.Hairline; hairlineSoft = PPColor.HairlineSoft; stitch = PPColor.Stitch;
            danger = PPColor.Danger; success = PPColor.Success; shadowInk = PPColor.ShadowInk;
        }
    }
}
