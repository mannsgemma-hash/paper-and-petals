using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using TMPro;

namespace PaperPetals.UI
{
    /// <summary>
    /// Filter chip — a pill toggle with an optional leading dot. Inherits the paper
    /// hover-lift / press feel from <see cref="PPHoverPress"/> and toggles its
    /// active state on click. Mirrors preview/comp_badges.html chips.
    ///
    /// Prefab anatomy:
    ///   Chip (Image = fill pill, this script)
    ///   ├─ Stroke (Image, ring pill — hairline when inactive)
    ///   ├─ Dot    (Image, optional small circle)
    ///   └─ Label  (TextMeshProUGUI)
    /// </summary>
    public class PPChip : PPHoverPress, IPointerClickHandler
    {
        [Header("Chip")]
        public bool active = false;
        public bool toggleOnClick = true;
        public UnityEvent<bool> onValueChanged;

        [Header("Wiring")]
        public Image fill;
        public Image stroke;
        public Image dot;
        public TMP_Text label;

        public void OnPointerClick(PointerEventData e)
        {
            if (!toggleOnClick || !interactable) return;
            SetActive(!active);
        }

        public void SetActive(bool on)
        {
            active = on;
            Apply();
            onValueChanged?.Invoke(active);
        }

        protected override void Apply()
        {
            var t = T; if (t == null) return;

            Color bg   = active ? t.accent : t.surfaceCard;
            Color ring = active ? t.accent : t.hairline;
            Color text = active ? t.surfaceCard : t.fg2;

            if (fill)   { fill.sprite = t.fillPill;   fill.type = Image.Type.Sliced; fill.color = bg; }
            if (stroke) { stroke.sprite = t.strokePill; stroke.type = Image.Type.Sliced; stroke.color = ring; }
            if (dot)    { dot.color = text; }
            if (label)
            {
                label.font = t.uiFont != null ? t.uiFont : label.font;
                label.fontSize = 13;
                label.color = text;
            }
        }

        // Warm the inactive background slightly on hover (matches secondary-button hover).
        protected override void OnHover(bool hovering)
        {
            if (active || fill == null) return;
            fill.color = hovering ? T.bg2 : T.surfaceCard;
        }
    }
}
