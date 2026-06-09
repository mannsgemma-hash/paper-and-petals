using UnityEngine;

namespace PaperPetals.UI
{
    /// <summary>
    /// Paper &amp; Petals brand palette as runtime constants, plus a hex helper.
    /// These mirror colors_and_type.css exactly. Prefer reading colors from a
    /// <see cref="PaperPetalsTheme"/> asset in components; use this for code that
    /// needs a literal brand color without a theme reference.
    /// </summary>
    public static class PPColor
    {
        // ── Surfaces ───────────────────────────────────────────────
        public static readonly Color WarmWhite   = Hex("#F8F7F4"); // --bg-1  canvas
        public static readonly Color SoftLinen    = Hex("#EFE9E1"); // --bg-2  secondary surface
        public static readonly Color VintagePaper = Hex("#E5D8C8"); // --bg-3  tinted panel
        public static readonly Color Cream        = Hex("#FFFDF6"); // --surface-card lifted sheet

        // ── Muted accents ──────────────────────────────────────────
        public static readonly Color Terracotta   = Hex("#C47B63");
        public static readonly Color Sage          = Hex("#87937C");
        public static readonly Color DustyBlue     = Hex("#8FA3B8");
        public static readonly Color Mauve         = Hex("#A98C98");

        // ── Deep / action ──────────────────────────────────────────
        public static readonly Color Forest        = Hex("#4E6652"); // primary CTA
        public static readonly Color ForestDeep    = Hex("#3B4E3F"); // pressed / focus

        // ── Text ───────────────────────────────────────────────────
        public static readonly Color Charcoal      = Hex("#2B2A28"); // fg-1
        public static readonly Color Espresso      = Hex("#4B4038"); // fg-2
        public static readonly Color Stone         = Hex("#9A8A72"); // fg-4 muted
        public static readonly Color StoneWarm     = Hex("#7A6B52"); // fg-3 labels

        // ── Highlights ─────────────────────────────────────────────
        public static readonly Color AntiqueGold   = Hex("#C8A96B");
        public static readonly Color SoftRose       = Hex("#D7B7B0");
        public static readonly Color MutedOlive      = Hex("#7A7D5C");

        // ── Borders / hairlines ────────────────────────────────────
        public static readonly Color Hairline      = Hex("#C8BC9E");
        public static readonly Color HairlineSoft  = new Color(0.482f, 0.420f, 0.322f, 0.18f); // rgba(123,107,82,.18)
        public static readonly Color Stitch        = new Color(0.294f, 0.251f, 0.220f, 0.35f); // rgba(75,64,56,.35)

        // ── Semantic ───────────────────────────────────────────────
        public static readonly Color Success       = Hex("#7A8F6E");
        public static readonly Color Warning        = Hex("#C8A96B");
        public static readonly Color Danger          = Hex("#B26A5A");

        /// <summary>Warm charcoal used for soft, layered paper shadows (never pure black).</summary>
        public static readonly Color ShadowInk      = new Color(0.294f, 0.251f, 0.220f, 1f); // #4B4038-ish ink

        /// <summary>Parse a "#RRGGBB" or "#RRGGBBAA" string into a linear-correct Color.</summary>
        public static Color Hex(string hex)
        {
            if (ColorUtility.TryParseHtmlString(hex, out var c)) return c;
            Debug.LogWarning($"[PaperPetals] Could not parse color '{hex}'");
            return Color.magenta;
        }

        /// <summary>Same color at a different alpha (0–1).</summary>
        public static Color A(this Color c, float alpha) => new Color(c.r, c.g, c.b, alpha);
    }
}
