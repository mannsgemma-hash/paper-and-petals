using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace PaperPetals.UI
{
    public enum PPRarity { Common, Uncommon, Rare, Heirloom }

    /// <summary>
    /// Collectible rarity badge — a small uppercase pill with a 2px colored ring.
    /// Static (non-interactive). Mirrors preview/comp_badges.html.
    ///
    /// Prefab anatomy:
    ///   Badge (Image = fill pill sprite, this script)
    ///   ├─ Stroke (Image, ring pill sprite)
    ///   └─ Label  (TextMeshProUGUI)
    /// </summary>
    [ExecuteAlways]
    public class PPBadge : MonoBehaviour
    {
        public PaperPetalsTheme theme;
        public PPRarity rarity = PPRarity.Common;

        [Header("Wiring")]
        public Image fill;
        public Image stroke;
        public TMP_Text label;

        private PaperPetalsTheme T => theme != null ? theme : PaperPetalsTheme.Active;

        private void OnEnable() => Apply();

        public void Apply()
        {
            var t = T; if (t == null) return;

            Color text, ring, bg;
            switch (rarity)
            {
                case PPRarity.Uncommon: text = t.accent;      ring = t.accentSoft; bg = t.surfaceCard; break;
                case PPRarity.Rare:     text = t.danger;      ring = t.softRose;   bg = t.surfaceCard; break;
                case PPRarity.Heirloom: text = t.surfaceCard; ring = t.accentHover; bg = t.accent;     break;
                default:                text = t.fg3;         ring = t.hairline;   bg = t.surfaceCard; break; // Common
            }

            if (fill)   { fill.sprite = t.fillPill;   fill.type = Image.Type.Sliced; fill.color = bg; }
            if (stroke) { stroke.sprite = t.strokePill; stroke.type = Image.Type.Sliced; stroke.color = ring; stroke.enabled = true; }
            if (label)
            {
                label.font = t.uiFont != null ? t.uiFont : label.font;
                label.fontSize = 10;
                label.characterSpacing = t.lsMicro;   // .22em ≈ wide micro tracking
                label.fontStyle = FontStyles.UpperCase;
                label.color = text;
                label.text = rarity.ToString();
            }
        }

#if UNITY_EDITOR
        private void OnValidate() { if (fill == null) fill = GetComponent<Image>(); Apply(); }
#endif
    }
}
