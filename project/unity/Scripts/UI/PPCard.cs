using UnityEngine;
using UnityEngine.UI;

namespace PaperPetals.UI
{
    /// <summary>
    /// Warm cream card with a parchment hairline and a soft, layered paper shadow.
    /// The optional "stitched" mode hides the border and shows an inset hand-stitch
    /// ring instead (echoes the wax-seal logo). Mirrors preview/comp_cards.html.
    ///
    /// Prefab anatomy:
    ///   Card (this script)
    ///   ├─ Shadow (Image = pp_shadow_r16, slightly larger, sits behind)
    ///   ├─ Fill   (Image = pp_fill_r16, the cream surface)   ← assign as 'fill'
    ///   ├─ Border (Image = pp_stroke_r16, the hairline ring)
    ///   ├─ Stitch (Image = inset dashed ring, optional)
    ///   └─ (your content goes here)
    /// </summary>
    [ExecuteAlways]
    public class PPCard : MonoBehaviour
    {
        public PaperPetalsTheme theme;
        public bool stitched = false;

        [Header("Wiring")]
        public Image shadow;
        public Image fill;
        public Image border;
        public Image stitch;

        private PaperPetalsTheme T => theme != null ? theme : PaperPetalsTheme.Active;

        private void OnEnable() => Apply();

        public void Apply()
        {
            var t = T; if (t == null) return;

            if (fill)   { fill.sprite = t.fillR16;   fill.type = Image.Type.Sliced; fill.color = t.surfaceCard; }
            if (shadow) { shadow.sprite = t.shadowR16; shadow.type = Image.Type.Sliced; shadow.color = t.shadowInk.A(0.22f); shadow.raycastTarget = false; }

            if (border) { border.sprite = t.strokeR16; border.type = Image.Type.Sliced; border.color = t.hairline; border.enabled = !stitched; border.raycastTarget = false; }
            if (stitch) { stitch.sprite = t.strokeR16; stitch.type = Image.Type.Sliced; stitch.color = t.stitch;    stitch.enabled = stitched;  stitch.raycastTarget = false; }
        }

#if UNITY_EDITOR
        private void OnValidate() => Apply();
#endif
    }
}
